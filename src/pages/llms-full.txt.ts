import type { APIRoute } from 'astro';
import { llmsFullText } from '../data/llms';

// The long version of /llms.txt: plan detail, case studies and the FAQ answers, from the same data.
export const GET: APIRoute = () => new Response(llmsFullText(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
