import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Runs daily at 21:00 UTC (midnight Turkey time = UTC+3)
Deno.serve(async (_req) => {
  const today = new Date().toLocaleDateString('sv', { timeZone: 'Europe/Istanbul' });

  // Complete yesterday's active survey
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('sv', { timeZone: 'Europe/Istanbul' });

  const { error: completeError } = await supabase
    .from('surveys')
    .update({ status: 'completed' })
    .eq('status', 'active')
    .lt('scheduled_for', today);

  if (completeError) {
    console.error('Failed to complete surveys:', completeError);
  }

  // Activate today's scheduled survey
  const { data, error: activateError } = await supabase
    .from('surveys')
    .update({ status: 'active', published_at: new Date().toISOString() })
    .eq('status', 'scheduled')
    .eq('scheduled_for', today)
    .select('id, question');

  if (activateError) {
    console.error('Failed to activate survey:', activateError);
    return new Response(JSON.stringify({ error: activateError.message }), { status: 500 });
  }

  return new Response(
    JSON.stringify({ activated: data, date: today }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
