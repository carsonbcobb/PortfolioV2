import type { APIRoute } from 'astro';
import { llmsText } from '../data/llms';

// Plain markdown summary of the site at /llms.txt, built in src/data/llms.ts from facts.ts and the plan data.
export const GET: APIRoute = () => new Response(llmsText(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
