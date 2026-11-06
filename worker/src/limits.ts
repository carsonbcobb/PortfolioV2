import { LIMITS } from "./config";
import type { Env, Report } from "./types";

export function utcDay(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function dailyLimit(env: Env): number {
  const n = parseInt(env.DAILY_CHECK_LIMIT ?? "50", 10);
  return Number.isFinite(n) && n >= 0 ? n : 50;
}

async function readCount(env: Env, key: string): Promise<number> {
  const v = await env.CHECKS.get(key);
  const n = v ? parseInt(v, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

export const dayKey = (day = utcDay()) => `day:${day}`;
export const ipKey = (ip: string, day = utcDay()) => `ip:${ip}:${day}`;
// v2: reports from before the store type check and answer validation are not served again.
export const reportKey = (domain: string) => `report:v2:${domain}`;

export async function todayCount(env: Env): Promise<number> {
  return readCount(env, dayKey());
}

export async function ipCount(env: Env, ip: string): Promise<number> {
  return readCount(env, ipKey(ip));
}

/**
 * Increments both counters when a fresh check starts. KV has no atomic
 * increment, so two simultaneous checks can undercount by one; fine for a cap.
 */
export async function incrementCounters(env: Env, ip: string): Promise<void> {
  const [day, ipc] = await Promise.all([todayCount(env), ipCount(env, ip)]);
  await Promise.all([
    env.CHECKS.put(dayKey(), String(day + 1), { expirationTtl: LIMITS.counterTtlSeconds }),
    env.CHECKS.put(ipKey(ip), String(ipc + 1), { expirationTtl: LIMITS.counterTtlSeconds }),
  ]);
}

export async function getCachedReport(env: Env, domain: string): Promise<Report | null> {
  try {
    return await env.CHECKS.get<Report>(reportKey(domain), "json");
  } catch {
    return null;
  }
}

export async function cacheReport(env: Env, report: Report): Promise<void> {
  await env.CHECKS.put(reportKey(report.domain), JSON.stringify(report), { expirationTtl: LIMITS.reportTtlSeconds });
}
