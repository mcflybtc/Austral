export function jsonError(err: unknown, status = 500) {
  const message = err instanceof Error ? err.message : String(err)
  return Response.json({ ok: false, error: message }, { status })
}

export function num(v: string | null, d: number) {
  const n = v ? Number(v) : NaN
  return Number.isFinite(n) ? n : d
}

export function str(v: string | null, d = "") {
  return v ?? d
}
