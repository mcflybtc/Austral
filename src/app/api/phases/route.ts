import { NextRequest } from "next/server";
import * as API from "@/lib/astro-api";
import { num, str } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const month = num(url.searchParams.get("month"), (new Date().getMonth()+1));
  const year  = num(url.searchParams.get("year"), new Date().getFullYear());
  const data = await API.getLunarPhases(month, year);
  return Response.json({ ok: true, data });
}
