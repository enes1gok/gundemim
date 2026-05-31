import { SurveyOption, SurveyResults, OptionResult, UserProfile } from '../types/app';

export function buildOptionResults(
  results: SurveyResults,
  options: SurveyOption[]
): OptionResult[] {
  return options.map((opt) => {
    const found = results.options?.find((o) => o.option_id === opt.id);
    return {
      option_id: opt.id,
      option_text: opt.text,
      vote_count: found?.vote_count ?? 0,
      percentage: found?.percentage ?? 0,
    };
  });
}

export function getDemographicBreakdown(
  dimension: 'by_age' | 'by_gender' | 'by_region' | 'by_education',
  results: SurveyResults,
  options: SurveyOption[]
): Array<{ label: string; bars: Array<{ optionId: string; label: string; pct: number }> }> {
  const raw = results[dimension] ?? {};
  const total = results.total_votes || 1;

  return Object.entries(raw).map(([dimLabel, optionCounts]) => {
    const dimTotal = Object.values(optionCounts).reduce((a, b) => a + b, 0) || 1;
    const bars = options.map((opt) => ({
      optionId: opt.id,
      label: opt.text,
      pct: Math.round(((optionCounts[opt.id] ?? 0) / dimTotal) * 100),
    }));
    return { label: dimLabel, bars };
  });
}

export function getSimilarMindsText(
  chosenOptionId: string,
  results: SurveyResults,
  profile: UserProfile | null,
  options: SurveyOption[]
): string | null {
  if (!profile?.age_range || !results.by_age) return null;

  const ageGroup = results.by_age[profile.age_range];
  if (!ageGroup) return null;

  const groupTotal = Object.values(ageGroup).reduce((a, b) => a + b, 0) || 1;
  const chosenCount = ageGroup[chosenOptionId] ?? 0;
  const pct = Math.round((chosenCount / groupTotal) * 100);

  const chosenOption = options.find((o) => o.id === chosenOptionId);
  if (!chosenOption) return null;

  const ageLabels: Record<string, string> = {
    '13-17': '13-17 yaş',
    '18-24': '18-24 yaş',
    '25-34': '25-34 yaş',
    '35-44': '35-44 yaş',
    '45-54': '45-54 yaş',
    '55-64': '55-64 yaş',
    '65+': '65+ yaş',
  };

  const ageLabel = ageLabels[profile.age_range] ?? profile.age_range;
  return `${ageLabel} grubunun %${pct}'i de aynı şekilde oy kullandı.`;
}
