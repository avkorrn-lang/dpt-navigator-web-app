// Детерминированный алгоритм подбора навыков по клиническим правилам ДПТ:
// матрица (эмоция × профиль × подтип × интенсивность) + фильтры + якоря осознанности.

import { MATRIX, intensityToLevel, type IntensityLevel, type ProfileType } from './emotions';
import { getSkill } from './skills';

// Кризисные навыки, которые идут первыми при мыслях о самоповреждении
const CRISIS_SET = ['stop', 'tipp', 'accepts', 'self_soothe'];

// Базовые навыки осознанности — «якорь», который добавляется всегда
const MINDFULNESS_ANCHORS = ['wise_mind', 'observe', 'nonjudgmental'];

export interface Recommendation {
  skills: string[]; // до 7 ID в порядке приоритета
  level: IntensityLevel;
  note: string | null; // подсказка по подтипу эмоции
}

export function recommend(
  profile: ProfileType,
  emotionId: string,
  subtypeId: string | null,
  intensity: number,
  crisis: boolean,
): Recommendation {
  const level = intensityToLevel(intensity);
  const entry = MATRIX[emotionId];

  let ordered: string[] = [];
  if (entry) {
    const levelSkills = entry.skills[profile]?.[level];
    if (levelSkills) {
      let skillsForSubtype: string[] | undefined;
      if (subtypeId && levelSkills[subtypeId]) {
        skillsForSubtype = levelSkills[subtypeId];
      } else if (levelSkills['none']) {
        skillsForSubtype = levelSkills['none'];
      } else {
        // Fallback: берём первый доступный подтип
        const firstKey = Object.keys(levelSkills)[0];
        if (firstKey) {
          skillsForSubtype = levelSkills[firstKey];
        }
      }
      if (skillsForSubtype) {
        ordered = [...skillsForSubtype];
      }
    }
  }

  // Фильтр 3.3: самоповреждающие мысли — кризисные навыки первыми
  if (crisis) {
    ordered = [...CRISIS_SET, ...ordered];
  }

  // Фильтр 3.3: всегда добавлять якорь осознанности (в конец, как дополнительные)
  const hasAnchor = ordered.some((id) => MINDFULNESS_ANCHORS.includes(id));
  if (!hasAnchor) {
    if (profile === 'hypercontrol') {
      ordered.push('wise_mind');
    } else {
      ordered.push(level === 'low' ? 'wise_mind' : 'observe');
      ordered.push('nonjudgmental');
    }
  }

  // Убираем дубликаты и несуществующие ID, ограничиваем до 7
  const seen = new Set<string>();
  const skills = ordered.filter((id) => {
    if (seen.has(id) || !getSkill(id)) return false;
    seen.add(id);
    return true;
  }).slice(0, 7);

  const note =
    (subtypeId && entry?.subtype_notes?.[subtypeId] ? entry.subtype_notes[subtypeId] : null) ??
    null;

  return { skills, level, note };
}

export const PROFILE_LABELS: Record<ProfileType, string> = {
  impulsive: 'Импульсивный профиль',
  hypercontrol: 'Гиперконтроль',
};
