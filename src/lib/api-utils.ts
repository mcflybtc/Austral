export function num(value: string | null, d: number) {
  const n = value ? Number(value) : NaN;
  return Number.isFinite(n) ? n : d;
}

export function str(value: string | null, d = "") {
  return value ?? d;
}
