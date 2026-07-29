import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { entries, profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { recommend } from '@/lib/recommend';
import { MATRIX, type ProfileType } from '@/lib/emotions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userKey = String(body.userKey ?? '');
    const emotion = String(body.emotion ?? '');
    const subtype = body.subtype ? String(body.subtype) : null;
    const intensity = Math.max(1, Math.min(10, Number(body.intensity) || 5));
    const crisis = Boolean(body.crisis);

    if (!userKey || !MATRIX[emotion]) {
      return NextResponse.json({ error: 'invalid input' }, { status: 400 });
    }

    // Профиль пользователя (или мягкий запасной вариант — импульсивный)
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userKey, userKey))
      .limit(1);
    const profileType: ProfileType =
      profile?.profileType === 'hypercontrol' ? 'hypercontrol' : 'impulsive';

    const { skills, level, note } = recommend(profileType, emotion, subtype, intensity, crisis);

    const [entry] = await db
      .insert(entries)
      .values({ userKey, emotion, subtype, intensity, crisis, level, skills })
      .returning({ id: entries.id });

    return NextResponse.json({ entryId: entry.id, skills, level, note, profileType });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
