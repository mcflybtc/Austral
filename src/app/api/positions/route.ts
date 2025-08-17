import { NextRequest } from "next/server";
import * as API from "@/lib/astro-api";
import { num, str, jsonError } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const lat = num(url.searchParams.get("lat"), -3.71722);
    const lon = num(url.searchParams.get("lon"), -38.5434);
    const frame = str(url.searchParams.get("frame"), "geocentric") as API.Frame;
    const when = str(url.searchParams.get("when"), new Date().toISOString());
    const bodies = str(url.searchParams.get("bodies"), "").split(",").filter(Boolean) as any[] || undefined;
    const data = await API.getPositions({ latitude: lat, longitude: lon }, frame, when, bodies as any);
    return Response.json({ ok: true, data });
  } catch (err) {
    return jsonError(err);
  }
}