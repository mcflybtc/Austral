import { NextRequest } from "next/server";
import * as API from "@/lib/astro-api";
import { num, str } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const lat = num(url.searchParams.get("lat"), -3.71722);
  const lon = num(url.searchParams.get("lon"), -38.5434);
  const tz  = str(url.searchParams.get("tz"), "America/Fortaleza");
  const when = str(url.searchParams.get("when"), new Date().toISOString());
  const bodies = str(url.searchParams.get("bodies"), "").split(",").filter(Boolean) as any[] || undefined;
  const data = await API.getRiseSet({ latitude: lat, longitude: lon, timezone: tz }, when, bodies as any);
  return Response.json({ ok: true, data });
}
