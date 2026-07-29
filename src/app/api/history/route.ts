import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { entries, skillLogs } from '@/db/schema';
import { and, eq, gte, lt, inArray, asc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const userKey = req.nextUrl.searchParams.get('userKey');
    const month = req.nextUrl.searchParams.get('month'); // YYYY-MM
    if (!userKey) return NextResponse.json({ entries: [], logs: [] });

    let rows;
    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const [y, m] = month.split('-').map(Number);
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 1);
      rows = await db
        .select()
        .from(entries)
        .where(and(eq(entries.userKey, userKey), gte(entries.createdAt, start), lt(entries.createdAt, end)))
        .orderBy(asc(entries.createdAt));
    } else {
      rows = await db
        .select()
        .from(entries)
        .where(eq(entries.userKey, userKey))
        .orderBy(asc(entries.createdAt));
    }

    const ids = rows.map((r) => r.id);
    const logs = ids.length
      ? await db.select().from(skillLogs).where(inArray(skillLogs.entryId, ids))
      : [];

    return NextResponse.json({ entries: rows, logs });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
