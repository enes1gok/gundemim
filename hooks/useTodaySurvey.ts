import { useQuery } from '@tanstack/react-query';
import { supabase, getTurkeyDateString } from '../lib/supabase';
import { Survey } from '../types/app';

export function useTodaySurvey() {
  return useQuery<Survey | null>({
    queryKey: ['survey', 'today'],
    queryFn: async () => {
      const today = getTurkeyDateString();
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('scheduled_for', today)
        .in('status', ['active', 'completed'])
        .maybeSingle();

      if (error) throw error;
      return data as Survey | null;
    },
    staleTime: 1000 * 60 * 5,
  });
}
