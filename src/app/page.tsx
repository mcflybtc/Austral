'use client';
import React from 'react';
import * as API from '@/lib/astro-api';
import {
  clampLatLon,
  fmtDeg,
  fmtNumber,
  raDegToHms,
  formatMaybeDate,
} from '@/lib/format';
import { Button } from '@/components/ui/button';
import { CycleChart, CycleData } from '@/components/cycle-chart';

type Frame = API.Frame;

type City = {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
};
const CITIES: City[] = [
  {
    id: 'fortaleza-br',
    name: 'Fortaleza',
    country: 'Brazil (CE)',
    latitude: -3.71722,
    longitude: -38.5434,
    timezone: 'America/Fortaleza',
  },
  {
    id: 'sao-paulo-br',
    name: 'São Paulo',
    country: 'Brazil',
    latitude: -23.5505,
    longitude: -46.6333,
    timezone: 'America/Sao_Paulo',
  },
  {
    id: 'rio-de-janeiro-br',
    name: 'Rio de Janeiro',
    country: 'Brazil',
    latitude: -22.9068,
    longitude: -43.1729,
    timezone: 'America/Sao_Paulo',
  },
  {
    id: 'new-york-us',
    name: 'New York',
    country: 'USA',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
  },
  {
    id: 'los-angeles-us',
    name: 'Los Angeles',
    country: 'USA',
    latitude: 34.0522,
    longitude: -118.2437,
    timezone: 'America/Los_Angeles',
  },
  {
    id: 'london-uk',
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
  },
  {
    id: 'paris-fr',
    name: 'Paris',
    country: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
  },
  {
    id: 'tokyo-jp',
    name: 'Tokyo',
    country: 'Japan',
    latitude: 35.6895,
    longitude: 139.6917,
    timezone: 'Asia/Tokyo',
  },
  {
    id: 'sydney-au',
    name: 'Sydney',
    country: 'Australia',
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: 'Australia/Sydney',
  },
  {
    id: 'mexico-city-mx',
    name: 'Mexico City',
    country: 'Mexico',
    latitude: 19.4326,
    longitude: -99.1332,
    timezone: 'America/Mexico_City',
  },
  {
    id: 'berlin-de',
    name: 'Berlin',
    country: 'Germany',
    latitude: 52.52,
    longitude: 13.405,
    timezone: 'Europe/Berlin',
  },
  {
    id: 'cape-town-za',
    name: 'Cape Town',
    country: 'South Africa',
    latitude: -33.9249,
    longitude: 18.4241,
    timezone: 'Africa/Johannesburg',
  },
  {
    id: 'beijing-cn',
    name: 'Beijing',
    country: 'China',
    latitude: 39.9042,
    longitude: 116.4074,
    timezone: 'Asia/Shanghai',
  },
  {
    id: 'buenos-aires-ar',
    name: 'Buenos Aires',
    country: 'Argentina',
    latitude: -34.6037,
    longitude: -58.3816,
    timezone: 'America/Argentina/Buenos_Aires',
  },
];
function getCityById(id?: string | null) {
  return CITIES.find((c) => c.id === id);
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-700 bg-zinc-800/60 p-4 shadow">
      <h2 className="text-base font-semibold text-zinc-100 mb-2">{title}</h2>
      {children}
    </section>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="text-sm text-zinc-300 flex flex-col gap-2">
      <span className="text-xs text-zinc-500">{label}</span>
      {children}
    </label>
  );
}
type Col = { key: string; label: string };
function Table<T>({
  cols,
  rows,
  empty,
}: {
  cols: Col[];
  rows: T[];
  empty: string;
}) {
  return (
    <div className="overflow-auto rounded-lg border border-zinc-700">
      <table className="w-full text-sm">
        <thead className="bg-zinc-800">
          <tr>
            {cols.map((c) => (
              <th
                key={c.key}
                className="px-4 py-2 text-left font-medium text-zinc-300"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={cols.length}
                className="px-4 py-6 text-center text-xs text-zinc-500"
              >
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row: any, idx) => (
              <tr
                key={idx}
                className="border-t border-zinc-700 hover:bg-zinc-800 transition-colors"
              >
                {cols.map((c) => {
                  const v = row[c.key as keyof typeof row];
                  const txt =
                    v == null || typeof v === 'object' ? '—' : String(v);
                  return (
                    <td
                      key={c.key}
                      className="px-4 py-2 whitespace-nowrap text-zinc-200 text-sm"
                    >
                      {txt}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function Page() {
  const [cityId, setCityId] = React.useState('fortaleza-br');
  const city = React.useMemo(() => getCityById(cityId) ?? CITIES[0], [cityId]);
  const [lat, setLat] = React.useState(city.latitude);
  const [lon, setLon] = React.useState(city.longitude);
  const [tz, setTz] = React.useState(city.timezone);
  const [frame, setFrame] = React.useState<Frame>('geocentric');
  const [when, setWhen] = React.useState(() =>
    new Date().toISOString().slice(0, 16)
  );

  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const [positions, setPositions] = React.useState<any[]>([]);
  const [riseSet, setRiseSet] = React.useState<any[]>([]);
  const [phases, setPhases] = React.useState<any[]>([]);
  const [seasons, setSeasons] = React.useState<any[]>([]);
  const [elongations, setElongations] = React.useState<any[]>([]);
  const [eclipses, setEclipses] = React.useState<any[]>([]);
  const [apsides, setApsides] = React.useState<any[]>([]);
  const [transits, setTransits] = React.useState<any | null>(null);
  const [galactic, setGalactic] = React.useState<any[]>([]);
  const [aspects, setAspects] = React.useState<any[]>([]);
  const [cycleData, setCycleData] = React.useState<CycleData[]>([]);
  const [aspectSpan, setAspectSpan] = React.useState<'day' | 'month' | 'year'>(
    'year'
  );

  React.useEffect(() => {
    setLat(city.latitude);
    setLon(city.longitude);
    setTz(city.timezone);
  }, [city]);

  React.useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGenerate() {
    setLoading(true);
    setErr(null);
    try {
      const date = new Date(when);
      const { latitude, longitude } = clampLatLon(lat, lon);
      const observer = { latitude, longitude, timezone: tz };

      const pos = await API.getPositions(observer, frame, date, [
        ...API.ALL_BODIES,
      ]);
      setPositions(
        (pos || []).map((p: any) => ({
          ...p,
          altFmt: fmtDeg(p.altitudeDeg),
          azFmt: fmtDeg(p.azimuthDeg),
          eclLonFmt: fmtDeg(p.eclipticLonDeg),
          eclLatFmt: fmtDeg(p.eclipticLatDeg),
          zodiac: p.tropicalSign
            ? `${p.zodiacGlyph ? p.zodiacGlyph + ' ' : ''}${p.tropicalSign}`
            : '—',
          zodiacDegFmt: p.zodiacDeg != null ? fmtDeg(p.zodiacDeg) : '—',
          raDegFmt: fmtDeg(p.raDeg, true),
          raHms: raDegToHms(p.raDeg),
          decDegFmt: fmtDeg(p.decDeg, true),
          magnitude: fmtNumber(p.magnitude),
        }))
      );

      const rsBodies =
        frame === 'geocentric' ? [...API.ALL_BODIES] : ['Sun', 'Moon'];
      const rs = await API.getRiseSet(observer, date, rsBodies);
      const fmt = (v: any) => formatMaybeDate(v, tz);
      setRiseSet(
        (rs || []).map((r: any) => ({
          ...r,
          rise: fmt(r.rise),
          transit: fmt(r.transit),
          set: fmt(r.set),
          timezone: tz,
        }))
      );

      const lp = await API.getLunarPhases(
        date.getMonth() + 1,
        date.getFullYear()
      );
      const phaseRows: any[] = [];
      for (const p of lp?.phases || []) {
        const t = new Date(p.localTime);
        const pos = await API.getPositions(observer, 'geocentric', t, ['Moon']);
        phaseRows.push({
          ...p,
          localTime: formatMaybeDate(p.localTime, tz),
          constellation: pos[0]?.constellation || '—',
        });
      }
      setPhases(phaseRows);

      const ss = await API.getSeasons(date.getFullYear());
      const seasonRows: any[] = [];
      for (const e of ss?.entries || []) {
        const t = new Date(e.localTime);
        const pos = await API.getPositions(observer, 'geocentric', t, ['Sun']);
        seasonRows.push({
          ...e,
          localTime: formatMaybeDate(e.localTime, tz),
          constellation: pos[0]?.constellation || '—',
        });
      }
      setSeasons(seasonRows);

      const elMe = await API.getElongations('Mercury', date, 2);
      const elVe = await API.getElongations('Venus', date, 2);
      setElongations(
        [...(elMe?.events || []), ...(elVe?.events || [])].map((e: any) => ({
          ...e,
          time: formatMaybeDate(e.time, tz),
          elongationFmt: fmtNumber(e.elongationDeg),
        }))
      );

      const ecL = await API.getEclipses(observer, date, 'lunar');
      const ecS = await API.getEclipses(observer, date, 'solar-local');
      setEclipses(
        [...(ecL?.events || []), ...(ecS?.events || [])].map((e: any) => ({
          ...e,
          time: formatMaybeDate(e.time, tz),
          magnitudeFmt:
            typeof e.magnitude === 'number'
              ? fmtNumber(e.magnitude)
              : (e.magnitude ?? '—'),
          path: typeof e.path === 'string' ? e.path : '—',
        }))
      );

      const apSun = await API.getApsides('Earth', date, 2);
      const apMoon = await API.getApsides('Moon', date, 2);
      setApsides(
        [...(apSun?.events || []), ...(apMoon?.events || [])].map((a: any) => ({
          ...a,
          time: formatMaybeDate(a.time, tz),
          distanceFmt: fmtNumber(a.distance),
        }))
      );

      const trM = await API.getTransits('Mercury', date);
      const trV = await API.getTransits('Venus', date);
      const tEvt = trM?.event || trV?.event || null;
      setTransits(
        tEvt
          ? {
              body:
                tEvt.body ||
                (trM?.event ? 'Mercury' : trV?.event ? 'Venus' : ''),
              start: formatMaybeDate(tEvt.start, tz),
              peak: formatMaybeDate(tEvt.peak, tz),
              end: formatMaybeDate(tEvt.end, tz),
            }
          : null
      );

      const gc = await API.getGalacticCoords(date, [...API.ALL_BODIES]);
      setGalactic(
        (gc || []).map((g: any) => ({
          ...g,
          lonFmt: fmtNumber(g.lonDeg),
          latFmt: fmtNumber(g.latDeg),
        }))
      );

      const asp = await API.getAspectsRange(date, aspectSpan);
      setAspects(
        (asp?.events || []).map((a: any) => ({
          event: `${a.body1} ${a.aspect} ${a.body2}`,
          localTime: formatMaybeDate(a.time, tz),
        }))
      );

      const chartBodies = [...API.ALL_BODIES];
      const days = 30;
      const series: CycleData[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(date);
        d.setDate(d.getDate() - i);
        const p = await API.getPositions(observer, frame, d, chartBodies);
        const row: any = { date: d.toISOString().slice(0, 10) };
        for (const b of chartBodies) {
          const body = p.find((x: any) => x.name === b);
          row[b] = body?.eclipticLonDeg ?? 0;
        }
        series.push(row);
      }
      setCycleData(series);
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  function getCityOptions() {
    return CITIES.map((c) => (
      <option key={c.id} value={c.id}>
        {c.name} — {c.country}
      </option>
    ));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-zinc-100">
      <header className="w-full px-4 py-6">
        <h1 className="text-lg font-semibold">
          Lyra Orrery — Real Data via <code>astronomy.ts</code>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Showing zodiac sign + degree, IAU constellation, and RA/Dec in
          degrees.
        </p>
      </header>

      <main className="w-full px-4 pb-16 grid gap-4">
        <Section title="Observation Parameters">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Field label="City (menu)">
              <select
                className="h-10 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100"
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
              >
                {getCityOptions()}
              </select>
            </Field>
            <Field label="Latitude (°)">
              <input
                type="number"
                step="0.0001"
                className="h-10 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
              />
            </Field>
            <Field label="Longitude (°)">
              <input
                type="number"
                step="0.0001"
                className="h-10 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100"
                value={lon}
                onChange={(e) => setLon(parseFloat(e.target.value))}
              />
            </Field>
            <Field label="Time zone (IANA)">
              <input
                type="text"
                className="h-10 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100"
                value={tz}
                onChange={(e) => setTz(e.target.value)}
              />
            </Field>
            <Field label="Reference frame">
              <div className="flex items-center gap-4 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="frame"
                    checked={frame === 'geocentric'}
                    onChange={() => setFrame('geocentric')}
                  />
                  <span>geocentric</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="frame"
                    checked={frame === 'heliocentric'}
                    onChange={() => setFrame('heliocentric')}
                  />
                  <span>heliocentric</span>
                </label>
              </div>
            </Field>
            <Field label="Date/time (local)">
              <input
                type="datetime-local"
                className="h-10 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
              />
            </Field>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Button onClick={handleGenerate} className="h-10 px-4">
              {loading ? (
                <span className="animate-pulse">Calculating…</span>
              ) : (
                'Generate real data'
              )}
            </Button>
            {err && <span className="text-xs text-red-600">{err}</span>}
          </div>
        </Section>

        <Section title="Apparent Positions (sign degree & constellation)">
          <Table
            cols={[
              { key: 'name', label: 'Name' },
              { key: 'altFmt', label: 'Alt' },
              { key: 'azFmt', label: 'Az' },
              { key: 'eclLonFmt', label: 'Ecl Lon' },
              { key: 'eclLatFmt', label: 'Ecl Lat' },
              { key: 'zodiac', label: 'Zodiac' },
              { key: 'zodiacDegFmt', label: 'Deg in Sign' },
              { key: 'constellation', label: 'Constellation' },
              { key: 'raDegFmt', label: 'RA°' },
              { key: 'raHms', label: 'RA hms' },
              { key: 'decDegFmt', label: 'Dec°' },
              { key: 'magnitude', label: 'Mag' },
            ]}
            rows={positions}
            empty="No data. Click 'Generate real data'."
          />
        </Section>

        <Section title="Rise / Transit / Set">
          <p className="text-xs text-zinc-500 mb-2">
            Geocentric frame → all bodies (Sun→Pluto). Heliocentric → Sun/Moon.
          </p>
          <Table
            cols={[
              { key: 'name', label: 'Name' },
              { key: 'rise', label: 'Rise' },
              { key: 'transit', label: 'Transit' },
              { key: 'set', label: 'Set' },
              { key: 'timezone', label: 'Time zone' },
            ]}
            rows={riseSet}
            empty="Waiting for calculation…"
          />
        </Section>

        <Section title="Lunar Phases (month) & Seasons (year)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Phases</h3>
              <Table
                cols={[
                  { key: 'phase', label: 'Phase' },
                  { key: 'localTime', label: 'Local Time' },
                  { key: 'constellation', label: 'Constellation' },
                ]}
                rows={phases}
                empty="—"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Seasons</h3>
              <Table
                cols={[
                  { key: 'event', label: 'Event' },
                  { key: 'localTime', label: 'Local Time' },
                  { key: 'constellation', label: 'Constellation' },
                ]}
                rows={seasons}
                empty="—"
              />
            </div>
          </div>
        </Section>

        <Section title="Special Events">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Max Elongations</h3>
              <Table
                cols={[
                  { key: 'time', label: 'Time' },
                  { key: 'elongationFmt', label: 'Elong°' },
                  { key: 'visibility', label: 'Visibility' },
                ]}
                rows={elongations}
                empty="—"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Eclipses</h3>
              <Table
                cols={[
                  { key: 'type', label: 'Type' },
                  { key: 'time', label: 'Time' },
                  { key: 'magnitudeFmt', label: 'Magnitude' },
                  { key: 'path', label: 'Path' },
                ]}
                rows={eclipses}
                empty="—"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Apsides</h3>
              <Table
                cols={[
                  { key: 'kind', label: 'Kind' },
                  { key: 'time', label: 'Time' },
                  { key: 'distanceFmt', label: 'Distance' },
                ]}
                rows={apsides}
                empty="—"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Transits</h3>
              <Table
                cols={[
                  { key: 'body', label: 'Body' },
                  { key: 'start', label: 'Start' },
                  { key: 'peak', label: 'Peak' },
                  { key: 'end', label: 'End' },
                ]}
                rows={transits ? [transits] : []}
                empty="—"
              />
            </div>
          </div>
        </Section>

        <Section title={`Planetary Aspects (${aspectSpan})`}>
          <div className="mb-2">
            <select
              className="h-8 rounded-md border border-zinc-700 bg-zinc-900 px-2 text-sm text-zinc-100"
              value={aspectSpan}
              onChange={(e) => setAspectSpan(e.target.value as any)}
            >
              <option value="day">day</option>
              <option value="month">month</option>
              <option value="year">year</option>
            </select>
          </div>
          <Table
            cols={[
              { key: 'localTime', label: 'Local Time' },
              { key: 'event', label: 'Event' },
            ]}
            rows={aspects}
            empty="—"
          />
        </Section>

        {cycleData.length > 0 && (
          <Section title="Ecliptic Longitude Trend (all bodies)">
            <CycleChart data={cycleData} />
          </Section>
        )}

        <Section title="Galactic Coordinates (all bodies)">
          <Table
            cols={[
              { key: 'name', label: 'Name' },
              { key: 'lonFmt', label: 'Lon°' },
              { key: 'latFmt', label: 'Lat°' },
            ]}
            rows={galactic}
            empty="—"
          />
        </Section>

        <footer className="text-xs text-zinc-400 mt-4">
          <p>
            © {new Date().getFullYear()} Lyra Orrery — Powered by{' '}
            <code>astronomy.ts</code>. Design: Tailwind, shadcn/ui.
          </p>
        </footer>
      </main>
    </div>
  );
}
