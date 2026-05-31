import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';
import { useTodaySurvey } from '../../hooks/useTodaySurvey';
import { useResults } from '../../hooks/useResults';
import { useUserStore } from '../../stores/userStore';
import { buildOptionResults, getSimilarMindsText } from '../../lib/analytics';
import { OptionResult } from '../../components/results/OptionResult';
import { DemographicChart } from '../../components/results/DemographicChart';
import { SimilarMinds } from '../../components/results/SimilarMinds';
import { Tag } from '../../components/ui/Tag';
import { Typography } from '../../components/ui/Typography';
import { VoteCountBadge } from '../../components/survey/VoteCountBadge';
import { darkColors, lightColors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function ResultsScreen() {
  const { surveyId, chosenOptionId } = useLocalSearchParams<{
    surveyId: string;
    chosenOptionId: string;
  }>();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const { data: survey } = useTodaySurvey();
  const { data: results } = useResults(surveyId ?? null);
  const { profile } = useUserStore();

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  if (!survey || !results) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography variant="body" muted>Sonuçlar yükleniyor…</Typography>
        </MotiView>
      </SafeAreaView>
    );
  }

  const optionResults = buildOptionResults(results, survey.options);
  const winnerOptionId = optionResults.reduce((a, b) => (a.vote_count > b.vote_count ? a : b)).option_id;

  const similarMindsText = getSimilarMindsText(
    chosenOptionId,
    results,
    profile,
    survey.options
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 300 }}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => router.replace('/(main)')}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Typography variant="body" weight="semiBold">
          Sonuçlar
        </Typography>
        <View style={{ width: 40 }} />
      </MotiView>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Survey meta */}
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 100 }}
          style={{ gap: 10, marginBottom: 20 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Tag category={survey.category} />
            <VoteCountBadge count={results.total_votes} />
          </View>
          <Typography variant="h2" weight="extraBold" style={{ lineHeight: 36 }}>
            {survey.question}
          </Typography>
        </MotiView>

        {/* Option results */}
        <View style={{ gap: 10, marginBottom: 28 }}>
          {optionResults
            .sort((a, b) => b.vote_count - a.vote_count)
            .map((opt, index) => (
              <OptionResult
                key={opt.option_id}
                optionId={opt.option_id}
                text={opt.option_text}
                percentage={opt.percentage}
                voteCount={opt.vote_count}
                isChosen={opt.option_id === chosenOptionId}
                isWinner={opt.option_id === winnerOptionId}
                delay={index * 100}
              />
            ))}
        </View>

        {/* Similar minds */}
        {similarMindsText && (
          <View style={{ marginBottom: 28 }}>
            <SimilarMinds text={similarMindsText} delay={600} />
          </View>
        )}

        {/* Demographic chart */}
        {results.total_votes >= 5 && (
          <View style={{ marginBottom: 40 }}>
            <DemographicChart
              results={results}
              options={survey.options}
              chosenOptionId={chosenOptionId}
              baseDelay={800}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
});
