import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * Validates admin password. Call via HTTP POST with body: { "password": "..." }
 * Returns 200 + { "ok": true } if valid, 401 + { "ok": false } if invalid.
 * To use from the admin page, add an HTTP API route in backend.ts that points to this function.
 */
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const expected = process.env.ADMIN_PASSWORD || "";
  let body: { password?: string } = {};
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    return {
      statusCode: 400,
      headers: CORS,
      body: JSON.stringify({ ok: false, error: "Invalid JSON" }),
    };
  }

  const password = body.password ?? "";
  if (!expected) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ ok: false, error: "ADMIN_PASSWORD not configured" }),
    };
  }

  if (password !== expected) {
    return {
      statusCode: 401,
      headers: CORS,
      body: JSON.stringify({ ok: false }),
    };
  }

  return {
    statusCode: 200,
    headers: CORS,
    body: JSON.stringify({ ok: true }),
  };
};
