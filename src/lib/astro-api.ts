// Ponte para astronomy.ts — FONTE DE VERDADE
import * as Astro from "@/lib/astronomy";
import { clampLatLon, signFromEclipticLon, signGlyph, zodiacDeg } from "@/lib/format";

export type Frame = "geocentric" | "heliocentric";
export const ALL_BODIES = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto"] as const;
export type BodyName = typeof ALL_BODIES[number] | string;

export function makeTime(date: Date){
  // @ts-ignore
  return (Astro as any).MakeTime ? (Astro as any).MakeTime(date) : date;
}
export function makeObserver(lat:number, lon:number){
  // @ts-ignore
  return (Astro as any).Observer ? new (Astro as any).Observer(lat, lon, 0) : { latitude:lat, longitude:lon, height:0 };
}

export async function getPositions(observer: {latitude:number; longitude:number; timezone?:string}, frame: Frame, when: Date | string, bodies: readonly BodyName[] | BodyName[] = ALL_BODIES){
  const date = typeof when === "string" ? new Date(when) : when;
  const time = makeTime(date);
  const helio = frame === "heliocentric";
  const out:any[] = [];
  const ob = makeObserver(observer.latitude, observer.longitude);

  for (const name of bodies) {
    try {
      // @ts-ignore
      const vec = (Astro as any).GeoVector ? (Astro as any).GeoVector(name, time, helio) : null;
      let eclLon: number | undefined, eclLat: number | undefined;
      // @ts-ignore
      if (vec && (Astro as any).Ecliptic) { const e = (Astro as any).Ecliptic(vec); eclLon = Number(e.elon); eclLat = Number(e.elat); }
      // @ts-ignore
      else if ((Astro as any).EclipticLongitude) { eclLon = Number((Astro as any).EclipticLongitude(name, time)); }

      const sign = typeof eclLon === 'number' ? signFromEclipticLon(eclLon) : undefined;
      const zdeg = typeof eclLon === 'number' ? zodiacDeg(eclLon) : undefined;
      const glyph = sign ? signGlyph(sign) : undefined;

      let raDeg: number | undefined, decDeg: number | undefined, alt: number | undefined, az: number | undefined, constellation: string | undefined;
      // @ts-ignore
      if ((Astro as any).Equator && (Astro as any).Horizon) {
        // @ts-ignore
        const eq = (Astro as any).Equator(name, time, ob, true, true);
        // @ts-ignore
        raDeg = Number(eq.ra) * 15;
        // @ts-ignore
        decDeg = Number(eq.dec);
        // @ts-ignore
        // @ts-ignore
        const hor = (Astro as any).Horizon(time, ob, eq.ra, eq.dec, "normal");
        // @ts-ignore
        alt = Number(hor.altitude); az = Number(hor.azimuth);
        // @ts-ignore
        if ((Astro as any).Constellation) {
          // @ts-ignore
          const eqJ = (Astro as any).Equator(name, time, ob, false, true);
          // @ts-ignore
          const c = (Astro as any).Constellation(eqJ.ra, eqJ.dec);
          // @ts-ignore
          constellation = c?.abbr || c?.symbol || c?.name || undefined;
        }
      }
      let magnitude: number | string | null | undefined = null;
      // @ts-ignore
      if ((Astro as any).Illumination) { const il = (Astro as any).Illumination(name, time); magnitude = il?.mag ?? null; }

      out.push({ name, altitudeDeg: alt, azimuthDeg: az, eclipticLonDeg: eclLon, eclipticLatDeg: eclLat, tropicalSign: sign, zodiacDeg: zdeg, zodiacGlyph: glyph, constellation, raDeg, decDeg, magnitude });
    } catch {
      out.push({ name, magnitude: null });
    }
  }
  return out;
}

export async function getRiseSet(observer: {latitude:number; longitude:number; timezone?:string}, when: Date | string, bodies: BodyName[] = ["Sun","Moon"]){
  const date = typeof when === "string" ? new Date(when) : when;
  const time = makeTime(date);
  const ob = makeObserver(observer.latitude, observer.longitude);

  // @ts-ignore
  const SearchRiseSet = (Astro as any).SearchRiseSet; 
  // @ts-ignore
  const SearchHourAngle = (Astro as any).SearchHourAngle; 
  const Direction = { Rise: 1, Set: -1 };
  const out:any[] = [];

  for (const name of bodies) {
    try {
      let rise = null, set = null, transit = null;
      if (SearchRiseSet) {
        const r = SearchRiseSet(name, ob, Direction.Rise, time, 1);
        const s = SearchRiseSet(name, ob, Direction.Set, time, 1);
        // @ts-ignore
        rise = r?.time?.toString?.() || (r?.date ?? null);
        // @ts-ignore
        set  = s?.time?.toString?.() || (s?.date ?? null);
      }
      if (SearchHourAngle) {
        const tr = SearchHourAngle(name, ob, 0, time); // culminação (HA=0)
        // @ts-ignore
        transit = tr?.time?.toString?.() || (tr?.date ?? null);
      }
      out.push({ name, rise, transit, set, timezone: observer.timezone || "UTC" });
    } catch {
      out.push({ name, rise: null, transit: null, set: null, timezone: observer.timezone || "UTC" });
    }
  }
  return out;
}

export async function getLunarPhases(month: number, year: number){
  const start = new Date(Date.UTC(year, month - 1, 1));
  const time = makeTime(start);
  const out:any[] = [];
  try {
    // @ts-ignore
    const SearchMoonQuarter = (Astro as any).SearchMoonQuarter; 
    // @ts-ignore
    const NextMoonQuarter = (Astro as any).NextMoonQuarter;
    let mq = SearchMoonQuarter ? SearchMoonQuarter(time) : null;
    while (mq && new Date(mq.time?.date || mq.time).getUTCMonth() === (month - 1)) {
      const label = mq.quarter === 0 ? "New" : mq.quarter === 1 ? "FirstQuarter" : mq.quarter === 2 ? "Full" : "LastQuarter";
      out.push({ phase: label, localTime: mq.time?.toString?.() || String(mq.time) });
      mq = NextMoonQuarter ? NextMoonQuarter(mq) : null;
    }
  } catch {}
  return { month, year, phases: out };
}

export async function getSeasons(year: number){
  try {
    // @ts-ignore
    const s = (Astro as any).Seasons ? (Astro as any).Seasons(year) : null;
    const entries: any[] = [];
    if (s?.march_equinox)     entries.push({ event: "MarchEquinox",     localTime: s.march_equinox?.toString?.() || String(s.march_equinox) });
    if (s?.june_solstice)     entries.push({ event: "JuneSolstice",     localTime: s.june_solstice?.toString?.() || String(s.june_solstice) });
    if (s?.september_equinox) entries.push({ event: "SeptemberEquinox", localTime: s.september_equinox?.toString?.() || String(s.september_equinox) });
    if (s?.december_solstice) entries.push({ event: "DecemberSolstice", localTime: s.december_solstice?.toString?.() || String(s.december_solstice) });
    return { year, entries };
  } catch { return { year, entries: [] }; }
}

export async function getElongations(body: "Mercury" | "Venus", startFrom: Date | string, count = 2){
  const date = typeof startFrom === "string" ? new Date(startFrom) : startFrom;
  const time = makeTime(date);
  const events:any[] = [];
  try {
    // @ts-ignore
    const SearchMaxElongation = (Astro as any).SearchMaxElongation;
    if (SearchMaxElongation) {
      let me = SearchMaxElongation(body, time);
      let c = 0;
      while (me && c < count) {
        events.push({ time: me.time?.toString?.() || String(me.time), elongationDeg: me.elongation, visibility: me.visibility });
        me = me.next ? me.next() : null;
        c++;
      }
    }
  } catch {}
  return { body, startFrom: date.toISOString(), events };
}

export async function getEclipses(observer: {latitude:number; longitude:number; timezone?:string}, startFrom: Date | string, scope: "solar-global" | "solar-local" | "lunar"){
  const date = typeof startFrom === "string" ? new Date(startFrom) : startFrom;
  const time = makeTime(date);
  const events:any[] = [];
  try {
    // @ts-ignore
    if (scope === "lunar" && (Astro as any).SearchLunarEclipse) {
      // @ts-ignore
      const e = (Astro as any).SearchLunarEclipse(time);
      if (e) events.push({ type: "lunar", time: e.peak?.toString?.() || String(e.peak), magnitude: e?.kind || null, path: null });
    }
    // @ts-ignore
    if (scope === "solar-local" && (Astro as any).SearchLocalSolarEclipse) {
      // @ts-ignore
      const loc = makeObserver(observer.latitude, observer.longitude);
      // @ts-ignore
      const e = (Astro as any).SearchLocalSolarEclipse(time, loc);
      if (e) events.push({ type: e?.kind || "solar", time: e.peak?.toString?.() || String(e.peak), magnitude: e?.obs?.mag || null, path: "local" });
    }
  } catch {}
  return { scope, startFrom: date.toISOString(), events };
}

export async function getApsides(body: string, startFrom: Date | string, count = 2){
  const date = typeof startFrom === "string" ? new Date(startFrom) : startFrom;
  const time = makeTime(date);
  const events:any[] = [];
  try {
    // @ts-ignore
    const SearchPlanetApsis = (Astro as any).SearchPlanetApsis; 
    // @ts-ignore
    const SearchLunarApsis = (Astro as any).SearchLunarApsis;
    let ap = (body === "Moon" ? (SearchLunarApsis && SearchLunarApsis(time)) : (SearchPlanetApsis && SearchPlanetApsis(body, time)));
    let c = 0; while (ap && c < count) { events.push({ kind: ap.kind, time: ap.time?.toString?.() || String(ap.time), distance: ap.dist }); ap = ap.next ? ap.next() : null; c++; }
  } catch {}
  return { body, startFrom: date.toISOString(), events };
}

export async function getTransits(body: "Mercury" | "Venus", startFrom: Date | string){
  const date = typeof startFrom === "string" ? new Date(startFrom) : startFrom;
  const time = makeTime(date);
  try { 
    // @ts-ignore
    const t = (Astro as any).SearchTransit ? (Astro as any).SearchTransit(body, time) : null; 
    return { body, startFrom: date.toISOString(), event: t || null }; 
  } catch { 
    return { body, startFrom: date.toISOString(), event: null }; 
  }
}

export async function getGalacticCoords(when: Date | string, bodies: BodyName[] = ["Sun","Moon"]){
  const date = typeof when === "string" ? new Date(when) : when;
  const time = makeTime(date);
  const out:any[] = [];
  // @ts-ignore
  const rotFunc = (Astro as any).Rotation_EQJ_GAL;
  // @ts-ignore
  const rotVec = (Astro as any).RotateVector;
  // @ts-ignore
  const sphere = (Astro as any).SphereFromVector;
  // @ts-ignore
  const geo = (Astro as any).GeoVector;
  for (const b of bodies) {
    try {
      if (rotFunc && rotVec && sphere && geo) {
        const eqj = geo(b, time, false);
        const v = rotVec(rotFunc(), eqj);
        const s = sphere(v);
        out.push({ name: b, lonDeg: s?.lon, latDeg: s?.lat });
      } else {
        out.push({ name: b, lonDeg: null, latDeg: null });
      }
    } catch {
      out.push({ name: b, lonDeg: null, latDeg: null });
    }
  }
  return out;
}

export async function getAspects(year: number){
  const start = new Date(Date.UTC(year,0,1));
  const end = new Date(Date.UTC(year+1,0,1));
  const timeStart = makeTime(start);
  const timeEnd = makeTime(end);
  const aspects = [
    { angle: 0, name: "Conjunction" },
    { angle: 60, name: "Sextile" },
    { angle: 90, name: "Square" },
    { angle: 120, name: "Trine" },
    { angle: 180, name: "Opposition" }
  ];
  const bodies: BodyName[] = ["Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto"];
  const events: any[] = [];

  // @ts-ignore
  const pair = (Astro as any).PairLongitude;
  if (!pair) return { year, events };
  function lonOff(x: number){
    let offset = x;
    while (offset <= -180) offset += 360;
    while (offset > 180) offset -= 360;
    return offset;
  }

  function diff(b1: BodyName, b2: BodyName, angle: number, time: any){
    const lon = pair(b1, b2, time);
    return lonOff(lon - angle);
  }
  function refine(b1: BodyName, b2: BodyName, angle: number, ta: any, tb: any){
    let va = diff(b1,b2,angle,ta);
    let vb = diff(b1,b2,angle,tb);
    for(let i=0;i<20;i++){
      const tm = ta.AddDays((tb.tt - ta.tt)/2);
      const vm = diff(b1,b2,angle,tm);
      if ((va < 0 && vm > 0) || (va > 0 && vm < 0)){
        tb = tm; vb = vm;
      } else {
        ta = tm; va = vm;
      }
      if (Math.abs(tb.tt - ta.tt)*86400 < 60) break; // 1 minute
    }
    return Math.abs(va) < Math.abs(vb) ? ta : tb;
  }

  for(let i=0;i<bodies.length;i++){
    for(let j=i+1;j<bodies.length;j++){
      const b1 = bodies[i];
      const b2 = bodies[j];
      for(const asp of aspects){
        let t1:any = timeStart;
        let v1 = diff(b1,b2,asp.angle,t1);
        while(t1.tt < timeEnd.tt){
          const t2 = t1.AddDays(1);
          const v2 = diff(b1,b2,asp.angle,t2);
          if (v1 === 0 || v1*v2 <= 0){
            const te = refine(b1,b2,asp.angle,t1,t2);
            events.push({ body1: b1, body2: b2, aspect: asp.name, time: te.toString() });
          }
          t1 = t2; v1 = v2;
        }
      }
    }
  }

  events.sort((a,b)=> new Date(a.time).getTime() - new Date(b.time).getTime());
  return { year, events };
}
