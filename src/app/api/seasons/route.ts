import { NextRequest } from "next/server";
import * as API from "@/lib/astro-api";
import { num } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const year  = num(url.searchParams.get("year"), new Date().getFullYear());
  const data = await API.getSeasons(year);
  return Response.json({ ok: true, data });
}
