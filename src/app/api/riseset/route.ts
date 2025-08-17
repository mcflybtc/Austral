import { NextRequest } from "next/server";
import * as API from "@/lib/astro-api";
import { parseQuery, jsonError } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const { lat, lon, tz, when, bodies } = parseQuery(req);
    const data = await API.getRiseSet({ latitude: lat, longitude: lon, timezone: tz }, when, bodies as any);
    return Response.json({ ok: true, data });
  } catch (err) {
    return jsonError(err);
  }
}