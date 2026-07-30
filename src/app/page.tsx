'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  TriangleAlert,
  Quote,
  Compass,
  Zap,
  Shield,
  HeartHandshake,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';
import { EMOTIONS, EMOTION_MAP, LEVEL_INFO, type IntensityLevel, type ProfileType } from '@/lib/emotions';
import { SKILLS, MODULE_LABELS, type ModuleKey } from '@/lib/skills';
import { QUIZ_QUESTIONS, PROFILE_INFO, type QuizAnswer } from '@/lib/quiz';
import SkillCard, { type SkillLogState } from '@/components/SkillCard';

type Screen = 'loading' | 'welcome' | 'quiz' | 'profileResult' | 'nav' | 'results';

interface Profile {
  profileType: ProfileType;
  impulsiveScore: number;
  hypercontrolScore: number;
}

interface RecResult {
  entryId: number;
  skills: string[];
  level: IntensityLevel;
  note: string | null;
}

function getUserKey(): string {
  let k = localStorage.getItem('dbt_user_key');
  if (!k) {
    k = crypto.randomUUID();
    localStorage.setItem('dbt_user_key', k);
  }
  return k;
}

const SUPPORT_LINE: Record<IntensityLevel, string> = {
  low: 'Хорошо, что вы заметили эмоцию на лёгкой стадии — сейчас лучшее время для навыков осознанности и профилактики.',
  medium:
    'Эмоция уже заметная. Навыки ниже помогут её отрегулировать — не подавляя и не усиливая.',
  high:
    'Сейчас высокая волна. Одна задача: пережить её без разрушительных действий. Начните с первого навыка — не думая о следующих.',
};

export default function Page() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [profile, setProfile] = useState<Profile | null>(null);

  // Профилирование
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [savingQuiz, setSavingQuiz] = useState(false);

  // Навигатор
  const [emotion, setEmotion] = useState<string | null>(null);
  const [subtype, setSubtype] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [crisis, setCrisis] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Результат
  const [result, setResult] = useState<RecResult | null>(null);
  const [logs, setLogs] = useState<Record<string, SkillLogState>>({});

  // Реф для прокрутки к блоку интенсивности
  const intensityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const key = getUserKey();
    fetch(`/api/profile?userKey=${key}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setProfile(d.profile);
          setScreen('nav');
        } else {
          setScreen('welcome');
        }
      })
      .catch(() => setScreen('welcome'));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [screen]);

  /* ---------- Профилирование ---------- */
  const answerQuestion = (a: QuizAnswer) => {
    const next = [...answers, a];
    setAnswers(next);
    if (quizIndex + 1 < QUIZ_QUESTIONS.length) {
      setTimeout(() => setQuizIndex(quizIndex + 1), 220);
    } else {
      setSavingQuiz(true);
      const key = getUserKey();
      fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userKey: key, answers: next }),
      })
        .then((r) => r.json())
        .then((d) => {
          setProfile(d.profile);
          setTimeout(() => {
            setScreen('profileResult');
            setSavingQuiz(false);
          }, 400);
        })
        .catch(() => setSavingQuiz(false));
    }
  };

  const retakeQuiz = () => {
    setAnswers([]);
    setQuizIndex(0);
    setScreen('quiz');
  };

  /* ---------- Навигатор ---------- */
  const submit = async () => {
    if (!emotion || submitting) return;
    setSubmitting(true);
    try {
      const key = getUserKey();
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userKey: key, emotion, subtype, intensity, crisis }),
      });
      const data: RecResult = await res.json();
      setResult(data);
      const init: Record<string, SkillLogState> = {};
      data.skills.forEach((id) => (init[id] = { done: false, note: '' }));
      setLogs(init);
      setScreen('results');
    } catch {
      /* игнорируем — пользователь может повторить */
    } finally {
      setSubmitting(false);
    }
  };

  const resetNavigator = () => {
    setEmotion(null);
    setSubtype(null);
    setIntensity(5);
    setCrisis(false);
    setResult(null);
    setScreen('nav');
  };

  const saveLog = useCallback(
    (skillId: string, patch: Partial<SkillLogState>) => {
      if (!result) return;
      setLogs((prev) => {
        const cur = prev[skillId] ?? { done: false, note: '' };
        const next = { ...cur, ...patch };
        fetch('/api/skill-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userKey: getUserKey(),
            entryId: result.entryId,
            skillId,
            done: next.done,
            note: next.note,
          }),
        }).catch(() => {});
        return { ...prev, [skillId]: next };
      });
    },
    [result],
  );

  const band = intensity >= 8 ? LEVEL_INFO.high : intensity >= 4 ? LEVEL_INFO.medium : LEVEL_INFO.low;

  /* ---------- Группировка результатов ---------- */
  const groupedRest = useMemo(() => {
    if (!result) return [];
    const rest = result.skills.slice(3);
    const order: { module: ModuleKey; ids: string[] }[] = [];
    rest.forEach((id) => {
      const sk = SKILLS[id];
      if (!sk) return;
      const g = order.find((o) => o.module === sk.module);
      if (g) g.ids.push(id);
      else order.push({ module: sk.module, ids: [id] });
    });
    return order;
  }, [result]);

  const profileInfo = profile ? PROFILE_INFO[profile.profileType] : null;
  const emotionMeta = emotion ? EMOTION_MAP[emotion] : null;

  // Обработчик выбора эмоции с автопрокруткой
  const handleEmotionSelect = (id: string) => {
    setEmotion(id);
    setSubtype(null);
    // Прокручиваем к блоку интенсивности через небольшой таймаут, чтобы DOM успел обновиться
    setTimeout(() => {
      intensityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <AnimatePresence mode="wait">
        {/* ================= ЗАГРУЗКА ================= */}
        {screen === 'loading' && (
          <motion.div key="loading" exit={{ opacity: 0 }} className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="animate-spin text-pine" size={28} />
          </motion.div>
        )}

        {/* ================= ПРИВЕТСТВИЕ ================= */}
        {screen === 'welcome' && (
          <motion.section
            key="welcome"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden py-14 sm:py-24"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 right-[-10%] size-[420px] rounded-full opacity-60 blur-3xl"
              style={{ background: 'radial-gradient(circle, #cfe3d8 0%, transparent 65%)' }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-[-30%] left-[-12%] size-[380px] rounded-full opacity-50 blur-3xl"
              style={{ background: 'radial-gradient(circle, #ecdcbb 0%, transparent 65%)' }}
            />
            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-bold text-pine-deep">
                <Compass size={14} /> ДПТ и РО-ДПТ · по протоколам М. Линехан и Т. Линча
              </span>
              <h1 className="mt-6 font-display text-4xl leading-[1.12] font-bold tracking-tight sm:text-[56px]">
                Найдите нужный навык <span className="text-pine">за минуту</span>
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-mist sm:text-base">
                Навигатор подберёт навыки диалектико-поведенческой терапии под ваш стиль регуляции,
                конкретную эмоцию и её интенсивность — чтобы в трудный момент у вас был ясный план,
                а не пустота перед эмоцией.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setScreen('quiz')}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-cream shadow-lift transition-transform hover:-translate-y-0.5 active:scale-95"
                >
                  Определить мой профиль <ArrowRight size={16} />
                </button>
                <Link
                  href="/about"
                  className="rounded-full border border-line-strong bg-card px-6 py-3.5 text-sm font-bold text-ink/80 transition-colors hover:border-ink/40"
                >
                  Как это работает
                </Link>
              </div>

              <div className="mt-14 grid gap-3 sm:grid-cols-3">
                {[
                  { n: '01', t: 'Профиль', d: '8 коротких вопросов — импульсивный стиль или гиперконтроль' },
                  { n: '02', t: 'Эмоция', d: 'Выберите, что чувствуете, и оцените силу от 1 до 10' },
                  { n: '03', t: 'Навыки', d: 'До 7 навыков по приоритету — с пошаговыми инструкциями' },
                ].map((s, i) => (
                  <motion.div
                    key={s.n}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.1 }}
                    className="rounded-2xl border border-line bg-card p-5 shadow-card"
                  >
                    <span className="font-display text-2xl font-bold text-pine">{s.n}</span>
                    <p className="mt-2 font-display text-[17px] font-bold">{s.t}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-mist">{s.d}</p>
                  </motion.div>
                ))}
              </div>

              <p className="mt-10 flex max-w-xl items-start gap-2.5 rounded-2xl border border-line bg-cream/70 p-4 text-xs leading-relaxed text-mist">
                <HeartHandshake size={30} className="shrink-0 text-gold" />
                Приложение — дополнение к терапии, а не её замена. В остром состоянии обращайтесь к
                специалисту; при угрозе жизни звоните 112.
              </p>
            </div>
          </motion.section>
        )}

        {/* ================= ПРОФИЛИРОВАНИЕ ================= */}
        {screen === 'quiz' && (
          <motion.section
            key="quiz"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-2xl py-10 sm:py-16"
          >
            <div className="mb-8 flex items-center justify-between">
              {profile ? (
                <button
                  onClick={() => setScreen('nav')}
                  className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-mist hover:text-ink"
                >
                  <ArrowLeft size={15} /> Назад
                </button>
              ) : (
                <span />
              )}
              <span className="text-xs font-bold tracking-wide text-mist uppercase">
                Вопрос {quizIndex + 1} из {QUIZ_QUESTIONS.length}
              </span>
            </div>
            <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-ink/[0.08]">
              <motion.div
                className="h-full rounded-full bg-pine"
                animate={{ width: `${((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={quizIndex}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="font-display text-[26px] leading-snug font-bold sm:text-3xl">
                  {QUIZ_QUESTIONS[quizIndex].question}
                </h2>
                <div className="mt-8 space-y-3">
                  {(['I', 'H'] as QuizAnswer[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => answerQuestion(v)}
                      disabled={savingQuiz}
                      className="group flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-line bg-card p-5 text-left shadow-card transition-all hover:border-pine/50 hover:shadow-lift active:scale-[0.99] disabled:opacity-50"
                    >
                      <span className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-line-strong transition-colors group-hover:border-pine" />
                      <span className="text-[15px] leading-snug font-semibold text-ink/85">
                        {v === 'I' ? QUIZ_QUESTIONS[quizIndex].optionI : QUIZ_QUESTIONS[quizIndex].optionH}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {savingQuiz && (
              <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-pine">
                <Loader2 size={15} className="animate-spin" /> Определяем ваш профиль…
              </p>
            )}
          </motion.section>
        )}

        {/* ================= РЕЗУЛЬТАТ ПРОФИЛЯ ================= */}
        {screen === 'profileResult' && profileInfo && (
          <motion.section
            key="profileResult"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-2xl py-10 sm:py-16"
          >
            <p className="text-center text-xs font-bold tracking-widest text-mist uppercase">
              Ваш профиль регуляции
            </p>
            <div className="mt-5 overflow-hidden rounded-3xl border border-line bg-card shadow-lift">
              <div className="h-1.5" style={{ background: profileInfo.accent }} />
              <div className="p-7 sm:p-10">
                <div
                  className="inline-grid size-13 place-items-center rounded-2xl text-white"
                  style={{ background: profileInfo.accent }}
                >
                  {profileInfo.type === 'impulsive' ? <Zap size={24} /> : <Shield size={24} />}
                </div>
                <h2 className="mt-5 font-display text-3xl font-bold">{profileInfo.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{profileInfo.summary}</p>
                <ul className="mt-6 space-y-3">
                  {profileInfo.details.map((d) => (
                    <li key={d} className="flex gap-3 rounded-xl bg-cream px-4 py-3 text-[13.5px] leading-relaxed text-ink/80">
                      <span
                        className="mt-1.5 size-2 shrink-0 rounded-full"
                        style={{ background: profileInfo.accent }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs leading-relaxed text-mist">
                  Профиль — это склонность, а не диагноз. Он помогает подбирать навыки: вы всегда
                  можете перепройти профилирование.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={() => setScreen('nav')}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5 active:scale-95"
                  >
                    Перейти к навигатору <ArrowRight size={15} />
                  </button>
                  <button
                    onClick={retakeQuiz}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-bold text-ink/70 hover:border-ink/40"
                  >
                    <RotateCcw size={14} /> Перепройти
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ================= НАВИГАТОР ================= */}
        {screen === 'nav' && (
          <motion.section
            key="nav"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="py-8 sm:py-12"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Что вы чувствуете <span className="text-pine">прямо сейчас</span>?
                </h1>
                <p className="mt-2 text-sm text-mist">
                  Выберите эмоцию — можно уточнить её оттенок, затем оцените интенсивность.
                </p>
              </div>
              {profileInfo && (
                <button
                  onClick={retakeQuiz}
                  title="Перепройти профилирование"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-card px-3.5 py-2 text-xs font-bold shadow-card transition-colors hover:border-ink/40"
                >
                  <span className="size-2.5 rounded-full" style={{ background: profileInfo.accent }} />
                  {profileInfo.title}
                  <RotateCcw size={12} className="text-mist" />
                </button>
              )}
            </div>

            {/* Шаг 1. Эмоции */}
            <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
              {EMOTIONS.map((e) => {
                const active = emotion === e.id;
                const Icon = e.icon;
                return (
                  <button
                    key={e.id}
                    onClick={() => handleEmotionSelect(e.id)}
                    aria-pressed={active}
                    className={clsx(
                      'group flex cursor-pointer items-center gap-3 rounded-2xl border bg-card p-3.5 text-left transition-all sm:p-4',
                      active
                        ? 'border-transparent shadow-lift ring-2'
                        : 'border-line shadow-card hover:border-line-strong hover:shadow-lift',
                    )}
                    style={active ? ({ '--tw-ring-color': e.color } as React.CSSProperties) : undefined}
                  >
                    <span
                      className="grid size-10 shrink-0 place-items-center rounded-xl transition-transform group-active:scale-90"
                      style={{ background: e.soft, color: e.color }}
                    >
                      <Icon size={20} strokeWidth={2.1} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13.5px] leading-tight font-bold sm:text-sm">
                        {e.label}
                      </span>
                      <span className="mt-0.5 hidden text-[11px] leading-tight text-mist sm:block">
                        {e.subtypes.map((s) => s.label.split(' ')[0]).join(' · ')}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Подтипы */}
            <AnimatePresence initial={false}>
              {emotionMeta && (
                <motion.div
                  key={emotionMeta.id}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-xs font-bold tracking-wide text-mist uppercase">
                      Оттенок:
                    </span>
                    <button
                      onClick={() => setSubtype(null)}
                      className={clsx(
                        'cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all active:scale-95',
                        subtype === null
                          ? 'border-ink bg-ink text-cream'
                          : 'border-line bg-card text-ink/70 hover:border-line-strong',
                      )}
                    >
                      Вся эмоция целиком
                    </button>
                    {emotionMeta.subtypes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSubtype(s.id)}
                        className={clsx(
                          'cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all active:scale-95',
                          subtype === s.id
                            ? 'border-ink bg-ink text-cream'
                            : 'border-line bg-card text-ink/70 hover:border-line-strong',
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Шаг 2. Интенсивность — добавлен scroll-mt-20 для отступа от хедера */}
            <div
              ref={intensityRef}
              className={clsx(
                'mt-6 rounded-3xl border bg-card p-5 shadow-card transition-opacity sm:p-7 scroll-mt-25',
                !emotion && 'pointer-events-none opacity-50',
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-xl font-bold">Насколько это сильно?</h2>
                <span className="text-sm font-semibold" style={{ color: band.color }}>
                  {band.label} · {band.range}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-4 sm:gap-6">
                <span
                  className="grid size-16 shrink-0 place-items-center rounded-2xl font-display text-3xl font-bold text-white sm:size-18 sm:text-4xl"
                  style={{ background: band.color }}
                >
                  {intensity}
                </span>
                <div className="flex-1">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="dbt-range"
                    style={
                      {
                        '--thumb': band.color,
                        background: `linear-gradient(90deg, #a9cabb33 0%, #b07e2833 55%, #c2502c33 100%), linear-gradient(90deg, ${band.color} ${(intensity - 1) / 9 * 100}%, #00000000 ${(intensity - 1) / 9 * 100}%)`,
                        backgroundColor: '#eee9da',
                      } as React.CSSProperties
                    }
                    aria-label="Интенсивность эмоции от 1 до 10"
                  />
                  <div className="mt-2 flex justify-between text-[11px] font-semibold text-mist">
                    <span>1 — едва заметно</span>
                    <span className="hidden sm:inline">5 — уже сложно думать о другом</span>
                    <span>10 — максимум</span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[13px] leading-relaxed text-mist">{band.focus}</p>

              {/* Кризисный переключатель */}
              <label
                className={clsx(
                  'mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors',
                  crisis ? 'border-ember/60 bg-ember-soft' : 'border-line bg-cream/60 hover:border-line-strong',
                )}
              >
                <input
                  type="checkbox"
                  checked={crisis}
                  onChange={(e) => setCrisis(e.target.checked)}
                  className="mt-0.5 size-4.5 shrink-0 accent-ember"
                />
                <span className="text-[13px] leading-relaxed">
                  <span className="font-bold">Появляются мысли о причинении себе вреда.</span>{' '}
                  <span className="text-mist">
                    Отметьте — и навигатор поставит кризисные навыки первыми. Если мысли сильные,
                    позвоните 112: безопасность важнее любых упражнений.
                  </span>
                </span>
              </label>

              <button
                onClick={submit}
                disabled={!emotion || submitting}
                className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-[15px] font-bold text-cream shadow-lift transition-all hover:-translate-y-0.5 active:scale-[0.99] disabled:translate-y-0 disabled:opacity-40 sm:w-auto"
              >
                {submitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" /> Подбираем…
                  </>
                ) : (
                  <>
                    Подобрать навыки <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>
          </motion.section>
        )}

        {/* ================= РЕЗУЛЬТАТ ================= */}
        {screen === 'results' && result && (
          <motion.section
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="py-8 sm:py-12"
          >
            <button
              onClick={resetNavigator}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-mist hover:text-ink"
            >
              <ArrowLeft size={15} /> Новый запрос
            </button>

            <div className="mt-5 max-w-3xl">
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Ваш план на сейчас
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-mist">
                {SUPPORT_LINE[result.level]}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {emotionMeta && (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
                    style={{ background: emotionMeta.soft, color: emotionMeta.color }}
                  >
                    <emotionMeta.icon size={13} />
                    {emotionMeta.label}
                    {subtype && ` · ${emotionMeta.subtypes.find((s) => s.id === subtype)?.label}`}
                  </span>
                )}
                <span
                  className="rounded-full px-3 py-1.5 text-xs font-bold text-white"
                  style={{ background: LEVEL_INFO[result.level].color }}
                >
                  Интенсивность {intensity}/10
                </span>
                {profileInfo && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-xs font-bold text-ink/70">
                    <span className="size-2 rounded-full" style={{ background: profileInfo.accent }} />
                    {profileInfo.title}
                  </span>
                )}
              </div>
            </div>

            {/* Кризисный баннер */}
            {crisis && (
              <div className="mt-6 flex items-start gap-3.5 rounded-2xl border border-ember/50 bg-ember-soft p-5">
                <TriangleAlert size={22} className="mt-0.5 shrink-0 text-ember" />
                <div>
                  <p className="font-display text-lg font-bold text-ember">Сначала — безопасность</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink/80">
                    Если мысли о причинении себе вреда сильные или вы не уверены, что справитесь, —
                    позвоните <b>112</b> (экстренная линия) или обратитесь за неотложной помощью.
                    Навыки ниже — чтобы пережить острую волну, но они не заменяют помощь специалистов.
                  </p>
                </div>
              </div>
            )}

            {/* Подсказка по подтипу */}
            {result.note && (
              <div className="mt-6 flex items-start gap-3.5 rounded-2xl border border-line bg-cream/70 p-5">
                <Quote size={19} className="mt-0.5 shrink-0 text-gold" />
                <p className="text-[13.5px] leading-relaxed text-ink/75">
                  <span className="font-bold">Про ваш оттенок эмоции: </span>
                  {result.note}
                </p>
              </div>
            )}

            {/* Основные навыки */}
            <h2 className="mt-10 font-display text-[22px] font-bold">
              Начните с этих — по порядку
            </h2>
            <div className="mt-4 space-y-3.5">
              {result.skills.slice(0, 3).map((id, i) => {
                const sk = SKILLS[id];
                if (!sk) return null;
                return (
                  <SkillCard
                    key={id}
                    skill={sk}
                    num={i + 1}
                    state={logs[id] ?? { done: false, note: '' }}
                    onToggle={() =>
                      saveLog(id, { done: !(logs[id]?.done ?? false) })
                    }
                    onSaveNote={(note) => saveLog(id, { note })}
                  />
                );
              })}
            </div>

            {/* Дополнительные — по модулям */}
            {groupedRest.length > 0 && (
              <>
                <h2 className="mt-12 font-display text-[22px] font-bold">
                  Далее — дополнительные и навыки-якоря
                </h2>
                {groupedRest.map((g) => (
                  <div key={g.module} className="mt-6">
                    <p className="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-mist uppercase">
                      <span className="h-px w-6 bg-line-strong" />
                      {MODULE_LABELS[g.module]}
                    </p>
                    <div className="space-y-3.5">
                      {g.ids.map((id) => {
                        const sk = SKILLS[id];
                        if (!sk) return null;
                        const idx = result.skills.indexOf(id);
                        return (
                          <SkillCard
                            key={id}
                            skill={sk}
                            num={idx + 1}
                            state={logs[id] ?? { done: false, note: '' }}
                            onToggle={() => saveLog(id, { done: !(logs[id]?.done ?? false) })}
                            onSaveNote={(note) => saveLog(id, { note })}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-cream/70 p-5">
              <p className="flex-1 text-[13.5px] leading-relaxed text-mist">
                Отмечайте выполненные навыки и оставляйте заметки — всё сохраняется в истории, где
                можно отследить прогресс по дням.
              </p>
              <Link
                href="/history"
                className="rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-cream transition-transform hover:-translate-y-0.5"
              >
                Открыть историю
              </Link>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
