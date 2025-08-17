'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChartComponent } from '@/components/area-chart';

const blocks = [
  { id: 603943, hash: '0x1a2b' },
  { id: 603942, hash: '0x3c4d' },
  { id: 603941, hash: '0x5e6f' },
  { id: 603940, hash: '0x7a8b' },
  { id: 603939, hash: '0x9c0d' },
  { id: 603938, hash: '0xdef1' },
];

const stackingData = [
  { date: 'Apr 5', value: 120 },
  { date: 'Apr 6', value: 190 },
  { date: 'Apr 7', value: 150 },
  { date: 'Apr 8', value: 220 },
  { date: 'Apr 9', value: 180 },
  { date: 'Apr 10', value: 260 },
  { date: 'Apr 11', value: 200 },
  { date: 'Apr 12', value: 280 },
  { date: 'Apr 13', value: 240 },
];

export default function Page() {
  return (
    <main className="p-6 space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Recent blocks</h1>
          <button className="text-sm text-blue-600">View all blocks</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {blocks.map((b) => (
            <Card key={b.id} className="min-w-[120px]">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">#{b.id}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Stacking</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <AreaChartComponent data={stackingData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Network Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-2xl font-bold">10,244</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Blocks mined</p>
              <p className="text-2xl font-bold">5662</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
