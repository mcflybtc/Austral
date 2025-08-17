import { NextRequest } from "next/server";
import * as API from "@/lib/astro-api";
import { parseQuery, str, jsonError } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const { url, lat, lon, tz } = parseQuery(req);
    const start = str(url.searchParams.get("start"), new Date().toISOString());
    const scope = str(url.searchParams.get("scope"), "lunar") as "solar-global" | "solar-local" | "lunar";
    const data = await API.getEclipses({ latitude: lat, longitude: lon, timezone: tz }, start, scope);
    return Response.json({ ok: true, data });
  } catch (err) {
    return jsonError(err);
  }
}