import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { ProfileType } from '@/lib/emotions';

export async function GET(req: NextRequest) {
  const userKey = req.nextUrl.searchParams.get('userKey');
  if (!userKey) return NextResponse.json({ profile: null });
  const rows = await db.select().from(profiles).where(eq(profiles.userKey, userKey)).limit(1);
  return NextResponse.json({ profile: rows[0] ?? null });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userKey = String(body.userKey ?? '');
    if (!userKey || userKey.length > 64) {
      return NextResponse.json({ error: 'userKey required' }, { status: 400 });
    }
    const answers: ('I' | 'H')[] = Array.isArray(body.answers) ? body.answers : [];
    const impulsiveScore = answers.filter((a) => a === 'I').length;
    const hypercontrolScore = answers.filter((a) => a === 'H').length;
    // При равенстве — базовый импульсивный профиль (стандартная ДПТ как стартовая)
    const profileType: ProfileType =
      hypercontrolScore > impulsiveScore ? 'hypercontrol' : 'impulsive';

    const [row] = await db
      .insert(profiles)
      .values({ userKey, profileType, impulsiveScore, hypercontrolScore })
      .onConflictDoUpdate({
        target: profiles.userKey,
        set: { profileType, impulsiveScore, hypercontrolScore },
      })
      .returning();

    return NextResponse.json({ profile: row });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
