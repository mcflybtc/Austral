import { NextRequest } from "next/server";
import * as API from "@/lib/astro-api";
import { str, jsonError } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const body = str(url.searchParams.get("body"), "Mercury") as "Mercury" | "Venus";
    const start = str(url.searchParams.get("start"), new Date().toISOString());
    const data = await API.getTransits(body, start);
    return Response.json({ ok: true, data });
  } catch (err) {
    return jsonError(err);
  }
}