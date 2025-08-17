export function clampLatLon(lat: number, lon: number) {
  const clampedLat = Math.min(90, Math.max(-90, lat));
  const clampedLon = Math.min(180, Math.max(-180, lon));
  return { latitude: clampedLat, longitude: clampedLon };
}
export function fmtDeg(deg?: number | null, withSeconds = false) {
  if (deg == null || !isFinite(deg)) return "—";
  const s = deg < 0 ? -1 : 1;
  const d = Math.abs(deg);
  const D = Math.floor(d);
  const Mfull = (d - D) * 60;
  const M = Math.floor(Mfull);
  const S = Math.round((Mfull - M) * 60);
  return withSeconds
    ? `${s<0?'-':''}${D}° ${String(M).padStart(2,'0')}′ ${String(S).padStart(2,'0')}″`
    : `${s<0?'-':''}${D}° ${String(M).padStart(2,'0')}′`;
}
export function signFromEclipticLon(lon: number) {
  const signs = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  const idx = Math.floor((((lon % 360) + 360) % 360) / 30);
  return signs[idx];
}
export function signGlyph(sign: string) {
  const map: Record<string,string> = { Aries:"♈", Taurus:"♉", Gemini:"♊", Cancer:"♋", Leo:"♌", Virgo:"♍", Libra:"♎", Scorpio:"♏", Sagittarius:"♐", Capricorn:"♑", Aquarius:"♒", Pisces:"♓" };
  return map[sign] ?? sign;
}
export function zodiacDeg(lon: number) { return (((lon % 360)+360)%360)%30; }
export function raDegToHms(deg?: number|null) {
  if (deg==null||!isFinite(deg)) return "—";
  const hours = deg/15;
  const H = Math.floor(hours);
  const mfull = (hours - H)*60; const M = Math.floor(mfull); const S = Math.round((mfull-M)*60);
  return `${String(H).padStart(2,'0')}h ${String(M).padStart(2,'0')}m ${String(S).padStart(2,'0')}s`;
}
export function formatInTz(date: Date, tz: string): string {
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
  const parts = Object.fromEntries(fmt.formatToParts(date).map(p => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}
export function formatMaybeDate(value: any, tz: string): string {
  try {
    let d: Date | null = null;
    if (value instanceof Date) d = value;
    else if (typeof value === 'string' || typeof value === 'number') d = new Date(value);
    else if (value && typeof value.date === 'string') d = new Date(value.date);
    else if (value && typeof value.toDate === 'function') d = new Date(value.toDate());
    else if (value && typeof value.time === 'string') d = new Date(value.time);
    else if (value && typeof value.peak === 'string') d = new Date(value.peak);
    if (!d || isNaN(d.getTime())) return String(value ?? '');
    return formatInTz(d, tz);
  } catch {
    return String(value ?? '');
  }
}

export function fmtNumber(v?: number | null, digits = 2) {
  if (v == null || !isFinite(v)) return "—";
  return Number(v).toFixed(digits);
}
