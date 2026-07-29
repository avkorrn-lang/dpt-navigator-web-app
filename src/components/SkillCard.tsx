'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ListChecks, NotebookPen } from 'lucide-react';
import clsx from 'clsx';
import { MODULE_LABELS, TRACK_LABELS, type Skill } from '@/lib/skills';

export interface SkillLogState {
  done: boolean;
  note: string;
}

interface Props {
  skill: Skill;
  num: number;
  state: SkillLogState;
  disabled?: boolean;
  onToggle: () => void;
  onSaveNote: (note: string) => void;
}

export default function SkillCard({ skill, num, state, disabled, onToggle, onSaveNote }: Props) {
  const [open, setOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const noteValue = draft ?? state.note;

  const saveNote = () => {
    onSaveNote(noteValue);
    setDraft(null);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  };

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(num, 7) * 0.05 }}
      className={clsx(
        'overflow-hidden rounded-2xl border bg-card shadow-card transition-colors',
        state.done ? 'border-pine/50 bg-pine-soft/60' : 'border-line',
      )}
    >
      <div className="p-4 sm:p-5">
        {/* Шапка карточки */}
        <div className="flex items-start gap-3.5">
          <span
            className={clsx(
              'mt-0.5 grid size-8 shrink-0 place-items-center rounded-full font-display text-sm font-bold',
              state.done ? 'bg-pine text-white' : 'bg-ink/[0.06] text-ink/70',
            )}
          >
            {state.done ? <Check size={16} strokeWidth={3} /> : num}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <h3 className="font-display text-[17px] leading-snug font-bold">{skill.name}</h3>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <span className="rounded-full border border-line bg-cream px-2 py-0.5 text-[11px] font-semibold text-mist">
                {MODULE_LABELS[skill.module]}
              </span>
              <span
                className={clsx(
                  'rounded-full px-2 py-0.5 text-[11px] font-bold',
                  skill.track === 'dbt' ? 'bg-pine-soft text-pine-deep' : 'bg-[#ecebf7] text-[#4e4f96]',
                )}
              >
                {TRACK_LABELS[skill.track]}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggle}
            disabled={disabled}
            aria-pressed={state.done}
            className={clsx(
              'inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all active:scale-95',
              state.done
                ? 'border-pine bg-pine text-white'
                : 'border-line-strong bg-card text-ink/70 hover:border-pine hover:text-pine-deep',
              disabled && 'opacity-50',
            )}
          >
            <Check size={14} strokeWidth={3} />
            {state.done ? 'Выполнено' : 'Отметить'}
          </button>
        </div>

        {/* Описание */}
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink/75">{skill.desc}</p>

        {/* Действия */}
        <div className="mt-3.5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-ink/[0.05] px-3 py-1.5 text-xs font-bold text-ink/75 transition-colors hover:bg-ink/[0.09]"
          >
            <ListChecks size={14} strokeWidth={2.4} />
            Как применять · {skill.steps.length} шага
            <ChevronDown
              size={14}
              className={clsx('transition-transform duration-300', open && 'rotate-180')}
            />
          </button>
          <button
            type="button"
            onClick={() => setNoteOpen((v) => !v)}
            aria-expanded={noteOpen}
            className={clsx(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors',
              state.note
                ? 'bg-gold-soft text-gold'
                : 'bg-ink/[0.05] text-ink/75 hover:bg-ink/[0.09]',
            )}
          >
            <NotebookPen size={14} strokeWidth={2.4} />
            {state.note ? 'Заметка ✓' : 'Заметка'}
          </button>
        </div>

        {/* Шаги */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.ol
              key="steps"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3.5 space-y-2 border-t border-line pt-3.5">
                {skill.steps.map((step, i) => (
                  <div key={i} className="flex gap-3 rounded-xl bg-cream px-3.5 py-2.5">
                    <span className="grid size-5.5 shrink-0 translate-y-px place-items-center rounded-full bg-ink font-sans text-[10px] font-bold text-cream">
                      {i + 1}
                    </span>
                    <p className="text-[13px] leading-relaxed text-ink/80">{step}</p>
                  </div>
                ))}
              </div>
            </motion.ol>
          )}
        </AnimatePresence>

        {/* Заметка */}
        <AnimatePresence initial={false}>
          {noteOpen && (
            <motion.div
              key="note"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3.5 border-t border-line pt-3.5">
                <textarea
                  value={noteValue}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Как прошло применение навыка? Что помогло, что нет?"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-line bg-cream px-3.5 py-2.5 text-[13px] leading-relaxed outline-none placeholder:text-mist/70 focus:border-pine/60 focus:bg-card"
                />
                <div className="mt-2 flex items-center justify-end gap-3">
                  {savedFlash && (
                    <span className="text-xs font-semibold text-pine">Сохранено ✓</span>
                  )}
                  <button
                    type="button"
                    onClick={saveNote}
                    disabled={draft === null || disabled}
                    className="cursor-pointer rounded-full bg-ink px-4 py-1.5 text-xs font-bold text-cream transition-all hover:bg-ink/85 active:scale-95 disabled:opacity-40"
                  >
                    Сохранить заметку
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
