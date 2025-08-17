import { NextRequest } from "next/server";
  import * as API from "@/lib/astro-api";

  function num(v: string | null, d: number) {
    const n = v ? Number(v) : NaN;
    return Number.isFinite(n) ? n : d;
  }
  function str(v: string | null, d = "") {
    return v ?? d;
  }

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const body = (str(url.searchParams.get("body"), "Mercury") as "Mercury"|"Venus");
  const start = str(url.searchParams.get("start"), new Date().toISOString());
  const data = await API.getTransits(body, start);
  return Response.json({ ok: true, data });
}