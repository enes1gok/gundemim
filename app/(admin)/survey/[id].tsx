import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../lib/supabase';
import { useResults } from '../../../hooks/useResults';
import { buildOptionResults } from '../../../lib/analytics';
import { Survey, SurveyStatus } from '../../../types/app';
import { OptionResult } from '../../../components/results/OptionResult';
import { Tag } from '../../../components/ui/Tag';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { darkColors, lightColors, ColorScheme } from '../../../theme/colors';

const STATUS_TRANSITIONS: Record<string, { next: SurveyStatus; label: string } | null> = {
  draft: { next: 'scheduled', label: 'Planla' },
  scheduled: { next: 'active', label: 'Yayınla' },
  active: { next: 'completed', label: 'Tamamla' },
  completed: null,
};

export default function AdminSurveyDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const qc = useQueryClient();

  const { data: survey } = useQuery<Survey>({
    queryKey: ['admin', 'survey', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Survey;
    },
  });

  const { data: results } = useResults(id ?? null);

  const transition = survey ? STATUS_TRANSITIONS[survey.status] : null;

  const handleStatusChange = async () => {
    if (!transition || !survey) return;
    Alert.alert(
      'Durum Değiştir',
      `Anketi "${transition.label}" olarak işaretle?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Evet',
          onPress: async () => {
            await supabase.from('surveys').update({ status: transition.next }).eq('id', survey.id);
            qc.invalidateQueries({ queryKey: ['admin', 'survey', id] });
            qc.invalidateQueries({ queryKey: ['admin', 'surveys'] });
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert('Sil', 'Bu anketi silmek istediğinizden emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('surveys').delete().eq('id', survey!.id);
          qc.invalidateQueries({ queryKey: ['admin', 'surveys'] });
          router.back();
        },
      },
    ]);
  };

  if (!survey) return null;

  const optionResults = results ? buildOptionResults(results, survey.options) : null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Typography variant="body" weight="semiBold">
          Anket Detayı
        </Typography>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Tag category={survey.category} />
          <Typography variant="caption" muted>
            {format(parseISO(survey.scheduled_for), 'd MMMM yyyy', { locale: tr })}
          </Typography>
        </View>

        <Typography variant="h2" weight="extraBold" style={{ marginBottom: 20 }}>
          {survey.question}
        </Typography>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <StatCard
            label="Toplam Oy"
            value={survey.total_votes.toLocaleString('tr-TR')}
            colors={colors}
          />
          <StatCard
            label="Durum"
            value={survey.status.toUpperCase()}
            colors={colors}
            accent={colors.accent}
          />
        </View>

        {/* Options results */}
        {optionResults && (
          <View style={{ gap: 10, marginBottom: 24 }}>
            <Typography variant="body" weight="bold" style={{ marginBottom: 4 }}>
              Sonuçlar
            </Typography>
            {optionResults
              .sort((a, b) => b.vote_count - a.vote_count)
              .map((opt, i) => (
                <OptionResult
                  key={opt.option_id}
                  optionId={opt.option_id}
                  text={opt.option_text}
                  percentage={opt.percentage}
                  voteCount={opt.vote_count}
                  isChosen={false}
                  isWinner={i === 0}
                  delay={i * 80}
                />
              ))}
          </View>
        )}

        {/* Status change */}
        {transition && (
          <Button label={transition.label} fullWidth onPress={handleStatusChange} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  label,
  value,
  colors,
  accent,
}: {
  label: string;
  value: string;
  colors: ColorScheme;
  accent?: string;
}) {
  return (
    <Card style={{ flex: 1, gap: 4 }}>
      <Typography variant="tiny" muted>
        {label}
      </Typography>
      <Typography variant="h3" weight="bold" style={{ color: accent ?? colors.text }}>
        {value}
      </Typography>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
});
