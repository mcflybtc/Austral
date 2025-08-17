import { NextRequest } from "next/server";
import { ALL_BODIES, BodyName } from "@/lib/astro-api";

export function jsonError(err: unknown, status = 500) {
  const message = err instanceof Error ? err.message : String(err);
  return Response.json({ ok: false, error: message }, { status });
}

export function num(v: string | null, d: number) {
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) ? n : d;
}

export function str(v: string | null, d = "") {
  return v ?? d;
}

export function parseQuery(req: NextRequest) {
  const url = new URL(req.url);

  const lat = num(url.searchParams.get("lat"), -3.71722);
  if (lat < -90 || lat > 90) throw new Error("invalid latitude");

  const lon = num(url.searchParams.get("lon"), -38.5434);
  if (lon < -180 || lon > 180) throw new Error("invalid longitude");

  const tz = str(url.searchParams.get("tz"), "America/Fortaleza");
  try {
    new Intl.DateTimeFormat(undefined, { timeZone: tz });
  } catch {
    throw new Error("invalid timezone");
  }

  const whenStr = str(url.searchParams.get("when"), new Date().toISOString());
  const whenDate = new Date(whenStr);
  if (isNaN(whenDate.getTime())) throw new Error("invalid date");

  const bodiesParam = str(url.searchParams.get("bodies"), "");
  let bodies: BodyName[] | undefined = undefined;
  if (bodiesParam) {
    const list = bodiesParam.split(",").map((s) => s.trim()).filter(Boolean);
    const valid = list.filter((b) => ALL_BODIES.includes(b as any)) as BodyName[];
    if (valid.length) bodies = valid;
  }

  return { url, lat, lon, tz, when: whenDate.toISOString(), bodies };
}
