import { NextRequest } from 'next/server';
import * as API from '@/lib/astro-api';
import { str, jsonError } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const bodies = str(url.searchParams.get('bodies'), '')
      .split(',')
      .filter(Boolean) as API.BodyName[] | undefined;
    const data = await API.getBodyData(bodies as any);
    return Response.json({ ok: true, data });
  } catch (err) {
    return jsonError(err);
  }
}
