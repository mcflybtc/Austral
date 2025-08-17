import { NextRequest } from "next/server";
import * as API from "@/lib/astro-api";
import { parseQuery, str, jsonError } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const { url, lat, lon, when, bodies } = parseQuery(req);
    const frame = str(url.searchParams.get("frame"), "geocentric") as API.Frame;
    const data = await API.getPositions({ latitude: lat, longitude: lon }, frame, when, bodies as any);
    return Response.json({ ok: true, data });
  } catch (err) {
    return jsonError(err);
  }
}