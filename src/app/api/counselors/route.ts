import { NextResponse } from 'next/server';

type Counselor = {
  id?: string;
  name: string;
  specialization?: string;
};

const SUPPORTED_HEADERS = ['id', 'name', 'specialization', 'active'];

function parseCsv(csvText: string) {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  const row: string[] = [];

  const pushCell = () => {
    row.push(current.trim());
    current = '';
  };

  const pushRow = () => {
    rows.push([...row]);
    row.length = 0;
  };

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const next = csvText[i + 1];

    if (char === '"' && next === '"') {
      current += '"';
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      pushCell();
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i++;
      pushCell();
      if (row.some(cell => cell.length > 0)) {
        pushRow();
      } else {
        row.length = 0;
      }
      continue;
    }

    current += char;
  }

  if (current.length || row.length) {
    pushCell();
    if (row.some(cell => cell.length > 0)) {
      pushRow();
    }
  }

  return rows;
}

export async function GET() {
  try {
    const sheetUrl = process.env.COUNSELORS_SHEET_CSV_URL;
    if (!sheetUrl) {
      return NextResponse.json(
        { success: false, error: 'COUNSELORS_SHEET_CSV_URL is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(sheetUrl, { cache: 'no-store' });
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch counselors (${response.status})` },
        { status: response.status }
      );
    }

    const csvText = await response.text();
    const rows = parseCsv(csvText);
    if (rows.length === 0) {
      return NextResponse.json({ success: true, counselors: [] });
    }

    const headers = rows[0].map(header => header.trim().toLowerCase());
    const headerIndex = SUPPORTED_HEADERS.reduce<Record<string, number>>((acc, header) => {
      const index = headers.indexOf(header);
      if (index >= 0) acc[header] = index;
      return acc;
    }, {});

    const counselors: Counselor[] = rows.slice(1)
      .map(row => {
        const name = row[headerIndex.name]?.trim();
        if (!name) return null;
        const activeValue = row[headerIndex.active]?.trim().toLowerCase();
        if (activeValue === 'false' || activeValue === 'no' || activeValue === '0') {
          return null;
        }
        return {
          id: row[headerIndex.id]?.trim(),
          name,
          specialization: row[headerIndex.specialization]?.trim(),
        };
      })
      .filter((item): item is Counselor => Boolean(item));

    return NextResponse.json({ success: true, counselors });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
