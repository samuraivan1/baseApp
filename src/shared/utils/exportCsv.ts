export function exportCsv(
  filename: string,
  headers: string[],
  rows: (string | number | null | undefined)[][]
) {
  const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const content = [headers.join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
  // Opcional BOM para Excel
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  const blob = new Blob([bom, content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

