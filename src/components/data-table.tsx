'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type TableRow = { id: number; hash: string };

export function DataTable({ data }: { data: TableRow[] }) {
  const [column, setColumn] = useState<'id' | 'hash'>('id');
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<TableRow[]>(data);

  const filtered = rows.filter((r) =>
    r[column].toString().toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <select
          value={column}
          onChange={(e) => setColumn(e.target.value as 'id' | 'hash')}
          className="border bg-transparent px-2 py-1 text-sm"
        >
          <option value="id">ID</option>
          <option value="hash">Hash</option>
        </select>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter"
          className="flex-1 border bg-transparent px-2 py-1 text-sm"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setRows([...data])}
          aria-label="Atualizar"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="border-b p-2">ID</th>
            <th className="border-b p-2">Hash</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} className="border-b last:border-0">
              <td className="p-2">{r.id}</td>
              <td className="p-2">{r.hash}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
