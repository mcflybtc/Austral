import { NextRequest } from "next/server";
import * as API from "@/lib/astro-api";
import { num, str } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const body = (str(url.searchParams.get("body"), "Mercury") as "Mercury"|"Venus");
  const start = str(url.searchParams.get("start"), new Date().toISOString());
  const count = num(url.searchParams.get("count"), 2);
  const data = await API.getElongations(body, start, count);
  return Response.json({ ok: true, data });
}
