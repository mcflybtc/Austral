import { NextRequest } from "next/server";
import * as API from "@/lib/astro-api";
import { str, jsonError } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const when = str(url.searchParams.get("when"), new Date().toISOString());
    const bodies = str(url.searchParams.get("bodies"), "").split(",").filter(Boolean) as any[] || undefined;
    const data = await API.getGalacticCoords(when, bodies as any);
    return Response.json({ ok: true, data });
  } catch (err) {
    return jsonError(err);
  }
}