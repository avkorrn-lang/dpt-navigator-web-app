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
  color: string;
  soft: string;
  icon: LucideIcon;
}

export interface EmotionMatrixEntry {
  skills: Record<ProfileType, Record<IntensityLevel, Record<string, string[]>>>;
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
        low: {
          none: ['check_facts', 'opposite_action', 'problem_solving', 'validate', 'dear_man', 'wise_mind', 'effectively', 'participate'],
          irritation: ['check_facts', 'problem_solving', 'opposite_action', 'validate', 'wise_mind', 'effectively'],
          rage: ['stop', 'tipp', 'check_facts', 'opposite_action', 'radical_acceptance'],
          indignation: ['check_facts', 'opposite_action', 'problem_solving', 'radical_acceptance', 'validate'],
        },
        medium: {
          none: ['stop', 'opposite_action', 'check_facts', 'problem_solving', 'accumulate_positive', 'pros_cons'],
          irritation: ['check_facts', 'opposite_action', 'problem_solving', 'accumulate_positive', 'pros_cons'],
          rage: ['stop', 'tipp', 'opposite_action', 'radical_acceptance', 'self_soothe'],
          indignation: ['stop', 'check_facts', 'opposite_action', 'radical_acceptance', 'problem_solving'],
        },
        high: {
          none: ['stop', 'tipp', 'accepts', 'self_soothe', 'check_facts', 'radical_acceptance'],
          irritation: ['stop', 'tipp', 'accepts', 'self_soothe', 'check_facts', 'radical_acceptance'],
          rage: ['stop', 'tipp', 'accepts', 'self_soothe', 'check_facts', 'radical_acceptance'],
          indignation: ['stop', 'tipp', 'accepts', 'self_soothe', 'check_facts', 'radical_acceptance'],
        },
      },
      hypercontrol: {
        low: {
          irritation: ['radical_openness', 'self_enquiry', 'check_facts', 'validate', 'validates', 'give', 'effectively'],
          rage: ['radical_openness', 'self_enquiry', 'radical_acceptance', 'validate', 'validates', 'effective_humility'],
          indignation: ['check_facts', 'radical_openness', 'self_enquiry', 'validate', 'validates', 'give', 'effectively'],
        },
        medium: {
          irritation: ['radical_openness', 'self_enquiry', 'check_facts', 'problem_solving', 'validate'],
          rage: ['radical_openness', 'self_enquiry', 'problem_solving', 'radical_acceptance', 'adopts'],
          indignation: ['check_facts', 'radical_openness', 'self_enquiry', 'problem_solving', 'validate'],
        },
        high: {
          irritation: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'check_facts', 'big_three_plus_1'],
          rage: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'check_facts', 'big_three_plus_1'],
          indignation: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'check_facts', 'big_three_plus_1'],
        },
      },
    },
    subtype_notes: {
      irritation: 'Для импульсивного профиля — акцент на проверку фактов и решение проблем; для гиперконтроля — выражение раздражения через радикальную открытость.',
      rage: 'Для импульсивного профиля — STOP и TIPP в первую очередь; для гиперконтроля — «большая тройка» и REVEALS для безопасного выражения.',
      indignation: 'Схоже с гневом, но может включать моральное осуждение — важны проверка фактов и радикальное принятие различий.',
    },
  },
  fear_anxiety: {
    skills: {
      impulsive: {
        low: {
          none: ['opposite_action', 'check_facts', 'cope_ahead', 'observe', 'describe', 'wise_mind', 'effectively'],
          worry: ['check_facts', 'opposite_action', 'cope_ahead', 'observe', 'describe', 'wise_mind'],
          panic: ['stop', 'tipp', 'opposite_action', 'radical_acceptance', 'self_soothe'],
          dread: ['radical_acceptance', 'opposite_action', 'check_facts', 'self_soothe', 'wise_mind'],
        },
        medium: {
          none: ['opposite_action', 'check_facts', 'cope_ahead', 'accumulate_positive', 'radical_acceptance', 'one_mindfully'],
          worry: ['opposite_action', 'check_facts', 'cope_ahead', 'accumulate_positive', 'radical_acceptance'],
          panic: ['stop', 'tipp', 'opposite_action', 'radical_acceptance', 'self_soothe'],
          dread: ['radical_acceptance', 'opposite_action', 'problem_solving', 'self_soothe', 'check_facts'],
        },
        high: {
          none: ['stop', 'tipp', 'accepts', 'self_soothe', 'check_facts', 'radical_acceptance'],
          worry: ['stop', 'tipp', 'accepts', 'self_soothe', 'check_facts', 'radical_acceptance'],
          panic: ['stop', 'tipp', 'accepts', 'self_soothe', 'check_facts', 'radical_acceptance'],
          dread: ['stop', 'tipp', 'accepts', 'self_soothe', 'check_facts', 'radical_acceptance'],
        },
      },
      hypercontrol: {
        low: {
          worry: ['radical_openness', 'self_enquiry', 'check_facts', 'opposite_action', 'def', 'nonjudgmental', 'validate', 'validates', 'participate_without_planning'],
          panic: ['radical_openness', 'self_enquiry', 'radical_acceptance', 'self_soothe', 'willingness', 'validate', 'validates', 'participate_without_planning'],
          dread: ['radical_acceptance', 'self_enquiry', 'opposite_action', 'check_facts', 'validate', 'validates', 'participate_without_planning'],
        },
        medium: {
          worry: ['opposite_action', 'problem_solving', 'radical_openness', 'self_enquiry', 'varies', 'improve', 'participate_without_planning'],
          panic: ['radical_openness', 'self_enquiry', 'radical_acceptance', 'self_soothe', 'improve', 'participate_without_planning'],
          dread: ['radical_acceptance', 'opposite_action', 'problem_solving', 'validate', 'self_soothe', 'participate_without_planning'],
        },
        high: {
          worry: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'check_facts', 'varies'],
          panic: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'check_facts', 'big_three_plus_1'],
          dread: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'check_facts', 'big_three_plus_1'],
        },
      },
    },
    subtype_notes: {
      worry: 'Для гиперконтроля — практика «осознанности без планирования»; для импульсивного профиля — противоположное действие (сделать что-то вместо переживаний).',
      panic: 'Для обоих профилей — TIPP (особенно дыхание и холод) и STOP. Для гиперконтроля — «большая тройка» для заземления.',
      dread: 'Акцент на радикальное принятие неизбежного и противоположное действие (подход к пугающему).',
    },
  },
  sadness: {
    skills: {
      impulsive: {
        low: {
          none: ['opposite_action', 'accumulate_positive', 'check_facts', 'problem_solving', 'build_mastery', 'wise_mind', 'effectively'],
          melancholy: ['opposite_action', 'accumulate_positive', 'check_facts', 'wise_mind', 'effectively'],
          hopelessness: ['check_facts', 'accumulate_positive', 'problem_solving', 'wise_mind', 'effectively'],
          grief: ['radical_acceptance', 'opposite_action', 'accumulate_positive', 'wise_mind', 'effectively'],
        },
        medium: {
          none: ['opposite_action', 'accumulate_positive', 'cope_ahead', 'radical_acceptance', 'please'],
          melancholy: ['opposite_action', 'accumulate_positive', 'cope_ahead', 'radical_acceptance'],
          hopelessness: ['accumulate_positive', 'check_facts', 'problem_solving', 'radical_acceptance'],
          grief: ['radical_acceptance', 'opposite_action', 'accumulate_positive', 'cope_ahead'],
        },
        high: {
          none: ['stop', 'tipp', 'accepts', 'self_soothe', 'radical_acceptance'],
          melancholy: ['stop', 'tipp', 'accepts', 'self_soothe', 'radical_acceptance'],
          hopelessness: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'accumulate_positive'],
          grief: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'heart'],
        },
      },
      hypercontrol: {
        low: {
          melancholy: ['opposite_action', 'radical_openness', 'self_enquiry', 'validate', 'validates', 'heart', 'effectively'],
          hopelessness: ['check_facts', 'accumulate_positive', 'validate', 'validates', 'self_enquiry', 'build_mastery', 'effectively'],
          grief: ['radical_acceptance', 'opposite_action', 'self_enquiry', 'validate', 'validates', 'willingness', 'effectively'],
        },
        medium: {
          melancholy: ['heart', 'light', 'opposite_action', 'radical_acceptance', 'rocks_on'],
          hopelessness: ['accumulate_positive', 'radical_acceptance', 'check_facts', 'validate', 'improve'],
          grief: ['radical_acceptance', 'opposite_action', 'heart', 'light', 'match_plus_1'],
        },
        high: {
          melancholy: ['stop', 'tipp', 'self_soothe', 'radical_acceptance', 'allows'],
          hopelessness: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'accumulate_positive'],
          grief: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'heart'],
        },
      },
    },
    subtype_notes: {
      melancholy: 'Для гиперконтроля — разрешить себе плакать и выражать эмоции; для импульсивного профиля — противоположное действие (активность).',
      hopelessness: 'Добавьте накопление позитивных эмоций и проверку фактов: есть ли реальные основания для безнадежности?',
      grief: 'Радикальное принятие утраты и противоположное действие (социальная связь) — важны для обоих профилей.',
    },
  },
  shame: {
    skills: {
      impulsive: {
        low: {
          none: ['validate', 'check_facts', 'opposite_action', 'fast', 'wise_mind', 'effectively'],
          humiliation: ['validate', 'check_facts', 'opposite_action', 'fast', 'wise_mind'],
          embarrassment: ['opposite_action', 'validate', 'check_facts', 'fast', 'observe', 'wise_mind'],
        },
        medium: {
          none: ['opposite_action', 'radical_acceptance', 'accumulate_positive', 'nonjudgmental', 'pros_cons', 'wise_mind'],
          humiliation: ['opposite_action', 'radical_acceptance', 'accumulate_positive', 'nonjudgmental', 'pros_cons', 'wise_mind'],
          embarrassment: ['opposite_action', 'radical_acceptance', 'accumulate_positive', 'heart', 'wise_mind'],
        },
        high: {
          none: ['stop', 'tipp', 'accepts', 'radical_acceptance', 'self_soothe', 'wise_mind'],
          humiliation: ['stop', 'tipp', 'accepts', 'radical_acceptance', 'self_soothe', 'wise_mind'],
          embarrassment: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'wise_mind'],
        },
      },
      hypercontrol: {
        low: {
          humiliation: ['sage', 'radical_openness', 'opposite_action', 'validate', 'validates', 'fast', 'effectively', 'wise_mind'],
          embarrassment: ['opposite_action', 'validate', 'validates', 'check_facts', 'fast', 'observe', 'effectively', 'wise_mind'],
        },
        medium: {
          humiliation: ['heart', 'radical_acceptance', 'opposite_action', 'sage', 'wise_mind'],
          embarrassment: ['opposite_action', 'radical_acceptance', 'accumulate_positive', 'heart', 'wise_mind'],
        },
        high: {
          humiliation: ['stop', 'tipp', 'self_soothe', 'radical_acceptance', 'deep', 'wise_mind'],
          embarrassment: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'wise_mind'],
        },
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
        low: {
          none: ['problem_solving', 'check_facts', 'opposite_action', 'validate', 'dime_game', 'wise_mind', 'effectively'],
          remorse: ['problem_solving', 'check_facts', 'opposite_action', 'validate', 'dime_game', 'wise_mind'],
          regret: ['radical_acceptance', 'check_facts', 'opposite_action', 'problem_solving', 'validate'],
        },
        medium: {
          none: ['opposite_action', 'radical_acceptance', 'accumulate_positive', 'give', 'cope_ahead'],
          remorse: ['opposite_action', 'radical_acceptance', 'accumulate_positive', 'give', 'cope_ahead'],
          regret: ['radical_acceptance', 'opposite_action', 'heart', 'reveals'],
        },
        high: {
          none: ['stop', 'tipp', 'accepts', 'radical_acceptance', 'self_soothe'],
          remorse: ['stop', 'tipp', 'accepts', 'radical_acceptance', 'self_soothe'],
          regret: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'heart'],
        },
      },
      hypercontrol: {
        low: {
          remorse: ['prove', 'radical_openness', 'check_facts', 'problem_solving', 'opposite_action', 'validate', 'validates', 'effectively'],
          regret: ['radical_acceptance', 'check_facts', 'opposite_action', 'problem_solving', 'validate', 'validates', 'effectively'],
        },
        medium: {
          remorse: ['heart', 'radical_acceptance', 'opposite_action', 'reveals'],
          regret: ['radical_acceptance', 'opposite_action', 'heart', 'reveals'],
        },
        high: {
          remorse: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'heart'],
          regret: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'heart'],
        },
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
        low: {
          none: ['opposite_action', 'check_facts', 'problem_solving', 'wise_mind', 'describe', 'effectively'],
          envy: ['opposite_action', 'check_facts', 'problem_solving', 'wise_mind', 'describe'],
          jealousy: ['check_facts', 'opposite_action', 'problem_solving', 'wise_mind', 'validate'],
          resentment: ['check_facts', 'opposite_action', 'problem_solving', 'validate', 'light', 'wise_mind'],
        },
        medium: {
          none: ['opposite_action', 'radical_acceptance', 'accumulate_positive', 'dear_man', 'cope_ahead', 'wise_mind'],
          envy: ['opposite_action', 'radical_acceptance', 'accumulate_positive', 'dear_man', 'cope_ahead', 'wise_mind'],
          jealousy: ['check_facts', 'opposite_action', 'radical_acceptance', 'accumulate_positive', 'wise_mind'],
          resentment: ['light', 'opposite_action', 'radical_acceptance', 'heart', 'wise_mind'],
        },
        high: {
          none: ['stop', 'tipp', 'accepts', 'radical_acceptance', 'self_soothe', 'wise_mind'],
          envy: ['stop', 'tipp', 'accepts', 'radical_acceptance', 'self_soothe', 'wise_mind'],
          jealousy: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'loving_kindness', 'wise_mind'],
          resentment: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'loving_kindness', 'wise_mind'],
        },
      },
      hypercontrol: {
        low: {
          envy: ['dares', 'radical_openness', 'opposite_action', 'validate', 'validates', 'check_facts', 'effectively', 'wise_mind'],
          jealousy: ['check_facts', 'opposite_action', 'dares', 'radical_openness', 'validate', 'validates', 'effectively', 'wise_mind'],
          resentment: ['light', 'radical_openness', 'self_enquiry', 'validate', 'validates', 'effectively', 'wise_mind'],
        },
        medium: {
          envy: ['light', 'opposite_action', 'radical_acceptance', 'heart', 'wise_mind'],
          jealousy: ['check_facts', 'opposite_action', 'radical_acceptance', 'light', 'wise_mind'],
          resentment: ['light', 'opposite_action', 'radical_acceptance', 'heart', 'wise_mind'],
        },
        high: {
          envy: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'loving_kindness', 'wise_mind'],
          jealousy: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'loving_kindness', 'wise_mind'],
          resentment: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'loving_kindness', 'wise_mind'],
        },
      },
    },
    subtype_notes: {
      envy: 'Для гиперконтроля — специальный навык DARES; для импульсивного профиля — противоположное действие (порадоваться за другого).',
      jealousy: 'Проверка фактов и радикальное принятие неопределённости.',
      resentment: 'Работа с горечью (LIGHT) и прощение (HEART) — для обоих профилей.',
    },
  },
  disgust_contempt: {
    skills: {
      impulsive: {
        low: {
          none: ['opposite_action', 'check_facts', 'dear_man', 'wise_mind', 'participate', 'effectively'],
          disgust: ['opposite_action', 'check_facts', 'dear_man', 'wise_mind', 'participate'],
          contempt: ['opposite_action', 'check_facts', 'dear_man', 'wise_mind', 'effectively'],
        },
        medium: {
          none: ['opposite_action', 'radical_acceptance', 'problem_solving', 'pros_cons'],
          disgust: ['opposite_action', 'radical_acceptance', 'problem_solving', 'pros_cons'],
          contempt: ['opposite_action', 'radical_acceptance', 'problem_solving', 'check_facts'],
        },
        high: {
          none: ['stop', 'tipp', 'accepts', 'radical_acceptance'],
          disgust: ['stop', 'tipp', 'accepts', 'radical_acceptance'],
          contempt: ['stop', 'tipp', 'accepts', 'radical_acceptance'],
        },
      },
      hypercontrol: {
        low: {
          disgust: ['opposite_action', 'check_facts', 'radical_openness', 'validate', 'validates', 'effectively'],
          contempt: ['opposite_action', 'check_facts', 'radical_openness', 'validate', 'validates', 'effectively'],
        },
        medium: {
          disgust: ['radical_openness', 'self_enquiry', 'opposite_action', 'radical_acceptance'],
          contempt: ['check_facts', 'opposite_action', 'radical_acceptance', 'radical_openness'],
        },
        high: {
          disgust: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'big_three_plus_1'],
          contempt: ['stop', 'tipp', 'radical_acceptance', 'self_soothe', 'big_three_plus_1'],
        },
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
