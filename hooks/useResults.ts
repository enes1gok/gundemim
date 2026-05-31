import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { SurveyResults } from '../types/app';

export function useResults(surveyId: string | null) {
  return useQuery<SurveyResults | null>({
    queryKey: ['results', surveyId],
    queryFn: async () => {
      if (!surveyId) return null;
      const { data, error } = await supabase.rpc('get_survey_results', {
        p_survey_id: surveyId,
      });
      if (error) throw error;
      return data as SurveyResults;
    },
    enabled: !!surveyId,
    staleTime: 1000 * 30,
  });
}
