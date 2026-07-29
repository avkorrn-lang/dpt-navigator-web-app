// Расширенная матрица «эмоция × профиль × интенсивность» для ДПТ-навигатора.
// ID навыков приведены к официальному справочнику (src/lib/skills.ts):
//   validate_self / validate_other    -> validate (навык валидации себя и другого)
//   social_connection                 -> loving_kindness (восстановление связи)
//   interpersonal_effectiveness       -> dear_man (межличностная эффективность)

import type { LucideIcon } from 'lucide-react';
import {
  Flame,
  Zap,
  CloudRain,
  EyeOff,
  Scale,
  Eye,
  CircleSlash,
} from 'lucide-react';

export type ProfileType = 'impulsive' | 'hypercontrol';
export type IntensityLevel = 'low' | 'medium' | 'high';

export interface EmotionMeta {
  id: string;
  label: string;
  subtypes: { id: string; label: string }[];
  color: string; // основной оттенок
  soft: string; // светлый фон
  icon: LucideIcon;
}

export interface EmotionMatrixEntry {
  skills: Record<ProfileType, Record<IntensityLevel, string[]>>;
  subtype_notes: Record<string, string>;
}

export const EMOTIONS: EmotionMeta[] = [
  {
    id: 'anger',
    label: 'Гнев',
    color: '#C85438',
    soft: '#FAECE7',
    icon: Flame,
    subtypes: [
      { id: 'irritation', label: 'Раздражение' },
      { id: 'rage', label: 'Ярость' },
      { id: 'indignation', label: 'Негодование' },
    ],
  },
  {
    id: 'fear_anxiety',
    label: 'Страх / Тревога',
    color: '#6B63BF',
    soft: '#EEEDF9',
    icon: Zap,
    subtypes: [
      { id: 'worry', label: 'Беспокойство' },
      { id: 'panic', label: 'Паника' },
      { id: 'dread', label: 'Ужас' },
    ],
  },
  {
    id: 'sadness',
    label: 'Грусть / Печаль',
    color: '#4F7DB8',
    soft: '#EAF1F9',
    icon: CloudRain,
    subtypes: [
      { id: 'melancholy', label: 'Тоска' },
      { id: 'hopelessness', label: 'Безнадежность' },
      { id: 'grief', label: 'Утрата' },
    ],
  },
  {
    id: 'shame',
    label: 'Стыд',
    color: '#A85E83',
    soft: '#F7ECF2',
    icon: EyeOff,
    subtypes: [
      { id: 'humiliation', label: 'Унижение' },
      { id: 'embarrassment', label: 'Смущение' },
    ],
  },
  {
    id: 'guilt',
    label: 'Вина',
    color: '#8F7A3F',
    soft: '#F5F0E2',
    icon: Scale,
    subtypes: [
      { id: 'remorse', label: 'Угрызения совести' },
      { id: 'regret', label: 'Сожаление' },
    ],
  },
  {
    id: 'envy_jealousy',
    label: 'Зависть / Ревность',
    color: '#4E8A63',
    soft: '#EAF3EC',
    icon: Eye,
    subtypes: [
      { id: 'envy', label: 'Зависть (к чужим благам)' },
      { id: 'jealousy', label: 'Ревность (страх потери)' },
      { id: 'resentment', label: 'Обида' },
    ],
  },
  {
    id: 'disgust_contempt',
    label: 'Отвращение / Презрение',
    color: '#6C7A50',
    soft: '#F0F2E7',
    icon: CircleSlash,
    subtypes: [
      { id: 'disgust', label: 'Отвращение' },
      { id: 'contempt', label: 'Презрение' },
    ],
  },
];

export const EMOTION_MAP: Record<string, EmotionMeta> = Object.fromEntries(
  EMOTIONS.map((e) => [e.id, e]),
);

export const MATRIX: Record<string, EmotionMatrixEntry> = {
  anger: {
    skills: {
      impulsive: {
        // изменён порядок: противоположное действие первым
        low: ['opposite_action', 'check_facts', 'problem_solving', 'validate', 'dear_man'],
        medium: ['stop', 'opposite_action', 'tipp', 'check_facts', 'radical_acceptance'],
        high: ['stop', 'tipp', 'accepts', 'self_soothe', 'radical_acceptance'],
      },
      hypercontrol: {
        // низкая: противоположное действие первым
        low: ['opposite_action', 'radical_openness', 'self_enquiry', 'check_facts', 'give'],
        // средняя: осознанность без планирования первым
        medium: ['participate_without_planning', 'sage', 'opposite_action', 'problem_solving', 'validate'],
        // высокая: STOP первым
        high: ['stop', 'big_three_plus_1', 'reveals', 'tipp', 'radical_acceptance'],
      },
    },
    subtype_notes: {
      irritation:
        'Для импульсивного профиля — акцент на проверку фактов и решение проблем; для гиперконтроля — выражение раздражения через радикальную открытость.',
      rage:
        'Для импульсивного профиля — STOP и TIPP в первую очередь; для гиперконтроля — «большая тройка» и REVEALS для безопасного выражения.',
      indignation:
        'Схоже с гневом, но может включать моральное осуждение — важны проверка фактов и радикальное принятие различий.',
    },
  },
  fear_anxiety: {
    skills: {
      impulsive: {
        // низкая: противоположное действие первым
        low: ['opposite_action', 'check_facts', 'cope_ahead', 'observe'],
        medium: ['opposite_action', 'tipp', 'cope_ahead', 'accepts', 'radical_acceptance'],
        high: ['stop', 'tipp', 'accepts', 'self_soothe', 'radical_acceptance'],
      },
      hypercontrol: {
        // низкая: осознанность без планирования первым
        low: ['participate_without_planning', 'radical_openness', 'check_facts', 'opposite_action', 'loving_kindness'],
        // средняя: большая тройка +1 первым
        medium: ['big_three_plus_1', 'adopts', 'opposite_action', 'problem_solving', 'validate'],
        // высокая: STOP первым
        high: ['stop', 'varies', 'loving_kindness', 'tipp', 'radical_acceptance'],
      },
    },
    subtype_notes: {
      worry:
        'Для гиперконтроля — практика «осознанности без планирования»; для импульсивного профиля — противоположное действие (сделать что-то вместо переживаний).',
      panic:
        'Для обоих профилей — TIPP (особенно дыхание и холод) и STOP. Для гиперконтроля — «большая тройка» для заземления.',
      dread: 'Акцент на радикальное принятие неизбежного и противоположное действие (подход к пугающему).',
    },
  },
  sadness: {
    skills: {
      impulsive: {
        low: ['opposite_action', 'accumulate_positive', 'check_facts', 'problem_solving'],
        medium: ['opposite_action', 'accumulate_positive', 'cope_ahead', 'radical_acceptance'],
        high: ['stop', 'tipp', 'accepts', 'self_soothe', 'radical_acceptance'],
      },
      hypercontrol: {
        // низкая: противоположное действие первым
        low: ['opposite_action', 'radical_openness', 'self_enquiry', 'validate'],
        // средняя: HEART первым
        medium: ['heart', 'light', 'opposite_action', 'radical_acceptance'],
        // высокая: противоположное действие первым
        high: ['opposite_action', 'allows', 'loving_kindness', 'radical_acceptance'],
      },
    },
    subtype_notes: {
      melancholy:
        'Для гиперконтроля — разрешить себе плакать и выражать эмоции; для импульсивного профиля — противоположное действие (активность).',
      hopelessness:
        'Добавьте накопление позитивных эмоций и проверку фактов: есть ли реальные основания для безнадежности?',
      grief: 'Радикальное принятие утраты и противоположное действие (социальная связь) — важны для обоих профилей.',
    },
  },
  shame: {
    skills: {
      impulsive: {
        // низкая: валидация первым
        low: ['validate', 'check_facts', 'opposite_action', 'fast'],
        medium: ['opposite_action', 'radical_acceptance', 'accumulate_positive', 'nonjudgmental'],
        high: ['stop', 'tipp', 'accepts', 'radical_acceptance', 'self_soothe'],
      },
      hypercontrol: {
        // низкая: SAGE первым
        low: ['sage', 'radical_openness', 'opposite_action', 'validate'],
        // средняя: медитация любящей доброты первым
        medium: ['loving_kindness', 'rocks_on', 'radical_acceptance', 'opposite_action'],
        // высокая: радикальное принятие первым
        high: ['radical_acceptance', 'deep', 'big_three_plus_1', 'loving_kindness'],
      },
    },
    subtype_notes: {
      humiliation: 'Для гиперконтроля особенно важны радикальное принятие и прощение себя (HEART).',
      embarrassment: 'Противоположное действие — поделиться переживанием с доверенным человеком.',
    },
  },
  guilt: {
    skills: {
      impulsive: {
        // низкая: решение проблем первым
        low: ['problem_solving', 'check_facts', 'opposite_action', 'validate'],
        medium: ['opposite_action', 'radical_acceptance', 'accumulate_positive', 'give'],
        high: ['stop', 'tipp', 'accepts', 'radical_acceptance', 'self_soothe'],
      },
      hypercontrol: {
        // низкая: PROVE первым
        low: ['prove', 'radical_openness', 'check_facts', 'problem_solving'],
        medium: ['heart', 'reveals', 'radical_acceptance', 'opposite_action'],
        // высокая: медитация любящей доброты первым
        high: ['loving_kindness', 'dares', 'radical_acceptance'],
      },
    },
    subtype_notes: {
      remorse: 'Сосредоточьтесь на решении проблем (исправить ошибку) и противоположном действии (извиниться).',
      regret: 'Радикальное принятие прошлого и противоположное действие (действия в настоящем).',
    },
  },
  envy_jealousy: {
    skills: {
      impulsive: {
        // низкая: противоположное действие первым
        low: ['opposite_action', 'check_facts', 'problem_solving', 'wise_mind'],
        medium: ['opposite_action', 'radical_acceptance', 'accumulate_positive', 'dear_man'],
        high: ['stop', 'tipp', 'accepts', 'radical_acceptance', 'self_soothe'],
      },
      hypercontrol: {
        low: ['dares', 'radical_openness', 'opposite_action', 'validate'], // без изменений
        // средняя: LIGHT первым
        medium: ['light', 'rocks_on', 'opposite_action', 'radical_acceptance'],
        // высокая: STOP первым
        high: ['stop', 'match_plus_1', 'loving_kindness', 'radical_acceptance'],
      },
    },
    subtype_notes: {
      envy:
        'Для гиперконтроля — специальный навык DARES; для импульсивного профиля — противоположное действие (порадоваться за другого).',
      jealousy: 'Проверка фактов и радикальное принятие неопределённости.',
      resentment: 'Работа с горечью (LIGHT) и прощение (HEART) — для обоих профилей.',
    },
  },
  disgust_contempt: {
    skills: {
      impulsive: {
        // низкая: противоположное действие первым
        low: ['opposite_action', 'check_facts', 'dear_man'],
        medium: ['opposite_action', 'radical_acceptance', 'problem_solving'],
        high: ['stop', 'tipp', 'accepts', 'radical_acceptance'],
      },
      hypercontrol: {
        // низкая: противоположное действие первым
        low: ['opposite_action', 'radical_openness', 'adopts', 'validate'],
        medium: ['allows', 'participate_without_planning', 'opposite_action', 'radical_acceptance'],
        high: ['rocks_on', 'big_three_plus_1', 'stop', 'radical_acceptance'],
      },
    },
    subtype_notes: {
      disgust: 'Для гиперконтроля — принятие инаковости через ALLOWs.',
      contempt: 'Противоположное действие — поиск положительных качеств в объекте презрения.',
    },
  },
};

export function intensityToLevel(intensity: number): IntensityLevel {
  if (intensity >= 8) return 'high';
  if (intensity >= 4) return 'medium';
  return 'low';
}

export const LEVEL_INFO: Record<
  IntensityLevel,
  { label: string; range: string; focus: string; color: string }
> = {
  low: {
    label: 'Низкая интенсивность',
    range: '1–3',
    focus: 'Осознанность и профилактика: мягкие навыки внимания и подготовки.',
    color: '#2E7D6B',
  },
  medium: {
    label: 'Средняя интенсивность',
    range: '4–7',
    focus: 'Регуляция эмоций: проверка фактов, противоположное действие, решение проблем.',
    color: '#B07E28',
  },
  high: {
    label: 'Высокая интенсивность',
    range: '8–10',
    focus: 'Кризисные навыки стрессоустойчивости: сначала пережить волну без деструктивных действий.',
    color: '#C2502C',
  },
};
