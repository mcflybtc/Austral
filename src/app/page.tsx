"use client";
import React from "react";
import * as API from "@/lib/astro-api";
import { clampLatLon, fmtDeg, raDegToHms, formatMaybeDate } from "@/lib/format";
import { Button } from "@/components/ui/button";

type Frame = API.Frame;

type City = { id: string; name: string; country: string; latitude: number; longitude: number; timezone: string };
const CITIES: City[] = [
  { id: "fortaleza-br", name: "Fortaleza", country: "Brazil (CE)", latitude: -3.71722, longitude: -38.5434, timezone: "America/Fortaleza" },
  { id: "sao-paulo-br", name: "São Paulo", country: "Brazil", latitude: -23.5505, longitude: -46.6333, timezone: "America/Sao_Paulo" },
  { id: "rio-de-janeiro-br", name: "Rio de Janeiro", country: "Brazil", latitude: -22.9068, longitude: -43.1729, timezone: "America/Sao_Paulo" },
  { id: "new-york-us", name: "New York", country: "USA", latitude: 40.7128, longitude: -74.006, timezone: "America/New_York" },
  { id: "los-angeles-us", name: "Los Angeles", country: "USA", latitude: 34.0522, longitude: -118.2437, timezone: "America/Los_Angeles" },
  { id: "london-uk", name: "London", country: "United Kingdom", latitude: 51.5074, longitude: -0.1278, timezone: "Europe/London" },
  { id: "paris-fr", name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522, timezone: "Europe/Paris" },
  { id: "tokyo-jp", name: "Tokyo", country: "Japan", latitude: 35.6895, longitude: 139.6917, timezone: "Asia/Tokyo" },
  { id: "sydney-au", name: "Sydney", country: "Australia", latitude: -33.8688, longitude: 151.2093, timezone: "Australia/Sydney" },
];
function getCityById(id?: string | null) { return CITIES.find(c => c.id === id); }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-300/60 bg-white/70 p-4 shadow-sm">
      <h2 className="text-base font-semibold text-zinc-900 mb-2">{title}</h2>
      {children}
    </section>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="text-sm text-zinc-700 flex flex-col gap-2">
      <span className="text-xs text-zinc-500">{label}</span>
      {children}
    </label>
  );
}
function Table<T>({ cols, rows, empty }: { cols: string[]; rows: T[]; empty: string }) {
  return (
    <div className="overflow-auto rounded-lg border border-zinc-200">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50">
          <tr>
            {cols.map(c => <th key={c} className="px-4 py-2 text-left font-medium text-zinc-600">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length===0 ? (
            <tr><td colSpan={cols.length} className="px-4 py-6 text-center text-xs text-zinc-400">{empty}</td></tr>
          ) : rows.map((row:any, idx)=> (
            <tr key={idx} className="border-t border-zinc-100 hover:bg-zinc-50/60 transition-colors">
              {cols.map(c => <td key={c} className="px-4 py-2 whitespace-nowrap text-zinc-800 text-sm">{String(row[c] ?? row[c as keyof typeof row] ?? "—")}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Page() {
  const [cityId, setCityId] = React.useState("fortaleza-br");
  const city = React.useMemo(()=> getCityById(cityId) ?? CITIES[0], [cityId]);
  const [lat, setLat] = React.useState(city.latitude);
  const [lon, setLon] = React.useState(city.longitude);
  const [tz, setTz] = React.useState(city.timezone);
  const [frame, setFrame] = React.useState<Frame>("geocentric");
  const [when, setWhen] = React.useState(() => new Date().toISOString().slice(0,16));

  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string|null>(null);

  const [positions, setPositions] = React.useState<any[]>([]);
  const [riseSet, setRiseSet] = React.useState<any[]>([]);
  const [phases, setPhases] = React.useState<any[]>([]);
  const [seasons, setSeasons] = React.useState<any[]>([]);
  const [elongations, setElongations] = React.useState<any[]>([]);
  const [eclipses, setEclipses] = React.useState<any[]>([]);
  const [apsides, setApsides] = React.useState<any[]>([]);
  const [transits, setTransits] = React.useState<any|null>(null);
  const [galactic, setGalactic] = React.useState<any[]>([]);

  React.useEffect(()=>{ setLat(city.latitude); setLon(city.longitude); setTz(city.timezone); },[city]);

  React.useEffect(() => {
    handleGenerate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGenerate() {
    setLoading(true); setErr(null);
    try {
      const date = new Date(when);
      const { latitude, longitude } = clampLatLon(lat, lon);
      const observer = { latitude, longitude, timezone: tz };

      const pos = await API.getPositions(observer, frame, date, [...API.ALL_BODIES]);
      setPositions((pos||[]).map((p:any)=>({
        ...p,
        altFmt: fmtDeg(p.altitudeDeg),
        azFmt: fmtDeg(p.azimuthDeg),
        eclLonFmt: fmtDeg(p.eclipticLonDeg),
        eclLatFmt: fmtDeg(p.eclipticLatDeg),
        zodiac: p.tropicalSign ? `${p.zodiacGlyph? p.zodiacGlyph+' ' : ''}${p.tropicalSign}` : "—",
        zodiacDegFmt: p.zodiacDeg!=null ? fmtDeg(p.zodiacDeg) : "—",
        raDegFmt: fmtDeg(p.raDeg, true),
        raHms: raDegToHms(p.raDeg),
        decDegFmt: fmtDeg(p.decDeg, true),
      })));

      const rsBodies = frame === "geocentric" ? [...API.ALL_BODIES] : ["Sun","Moon"];
      const rs = await API.getRiseSet(observer, date, rsBodies);
      const fmt = (v:any)=>formatMaybeDate(v, tz);
      setRiseSet((rs||[]).map((r:any)=>({ ...r, rise: fmt(r.rise), transit: fmt(r.transit), set: fmt(r.set), timezone: tz })));

      const lp = await API.getLunarPhases(date.getMonth()+1, date.getFullYear());
      setPhases((lp?.phases||[]).map((p:any)=>({ ...p, localTime: formatMaybeDate(p.localTime, tz) })));

      const ss = await API.getSeasons(date.getFullYear());
      setSeasons((ss?.entries||[]).map((e:any)=>({ ...e, localTime: formatMaybeDate(e.localTime, tz) })));

      const elMe = await API.getElongations("Mercury", date, 2);
      const elVe = await API.getElongations("Venus",   date, 2);
      setElongations([...(elMe?.events||[]), ...(elVe?.events||[])].map((e:any)=>({ ...e, time: formatMaybeDate(e.time, tz) })));

      const ecL = await API.getEclipses(observer, date, "lunar");
      const ecS = await API.getEclipses(observer, date, "solar-local");
      setEclipses([...(ecL?.events||[]), ...(ecS?.events||[])].map((e:any)=>({ ...e, time: formatMaybeDate(e.time, tz) })));

      const apSun  = await API.getApsides("Earth", date, 2);
      const apMoon = await API.getApsides("Moon",  date, 2);
      setApsides([...(apSun?.events||[]), ...(apMoon?.events||[])].map((a:any)=>({ ...a, time: formatMaybeDate(a.time, tz) })));

      const trM = await API.getTransits("Mercury", date);
      const trV = await API.getTransits("Venus",   date);
      const tEvt = trM?.event || trV?.event || null;
      setTransits(tEvt ? { body: tEvt.body || (trM?.event ? "Mercury" : (trV?.event ? "Venus" : "")), start: formatMaybeDate(tEvt.start, tz), peak: formatMaybeDate(tEvt.peak, tz), end: formatMaybeDate(tEvt.end, tz) } : null);

      const gc = await API.getGalacticCoords(date, ["Sun","Moon"]);
      setGalactic(gc||[]);

    } catch(e:any) { setErr(e?.message||String(e)); }
    finally { setLoading(false); }
  }

  function getCityOptions() {
    return CITIES.map(c => <option key={c.id} value={c.id}>{c.name} — {c.country}</option>);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white text-zinc-900">
      <header className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-lg font-semibold">Lyra Orrery — Dados Reais via <code>astronomy.ts</code></h1>
        <p className="text-xs text-zinc-500 mt-1">Mostrando signo + grau no signo, constelação IAU e RA/Dec em graus.</p>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 grid gap-4">
        <Section title="Parâmetros de Observação">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Field label="Cidade (menu)">
              <select className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm hover:shadow-md transition" value={cityId} onChange={(e)=>setCityId(e.target.value)}>
                {getCityOptions()}
              </select>
            </Field>
            <Field label="Latitude (°)"><input type="number" step="0.0001" className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm" value={lat} onChange={(e)=>setLat(parseFloat(e.target.value))} /></Field>
            <Field label="Longitude (°)"><input type="number" step="0.0001" className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm" value={lon} onChange={(e)=>setLon(parseFloat(e.target.value))} /></Field>
            <Field label="Time zone (IANA)"><input type="text" className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm" value={tz} onChange={(e)=>setTz(e.target.value)} /></Field>
            <Field label="Reference frame">
              <div className="flex items-center gap-4 text-sm">
                <label className="inline-flex items-center gap-2"><input type="radio" name="frame" checked={frame==="geocentric"} onChange={()=>setFrame("geocentric")} /><span>geocentric</span></label>
                <label className="inline-flex items-center gap-2"><input type="radio" name="frame" checked={frame==="heliocentric"} onChange={()=>setFrame("heliocentric")} /><span>heliocentric</span></label>
              </div>
            </Field>
            <Field label="Data/hora (local)"><input type="datetime-local" className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm" value={when} onChange={(e)=>setWhen(e.target.value)} /></Field>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Button onClick={handleGenerate} className="h-10 px-4">{loading ? <span className="animate-pulse">Calculando…</span> : "Gerar dados reais"}</Button>
            {err && <span className="text-xs text-red-600">{err}</span>}
          </div>
        </Section>

        <Section title="Posições aparentes (grau no signo & constelação)">
          <Table
            cols={["name","altFmt","azFmt","eclLonFmt","eclLatFmt","zodiac","zodiacDegFmt","constellation","raDegFmt","raHms","decDegFmt","magnitude"]}
            rows={positions}
            empty="Sem dados. Clique em ‘Gerar dados reais’."
          />
        </Section>

        <Section title="Nascer / Culminação / Pôr">
          <p className="text-xs text-zinc-500 mb-2">Frame geocentric → TODOS (Sun→Pluto). Heliocentric → Sun/Moon.</p>
          <Table cols={["name","rise","transit","set","timezone"]} rows={riseSet} empty="Aguardando cálculo…" />
        </Section>

        <Section title="Fases Lunares (mês) & Estações (ano)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><h3 className="text-sm font-medium mb-2">Fases</h3><Table cols={["phase","localTime","constellation"]} rows={phases} empty="—" /></div>
            <div><h3 className="text-sm font-medium mb-2">Estações</h3><Table cols={["event","localTime"]} rows={seasons} empty="—" /></div>
          </div>
        </Section>

        <Section title="Eventos Especiais">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><h3 className="text-sm font-medium mb-2">Max Elongations</h3><Table cols={["time","elongationDeg","visibility"]} rows={elongations} empty="—" /></div>
            <div><h3 className="text-sm font-medium mb-2">Eclipses</h3><Table cols={["type","time","magnitude","path"]} rows={eclipses} empty="—" /></div>
            <div><h3 className="text-sm font-medium mb-2">Apsides</h3><Table cols={["kind","time","distance"]} rows={apsides} empty="—" /></div>
            <div><h3 className="text-sm font-medium mb-2">Transits</h3><Table cols={["body","start","peak","end"]} rows={transits ? [transits] : []} empty="—" /></div>
          </div>
        </Section>

        <Section title="Coordenadas Galácticas (Sun/Moon)">
          <Table cols={["name","lonDeg","latDeg"]} rows={galactic} empty="—" />
        </Section>

        <footer className="text-xs text-zinc-400 mt-4">
          <p>© {new Date().getFullYear()} Lyra Orrery — Powered by <code>astronomy.ts</code>. Design: Tailwind, shadcn/ui.</p>
        </footer>
      </main>
    </div>
  );
}
