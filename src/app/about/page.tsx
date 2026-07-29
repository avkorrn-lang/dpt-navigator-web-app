import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Compass,
  BookOpenText,
  Zap,
  Shield,
  TriangleAlert,
  HeartHandshake,
  ArrowRight,
  Layers,
  GraduationCap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'О проекте — ДПТ-Навигатор',
  description:
    'Научная основа, принципы подбора навыков и источники: стандартная ДПТ М. Линехан и радикально-открытая ДПТ Т. Линча.',
};

const REFERENCES = [
  'Linehan, M. M. (1993). Cognitive-Behavioral Treatment of Borderline Personality Disorder. New York: Guilford Press.',
  'Linehan, M. M. (2015). DBT Skills Training Manual (2nd ed.). New York: Guilford Press.',
  'Lynch, T. R. (2018). Radically Open Dialectical Behavior Therapy: Theory and Practice for Treating Disorders of Overcontrol. Oakland: New Harbinger / Context Press.',
  'Lynch, T. R. (2018). The Skills Training Manual for Radically Open Dialectical Behavior Therapy. Oakland: New Harbinger / Context Press.',
  'Lynch, T. R., Hempel, R. J., & Dunkley, C. (2015). Radically Open-Dialectical Behavior Therapy for Disorders of Over-Control: Signaling Matters. American Journal of Psychotherapy, 69(2), 141–162.',
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      {/* Заголовок */}
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-bold text-pine-deep">
          <Compass size={14} /> О проекте
        </span>
        <h1 className="mt-5 font-display text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
          Навыков много.
          <br />
          Нужный — <span className="text-pine">один за раз</span>.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-mist">
          ДПТ-навигатор решает главную практическую трудность самопомощи: в остром эмоциональном
          состоянии тяжело вспомнить и выбрать подходящий навык. Приложение делает этот выбор за три
          шага — профиль регуляции, эмоция с оттенком и интенсивность — и выдаёт приоритетный план
          из проверенных техник.
        </p>
      </div>

      {/* Два подхода */}
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-card">
          <div className="h-1.5 bg-ember" />
          <div className="p-6 sm:p-8">
            <div className="inline-grid size-12 place-items-center rounded-2xl bg-ember text-white">
              <Zap size={22} />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold">Стандартная ДПТ</h2>
            <p className="mt-1 text-xs font-bold tracking-wider text-ember uppercase">Марша Линехан</p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink/75">
              Разработана для эмоциональной дисрегуляции и импульсивности. Четыре модуля:
              осознанность, стрессоустойчивость (кризисные навыки STOP, TIPP, ACCEPTS,
              «радикальное принятие»), регуляция эмоций (проверка фактов, противоположное действие)
              и межличностная эффективность (DEAR MAN, GIVE, FAST).
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-mist">
              В навигаторе — основа для импульсивного профиля, с приоритетом торможения импульсов при
              высокой интенсивности.
            </p>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-card">
          <div className="h-1.5 bg-[#5c5da3]" />
          <div className="p-6 sm:p-8">
            <div className="inline-grid size-12 place-items-center rounded-2xl bg-[#5c5da3] text-white">
              <Shield size={22} />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold">Радикально-открытая ДПТ</h2>
            <p className="mt-1 text-xs font-bold tracking-wider text-[#5c5da3] uppercase">Томас Линч · РО-ДПТ</p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink/75">
              Создана для противоположной трудности — избыточного самоконтроля: ригидности,
              перфекционизма, подавления эмоций и социальной дистанции. Её цель — не больше контроля,
              а радикальная открытость, гибкость и связанность: самоисследование, «большая тройка +1»,
              VARIES, HEART, MATCH+1 и другие навыки открытости.
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-mist">
              В навигаторе — основа для профиля гиперконтроля; жёсткие техники подавления здесь
              сознательно не предлагаются.
            </p>
          </div>
        </div>
      </div>

      {/* Как работает алгоритм */}
      <div className="mt-12 rounded-3xl border border-line bg-card p-6 shadow-card sm:p-8">
        <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold">
          <Layers size={22} className="text-pine" /> Как подбираются навыки
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            {
              t: '8–10 баллов',
              d: 'Кризисные навыки стрессоустойчивости: STOP, TIPP, ACCEPTS, успокоение через чувства, радикальное принятие — пережить волну без деструктивных действий.',
            },
            {
              t: '4–7 баллов',
              d: 'Регуляция эмоций: проверка фактов, противоположное действие, решение проблем — изменить эмоцию или её источник.',
            },
            {
              t: '1–3 балла',
              d: 'Осознанность и профилактика: мудрый разум, действие на опережение, накопление позитивных эмоций — заметить раньше, чем станет тяжело.',
            },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl bg-cream p-5">
              <p className="font-display text-lg font-bold text-pine-deep">{x.t}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/75">{x.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-[13px] leading-relaxed text-mist">
          Поверх интенсивности работают фильтры: профиль регуляции (якорь на торможение — или на
          открытость), подтип эмоции с клиническими заметками, признак самоповреждающих мыслей
          (кризисные навыки первыми) и обязательные навыки-якоря осознанности. Матрица соответствия
          собрана по учебникам ДПТ и РО-ДПТ; список ограничен семью навыками и идёт строго по
          приоритету.
        </p>
      </div>

      {/* Источники */}
      <div className="mt-12 rounded-3xl border border-line bg-card p-6 shadow-card sm:p-8">
        <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold">
          <GraduationCap size={22} className="text-pine" /> Источники
        </h2>
        <ol className="mt-5 space-y-3">
          {REFERENCES.map((r, i) => (
            <li key={i} className="flex gap-3.5 rounded-2xl bg-cream px-4 py-3.5 text-[13px] leading-relaxed text-ink/80">
              <BookOpenText size={16} className="mt-0.5 shrink-0 text-gold" />
              {r}
            </li>
          ))}
        </ol>
      </div>

      {/* Дисклеймер */}
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-ember/50 bg-ember-soft p-6 sm:p-8">
          <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-ember">
            <TriangleAlert size={20} /> Важно
          </h2>
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink/80">
            Навигатор — инструмент самопомощи и дополнение к терапии, а не её замена. Он не ставит
            диагнозы и не подходит для лечения тяжёлых состояний. Если эмоции регулярно выходят из-под
            контроля, появляются мысли о причинении себе вреда — обратитесь к психотерапевту или
            психиатру. При непосредственной угрозе жизни звоните 112.
          </p>
        </div>
        <div className="flex flex-col rounded-3xl border border-line bg-card p-6 shadow-card sm:p-8">
          <h2 className="flex items-center gap-2.5 font-display text-xl font-bold">
            <HeartHandshake size={20} className="text-pine" /> Начать спокойно
          </h2>
          <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-ink/75">
            Лучший момент освоить навыки — когда вы в порядке. Пройдите профилирование, посмотрите
            библиотеку и попробуйте пару техник на лёгких эмоциях: в острый момент они сработают
            привычно.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5"
            >
              Открыть навигатор <ArrowRight size={15} />
            </Link>
            <Link
              href="/skills"
              className="rounded-full border border-line-strong px-5 py-3 text-sm font-bold text-ink/75 hover:border-ink/40"
            >
              Библиотека навыков
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
