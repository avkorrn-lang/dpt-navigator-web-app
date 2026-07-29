'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Quote,
  Compass,
  CalendarDays,
  NotebookPen,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';
import { EMOTION_MAP, LEVEL_INFO, type IntensityLevel } from '@/lib/emotions';
import { SKILLS } from '@/lib/skills';

interface EntryRow {
  id: number;
  emotion: string;
  subtype: string | null;
  intensity: number;
  crisis: boolean;
  level: IntensityLevel;
  skills: string[];
  createdAt: string;
}

interface LogRow {
  entryId: number;
  skillId: string;
  done: boolean;
  note: string;
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function getUserKey(): string {
  let k = localStorage.getItem('dbt_user_key');
  if (!k) {
    k = crypto.randomUUID();
    localStorage.setItem('dbt_user_key', k);
  }
  return k;
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function HistoryPage() {
  const [cursor, setCursor] = useState(() => new Date());
  const [entries, setEntries] = useState<EntryRow[]>([]);
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(() => new Date().getDate());

  const mk = monthKey(cursor);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/history?userKey=${getUserKey()}&month=${mk}`)
      .then((r) => r.json())
      .then((d) => {
        setEntries(d.entries ?? []);
        setLogs(d.logs ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [mk]);

  const byDay = useMemo(() => {
    const map = new Map<number, EntryRow[]>();
    entries.forEach((e) => {
      const day = new Date(e.createdAt).getDate();
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(e);
    });
    return map;
  }, [entries]);

  const logsByEntry = useMemo(() => {
    const map = new Map<number, LogRow[]>();
    logs.forEach((l) => {
      if (!map.has(l.entryId)) map.set(l.entryId, []);
      map.get(l.entryId)!.push(l);
    });
    return map;
  }, [logs]);

  // Календарная сетка (неделя с понедельника)
  const cells = useMemo(() => {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const firstWeekday = (new Date(y, m, 1).getDay() + 6) % 7;
    const arr: (number | null)[] = Array(firstWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [cursor]);

  const activeDays = byDay.size;
  const doneCount = logs.filter((l) => l.done).length;
  const isCurrentMonth = mk === monthKey(new Date());
  const today = new Date().getDate();

  const monthLabel = new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    year: 'numeric',
  }).format(cursor);

  const selectedEntries = selected != null ? byDay.get(selected) ?? [] : [];

  const shiftMonth = (dir: number) => {
    const d = new Date(cursor);
    d.setMonth(d.getMonth() + dir);
    setCursor(d);
    setSelected(null);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">История и прогресс</h1>
          <p className="mt-2 text-sm text-mist">
            Каждое обращение и выполненный навык сохраняются здесь — наблюдайте за динамикой по дням.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-2 text-xs font-bold capitalize shadow-card">
          <CalendarDays size={14} className="text-pine" /> {monthLabel}
        </span>
      </div>

      {/* Статистика месяца */}
      <div className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-3">
        {[
          { v: entries.length, l: 'обращений в этом месяце' },
          { v: activeDays, l: 'дней с записями' },
          { v: doneCount, l: 'навыков выполнено' },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-line bg-card p-4 shadow-card sm:p-5">
            <p className="font-display text-3xl font-bold text-pine-deep sm:text-4xl">{s.v}</p>
            <p className="mt-1 text-[11px] leading-snug font-semibold text-mist sm:text-xs">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        {/* Календарь */}
        <div className="rounded-3xl border border-line bg-card p-4 shadow-card sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => shiftMonth(-1)}
              aria-label="Предыдущий месяц"
              className="grid size-9 cursor-pointer place-items-center rounded-full border border-line transition-colors hover:bg-cream"
            >
              <ChevronLeft size={17} />
            </button>
            <p className="font-display text-lg font-bold capitalize">{monthLabel}</p>
            <button
              onClick={() => shiftMonth(1)}
              aria-label="Следующий месяц"
              className="grid size-9 cursor-pointer place-items-center rounded-full border border-line transition-colors hover:bg-cream"
            >
              <ChevronRight size={17} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {WEEKDAYS.map((w) => (
              <p key={w} className="pb-1.5 text-center text-[10px] font-bold tracking-wider text-mist uppercase">
                {w}
              </p>
            ))}
            {cells.map((day, i) => {
              if (day === null) return <span key={`e${i}`} />;
              const dayEntries = byDay.get(day);
              const isToday = isCurrentMonth && day === today;
              const isSel = selected === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelected(day)}
                  className={clsx(
                    'relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl text-[13px] font-semibold transition-all sm:text-sm',
                    isSel
                      ? 'bg-ink text-cream shadow-lift'
                      : dayEntries
                        ? 'bg-cream hover:bg-line/60'
                        : 'hover:bg-cream/70',
                  )}
                >
                  <span
                    className={clsx(
                      'grid size-7 place-items-center rounded-full sm:size-8',
                      isToday && !isSel && 'ring-2 ring-pine text-pine-deep',
                    )}
                  >
                    {day}
                  </span>
                  {dayEntries && (
                    <span className="absolute bottom-1 flex gap-[3px] sm:bottom-1.5">
                      {dayEntries.slice(0, 3).map((e, j) => (
                        <span
                          key={j}
                          className="size-1.5 rounded-full"
                          style={{ background: isSel ? '#faf7ef' : LEVEL_INFO[e.level].color }}
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {loading && (
            <p className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-mist">
              <Loader2 size={13} className="animate-spin" /> Загружаем историю…
            </p>
          )}
        </div>

        {/* Детали дня */}
        <div className="rounded-3xl border border-line bg-card p-4 shadow-card sm:p-6">
          <AnimatePresence mode="wait">
            {selected == null ? (
              <motion.div
                key="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-full min-h-48 flex-col items-center justify-center text-center"
              >
                <Compass size={26} className="text-mist" />
                <p className="mt-3 max-w-56 text-sm font-semibold text-mist">
                  Выберите день в календаре, чтобы увидеть записи
                </p>
              </motion.div>
            ) : selectedEntries.length === 0 ? (
              <motion.div
                key={`empty-${selected}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-full min-h-48 flex-col items-center justify-center text-center"
              >
                <p className="font-display text-lg font-bold">
                  {selected} {monthLabel}
                </p>
                <p className="mt-2 max-w-56 text-sm font-semibold text-mist">
                  В этот день записей нет
                </p>
                <Link
                  href="/"
                  className="mt-5 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-cream transition-transform hover:-translate-y-0.5"
                >
                  Открыть навигатор
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key={`day-${selected}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className="font-display text-lg font-bold">
                  {selected} {monthLabel}
                </p>
                <div className="mt-4 space-y-4">
                  {selectedEntries.map((e) => {
                    const meta = EMOTION_MAP[e.emotion];
                    const Icon = meta?.icon ?? Compass;
                    const entryLogs = logsByEntry.get(e.id) ?? [];
                    const time = new Intl.DateTimeFormat('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(new Date(e.createdAt));
                    const doneSkills = entryLogs.filter((l) => l.done);
                    const noted = entryLogs.filter((l) => l.note.trim());
                    return (
                      <div key={e.id} className="rounded-2xl border border-line bg-cream/60 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="grid size-8 place-items-center rounded-lg"
                            style={{ background: meta?.soft, color: meta?.color }}
                          >
                            <Icon size={16} strokeWidth={2.2} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">
                              {meta?.label ?? e.emotion}
                              {e.subtype && meta && (
                                <span className="font-semibold text-mist">
                                  {' '}
                                  · {meta.subtypes.find((s) => s.id === e.subtype)?.label}
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] font-semibold text-mist">{time}</p>
                          </div>
                          <span
                            className="rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
                            style={{ background: LEVEL_INFO[e.level].color }}
                          >
                            {e.intensity}/10
                          </span>
                        </div>

                        {/* Навыки */}
                        <div className="mt-3 space-y-1.5">
                          {e.skills.map((id) => {
                            const sk = SKILLS[id];
                            const done = doneSkills.some((l) => l.skillId === id);
                            return (
                              <div key={id} className="flex items-center gap-2 text-[12.5px]">
                                <span
                                  className={clsx(
                                    'grid size-4.5 shrink-0 place-items-center rounded-full',
                                    done ? 'bg-pine text-white' : 'border border-line-strong text-transparent',
                                  )}
                                >
                                  <Check size={10} strokeWidth={4} />
                                </span>
                                <span className={clsx('font-semibold', done ? 'text-ink/85' : 'text-mist')}>
                                  {sk?.name ?? id}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Заметки */}
                        {noted.length > 0 && (
                          <div className="mt-3 space-y-1.5 border-t border-line pt-3">
                            {noted.map((l) => (
                              <p key={l.skillId} className="flex gap-2 text-[12px] leading-relaxed text-ink/70">
                                <Quote size={11} className="mt-0.5 shrink-0 text-gold" />
                                <span>
                                  <b>{SKILLS[l.skillId]?.name}:</b> {l.note}
                                </span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Подсказка */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-cream/60 p-5">
        <NotebookPen size={18} className="mt-0.5 shrink-0 text-pine" />
        <p className="text-[13px] leading-relaxed text-mist">
          Цвет точки в календаре — максимальная интенсивность дня: зелёная — низкая (1–3), янтарная —
          средняя (4–7), терракотовая — высокая (8–10). Регулярность важнее количества: даже одно
          обращение в день развивает эмоциональную гибкость.
        </p>
      </div>
    </div>
  );
}
