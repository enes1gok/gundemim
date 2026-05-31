import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../stores/userStore';

export function useVote() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { deviceId, saveVote } = useUserStore();

  const submitVote = async (surveyId: string, optionId: string): Promise<boolean> => {
    if (!deviceId) return false;
    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from('votes').insert({
      survey_id: surveyId,
      device_id: deviceId,
      option_id: optionId,
    });

    if (insertError) {
      // 23505 = unique_violation: already voted
      if (insertError.code !== '23505') {
        setError('Oy gönderilemedi. Lütfen tekrar deneyin.');
        setSubmitting(false);
        return false;
      }
    }

    await saveVote(surveyId, optionId);
    setSubmitting(false);
    return true;
  };

  return { submitVote, submitting, error };
}
