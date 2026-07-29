'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpenText, ChevronDown, ListChecks, Search } from 'lucide-react';
import clsx from 'clsx';
import { MODULE_LABELS, SKILLS, TRACK_LABELS, type ModuleKey, type Skill, type TrackKey } from '@/lib/skills';

const MODULE_ORDER: ModuleKey[] = ['mindfulness', 'distress', 'emotion', 'interpersonal', 'ro_openness', 'ro_social'];

function CatalogCard({ skill, open, onToggle }: { skill: Skill; open: boolean; onToggle: () => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-card">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-start gap-3 p-4 text-left sm:p-5"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-[16px] font-bold">{skill.name}</h3>
            <span
              className={clsx(
                'rounded-full px-2 py-0.5 text-[11px] font-bold',
                skill.track === 'dbt' ? 'bg-pine-soft text-pine-deep' : 'bg-[#ecebf7] text-[#4e4f96]',
              )}
            >
              {TRACK_LABELS[skill.track]}
            </span>
          </div>
          <p className="mt-1 text-[11.5px] font-bold tracking-wide text-mist uppercase">
            {MODULE_LABELS[skill.module]}
          </p>
          {!open && (
            <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink/70">{skill.desc}</p>
          )}
        </div>
        <ChevronDown
          size={18}
          className={clsx('mt-1 shrink-0 text-mist transition-transform duration-300', open && 'rotate-180')}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-line px-4 pt-4 pb-4 sm:px-5 sm:pb-5">
              <p className="text-[13.5px] leading-relaxed text-ink/75">{skill.desc}</p>
              <p className="mt-4 flex items-center gap-1.5 text-xs font-bold tracking-wide text-mist uppercase">
                <ListChecks size={14} /> Как применять
              </p>
              <div className="mt-2.5 space-y-2">
                {skill.steps.map((s, i) => (
                  <div key={i} className="flex gap-3 rounded-xl bg-cream px-3.5 py-2.5">
                    <span className="grid size-5.5 shrink-0 translate-y-px place-items-center rounded-full bg-ink text-[10px] font-bold text-cream">
                      {i + 1}
                    </span>
                    <p className="text-[13px] leading-relaxed text-ink/80">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SkillsPage() {
  const [query, setQuery] = useState('');
  const [module, setModule] = useState<ModuleKey | 'all'>('all');
  const [track, setTrack] = useState<TrackKey | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const all = useMemo(() => Object.values(SKILLS), []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((s) => {
      if (module !== 'all' && s.module !== module) return false;
      if (track !== 'all' && s.track !== track) return false;
      if (q && !`${s.name} ${s.desc}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [all, query, module, track]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-bold text-pine-deep">
          <BookOpenText size={14} /> Справочник · {all.length} навыков
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Библиотека навыков
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-mist">
          Все навыки стандартной ДПТ (М. Линехан) и радикально-открытой ДПТ (Т. Линч), используемые
          навигатором. Можно изучать заранее — в спокойном состоянии навык осваивается лучше.
        </p>
      </div>

      {/* Поиск */}
      <div className="mt-7 flex items-center gap-2.5 rounded-full border border-line bg-card px-4 py-3 shadow-card">
        <Search size={17} className="shrink-0 text-mist" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию или описанию…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-mist/70"
        />
      </div>

      {/* Фильтры */}
      <div className="nice-scroll mt-4 flex gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setModule('all')}
          className={clsx(
            'shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-all',
            module === 'all' ? 'border-ink bg-ink text-cream' : 'border-line bg-card text-ink/70',
          )}
        >
          Все модули
        </button>
        {MODULE_ORDER.map((m) => (
          <button
            key={m}
            onClick={() => setModule(m)}
            className={clsx(
              'shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-all',
              module === m ? 'border-ink bg-ink text-cream' : 'border-line bg-card text-ink/70',
            )}
          >
            {MODULE_LABELS[m]}
          </button>
        ))}
        <span className="mx-1 w-px shrink-0 bg-line-strong" />
        {(['dbt', 'rodbt'] as TrackKey[]).map((t) => (
          <button
            key={t}
            onClick={() => setTrack(track === t ? 'all' : t)}
            className={clsx(
              'shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold transition-all',
              track === t
                ? t === 'dbt'
                  ? 'border-pine bg-pine text-white'
                  : 'border-[#5c5da3] bg-[#5c5da3] text-white'
                : 'border-line bg-card text-ink/70',
            )}
          >
            {TRACK_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Список */}
      {filtered.length === 0 ? (
        <p className="mt-14 text-center text-sm font-semibold text-mist">
          Ничего не найдено — попробуйте другой запрос
        </p>
      ) : (
        <div className="mt-6 grid items-start gap-3.5 md:grid-cols-2">
          {filtered.map((s) => (
            <CatalogCard
              key={s.id}
              skill={s}
              open={openId === s.id}
              onToggle={() => setOpenId(openId === s.id ? null : s.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
