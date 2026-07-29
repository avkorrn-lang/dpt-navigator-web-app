import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { skillLogs } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userKey = String(body.userKey ?? '');
    const entryId = Number(body.entryId);
    const skillId = String(body.skillId ?? '');
    if (!userKey || !entryId || !skillId) {
      return NextResponse.json({ error: 'invalid input' }, { status: 400 });
    }
    const done = Boolean(body.done);
    const note = typeof body.note === 'string' ? body.note.slice(0, 2000) : '';

    const [row] = await db
      .insert(skillLogs)
      .values({ userKey, entryId, skillId, done, note })
      .onConflictDoUpdate({
        target: [skillLogs.entryId, skillLogs.skillId],
        set: { done, note, updatedAt: sql`now()` },
      })
      .returning();

    return NextResponse.json({ log: row });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
