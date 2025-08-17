import { NextRequest } from "next/server";
import * as API from "@/lib/astro-api";
import { num, str, jsonError } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const body = str(url.searchParams.get("body"), "Moon");
    const start = str(url.searchParams.get("start"), new Date().toISOString());
    const count = num(url.searchParams.get("count"), 2);
    const data = await API.getApsides(body, start, count);
    return Response.json({ ok: true, data });
  } catch (err) {
    return jsonError(err);
  }
}