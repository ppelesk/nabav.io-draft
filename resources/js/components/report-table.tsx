import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

export type ReportColumn<T> = {
  header: string;
  className?: string;
  cell: (item: T) => ReactNode;
};

export function ReportTable<T>({
  items,
  columns,
  pageSize = 20,
}: {
  items: T[];
  columns: ReportColumn<T>[];
  pageSize?: number;
}) {
  const [page, setPage] = useState(1);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const currentItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="space-y-4">
      <div className="overflow-auto rounded border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((column) => (
                <th key={column.header} className={`p-2 text-left ${column.className ?? ''}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td className="p-4 text-center text-muted-foreground" colSpan={columns.length}>
                  Nema podataka za prikaz.
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr key={`${start}-${index}`} className="border-b last:border-b-0">
                  {columns.map((column) => (
                    <td key={column.header} className={`p-2 align-top ${column.className ?? ''}`}>
                      {column.cell(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 justify-between text-sm text-muted-foreground md:flex-row md:items-center">
        <div>
          Prikazujem {start} - {end} od {totalItems} stavki.
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1}>
            Prethodna
          </Button>
          <span className="text-sm">
            Stranica {page} od {totalPages}
          </span>
          <Button size="sm" variant="secondary" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page >= totalPages}>
            Slijedeća
          </Button>
        </div>
      </div>
    </div>
  );
}
