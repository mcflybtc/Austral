import { NextRequest } from 'next/server';
import * as API from '@/lib/astro-api';
import { num, str, jsonError } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const targetLon = num(url.searchParams.get('targetLon'), 0);
    const start = str(url.searchParams.get('start'), new Date().toISOString());
    const limitDays = num(url.searchParams.get('limitDays'), 40);
    const data = await API.getMoonPhase(targetLon, start, limitDays);
    return Response.json({ ok: true, data });
  } catch (err) {
    return jsonError(err);
  }
}
