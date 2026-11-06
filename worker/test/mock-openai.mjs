// Tiny mock of the OpenAI Responses API (POST /responses) for local testing.
// It works out which call it is from the request body:
//   - tools contains web_search            -> search call (answer + url_citation annotations + web_search_call item)
//   - text.format.name === buyer_questions -> 3 buyer questions
//   - text.format.name === brand_parse     -> brands parsed from the answer text it was given
//   - text.format.name === accuracy_grade  -> grade JSON
//   - text.format.name === top_findings    -> 3 findings written from the digest it was given
// Control endpoints: POST /__mode {"failSearch":true|false}, GET /__stats, POST /__reset
//
// Usage: node test/mock-openai.mjs [port]   (default 8790)
import http from "node:http";

const port = Number(process.argv[2] || process.env.MOCK_PORT || 8790);
const state = { failSearch: false, brand: "Example", domain: "example.com", searchCount: 0 };
const stats = { calls: 0, byKind: {}, usage: { input: 0, output: 0 }, webSearchCalls: 0 };

const COMPETITORS = ["Northvale", "Kestrel & Co", "Bramblewood", "Ostra Goods", "Lumen Supply", "Fieldmark"];

// Token counts each kind of call reports (roughly what the real API returns for these prompts).
const USAGE = {
  buyer_questions: { input_tokens: 320, output_tokens: 180 },
  search: { input_tokens: 8500, output_tokens: 650 },
  brand_parse: { input_tokens: 1400, output_tokens: 90 },
  accuracy_grade: { input_tokens: 1900, output_tokens: 160 },
  top_findings: { input_tokens: 900, output_tokens: 220 },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (a, b) => a + Math.random() * (b - a);

function textOf(input) {
  if (typeof input === "string") return input;
  if (Array.isArray(input)) return input.map((m) => (typeof m.content === "string" ? m.content : JSON.stringify(m.content))).join("\n");
  return "";
}

function respond(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

function envelope(model, output, usage) {
  stats.usage.input += usage.input_tokens;
  stats.usage.output += usage.output_tokens;
  return {
    id: "resp_mock_" + Math.random().toString(36).slice(2),
    object: "response",
    created_at: Math.floor(Date.now() / 1000),
    status: "completed",
    model,
    output,
    usage: { ...usage, total_tokens: usage.input_tokens + usage.output_tokens },
  };
}

function message(text, annotations = []) {
  return {
    type: "message",
    id: "msg_" + Math.random().toString(36).slice(2),
    status: "completed",
    role: "assistant",
    content: [{ type: "output_text", text, annotations }],
  };
}

function searchAnswer(question) {
  const isAccuracy = /^What is .+ and what do they sell\?$/.test(question.trim());
  const sources = [];
  let text;
  if (isAccuracy) {
    const brand = question.trim().match(/^What is (.+) and what do they sell\?$/)[1];
    state.brand = brand;
    text =
      `${state.brand} is a direct to consumer brand that sells its products online at ${state.domain}. ` +
      `It is known for a focused product range and an emphasis on materials and comfort. ` +
      `Reviewers mention fast shipping and an easy return policy.`;
    sources.push({ url: `https://${state.domain}/pages/about`, title: `About ${state.brand}` });
    sources.push({ url: "https://www.example-reviews.com/brand-review", title: `${state.brand} review` });
  } else {
    const n = state.searchCount++ % 3;
    // Pattern across the 3 questions: brand 1st and cited, absent, 3rd.
    const brands = COMPETITORS.slice(n % 3, (n % 3) + 4);
    if (n === 0) brands.unshift(state.brand);
    if (n === 2) brands.splice(2, 0, state.brand);
    if (n === 4) brands.push(state.brand);
    const lines = brands.map((b, i) => `${i + 1}. **${b}**: a solid pick with good reviews for this need.`);
    // Retailers and publishers the parser must never count as competing brands.
    lines.push("You can find most of these on **Amazon**, and **Wirecutter** has a longer roundup. Some sellers on **Etsy** make similar ones.");
    text = `Here are some good options based on what you described:\n\n${lines.join("\n")}\n\nPick based on your budget and how you plan to use it.`;
    sources.push({ url: "https://www.example-reviews.com/best-picks", title: "The best picks this year" });
    sources.push({ url: "https://www.reddit.com/r/BuyItForLife/comments/abc", title: "Reddit thread" });
    if (n === 0) sources.push({ url: `https://www.${state.domain}/`, title: state.brand });
  }
  const annotations = sources.map((s) => ({
    type: "url_citation",
    start_index: 0,
    end_index: Math.min(40, text.length),
    url: s.url + (s.url.includes("?") ? "&" : "?") + "utm_source=openai",
    title: s.title,
  }));
  const call = {
    type: "web_search_call",
    id: "ws_" + Math.random().toString(36).slice(2),
    status: "completed",
    action: { type: "search", query: question, sources: sources.map((s) => ({ type: "url", url: s.url })) },
  };
  return { output: [call, message(text, annotations)], searches: 1 };
}

// One entry per "ANSWER n:" block, in order, the way the worker asks for all answers in one call.
function parseBrands(userText) {
  const m = userText.match(/Target brand: (.+?) \(website ([^)]+)\)/);
  const target = m ? m[1] : state.brand;
  const blocks = userText.split(/ANSWER \d+:\n/).slice(1);
  return {
    answers: blocks.map((answer) => {
      const names = [...answer.matchAll(/\*\*(.+?)\*\*/g)].map((x) => x[1]);
      // Like the real parser: each name gets a kind. Etsy is mislabeled as a brand on purpose, so the deny list is tested too.
      const KIND = { Amazon: "retailer", Wirecutter: "publisher" };
      const brands = names.map((name) => ({ name, kind: KIND[name] ?? "brand" }));
      const real = names.filter((n) => !KIND[n] && n !== "Etsy");
      const idx = real.findIndex((b) => b.toLowerCase() === target.toLowerCase());
      return { brands, mentioned: idx >= 0, position: idx >= 0 ? idx + 1 : null, clarifying: false };
    }),
  };
}

const server = http.createServer(async (req, res) => {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/__mode" && req.method === "POST") {
    Object.assign(state, JSON.parse(raw || "{}"));
    return respond(res, 200, { ok: true, state });
  }
  if (url.pathname === "/__stats") return respond(res, 200, { ...stats, state });
  if (url.pathname === "/__reset") {
    Object.assign(stats, { calls: 0, byKind: {}, usage: { input: 0, output: 0 }, webSearchCalls: 0 });
    state.searchCount = 0;
    return respond(res, 200, { ok: true });
  }
  if (!(url.pathname.endsWith("/responses") && req.method === "POST")) return respond(res, 404, { error: { message: "not found" } });
  if (!/^Bearer \S+/.test(req.headers.authorization || "")) return respond(res, 401, { error: { message: "missing key" } });

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return respond(res, 400, { error: { message: "bad json" } });
  }
  stats.calls++;
  const isSearch = Array.isArray(body.tools) && body.tools.some((t) => t.type === "web_search");
  const kind = isSearch ? "search" : body.text?.format?.name || "unknown";
  stats.byKind[kind] = (stats.byKind[kind] || 0) + 1;
  const userText = textOf(body.input);

  if (isSearch) {
    if (state.failSearch) {
      await sleep(200);
      return respond(res, 500, { error: { message: "mock search failure", type: "server_error" } });
    }
    await sleep(rand(2500, 5000));
    const { output, searches } = searchAnswer(userText);
    stats.webSearchCalls += searches;
    return respond(res, 200, envelope(body.model, output, USAGE.search));
  }

  await sleep(rand(400, 1200));
  let result;
  switch (kind) {
    case "buyer_questions": {
      const m = userText.match(/Do not mention "(.+?)" or (\S+?)\.\n/);
      if (m) Object.assign(state, { brand: m[1], domain: m[2], searchCount: 0 });
      result = {
        questions: [
          { product: 1, question: "I'm on my feet all day and my current pair wears out fast, what should I buy that actually lasts?" },
          { product: 2, question: "What's a good brand that uses sustainable materials and isn't crazy expensive?" },
          { product: 3, question: "I have wide feet and most shoes feel tight, any recommendations?" },
        ],
      };
      break;
    }
    case "brand_parse":
      result = parseBrands(userText);
      break;
    case "accuracy_grade":
      result = {
        grade: "partly accurate",
        missing: ["It does not mention the main product lines shown on the homepage.", "It does not mention the free shipping offer."],
        wrong: [],
      };
      break;
    case "top_findings": {
      let d = {};
      try {
        d = JSON.parse(userText.split("\n").pop());
      } catch {}
      const v = d.visibility || { recommended_in: 0, of_questions_scored: 3, cited_sources: 0, sources_brand_is_on: 0 };
      result = {
        findings: [
          { text: `ChatGPT recommended you in ${v.recommended_in} of ${v.of_questions_scored} buyer questions.`, cost: "Every question you miss sends a ready buyer to a competitor." },
          { text: `AI cited ${v.cited_sources} sources for those answers, and you are on ${v.sources_brand_is_on} of them.`, cost: "The sources AI trusts decide who it names." },
          { text: "ChatGPT's description of your brand leaves out key details.", cost: "Those details are often why a shopper would choose you." },
        ],
      };
      break;
    }
    default:
      return respond(res, 400, { error: { message: "unknown call " + kind } });
  }
  return respond(res, 200, envelope(body.model, [message(JSON.stringify(result))], USAGE[kind] || { input_tokens: 500, output_tokens: 100 }));
});

server.listen(port, () => console.log(`mock openai listening on http://127.0.0.1:${port}`));
