import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useTodaySurvey } from '../../hooks/useTodaySurvey';
import { useVote } from '../../hooks/useVote';
import { useUserStore } from '../../stores/userStore';
import { Tag } from '../../components/ui/Tag';
import { Typography } from '../../components/ui/Typography';
import { OptionButton } from '../../components/survey/OptionButton';
import { VoteCountBadge } from '../../components/survey/VoteCountBadge';
import { MotiView } from 'moti';
import { darkColors, lightColors, ColorScheme } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function TodayScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const { data: survey, isLoading, refetch, isRefetching } = useTodaySurvey();
  const { submitVote, submitting } = useVote();
  const { getVotedOptionId } = useUserStore();

  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);
  const [votingOptionId, setVotingOptionId] = useState<string | null>(null);

  useEffect(() => {
    if (survey) {
      getVotedOptionId(survey.id).then(setVotedOptionId);
    }
  }, [survey]);

  // If already voted, go directly to results
  useEffect(() => {
    if (survey && votedOptionId) {
      router.replace({ pathname: '/(main)/results', params: { surveyId: survey.id, chosenOptionId: votedOptionId } });
    }
  }, [survey, votedOptionId]);

  const handleVote = async (optionId: string) => {
    if (!survey || submitting) return;
    setVotingOptionId(optionId);
    const success = await submitVote(survey.id, optionId);
    if (success) {
      router.replace({
        pathname: '/(main)/results',
        params: { surveyId: survey.id, chosenOptionId: optionId },
      });
    }
    setVotingOptionId(null);
  };

  const todayStr = format(new Date(), 'd MMMM yyyy, EEEE', { locale: tr });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Typography variant="h2" weight="extraBold" style={{ color: colors.text }}>
            Gündemim
          </Typography>
          <Typography variant="caption" muted style={{ textTransform: 'capitalize' }}>
            {todayStr}
          </Typography>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <LoadingState colors={colors} />
        ) : !survey ? (
          <EmptyState colors={colors} />
        ) : (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          >
            {/* Category & date */}
            <View style={styles.metaRow}>
              <Tag category={survey.category} />
              <VoteCountBadge count={survey.total_votes} />
            </View>

            {/* Question */}
            <Typography
              variant="h1"
              weight="extraBold"
              style={{ color: colors.text, marginBottom: 28 }}
            >
              {survey.question}
            </Typography>

            {/* Options */}
            <View style={styles.options}>
              {survey.options.map((option, index) => (
                <MotiView
                  key={option.id}
                  from={{ opacity: 0, translateY: 16 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 18, delay: index * 80 }}
                >
                  <OptionButton
                    option={option}
                    onPress={handleVote}
                    disabled={submitting}
                    dimmed={submitting && votingOptionId !== option.id}
                  />
                </MotiView>
              ))}
            </View>

            {survey.description && (
              <Typography variant="caption" muted style={{ marginTop: 16, lineHeight: 20 }}>
                {survey.description}
              </Typography>
            )}

            <View style={styles.privacyNote}>
              <Ionicons name="lock-closed-outline" size={12} color={colors.textFaint} />
              <Typography variant="tiny" style={{ color: colors.textFaint }}>
                Oy gizlidir · Kişisel veri toplanmaz · Anonim
              </Typography>
            </View>
          </MotiView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function LoadingState({ colors }: { colors: ColorScheme }) {
  return (
    <View style={{ gap: 16, paddingTop: 8 }}>
      {[100, 80, 60].map((w, i) => (
        <MotiView
          key={i}
          from={{ opacity: 0.3 }}
          animate={{ opacity: 0.7 }}
          transition={{ loop: true, type: 'timing', duration: 800, delay: i * 150 }}
          style={{
            height: i === 0 ? 80 : 52,
            borderRadius: 12,
            backgroundColor: colors.surfaceAlt,
            width: `${w}%`,
          }}
        />
      ))}
    </View>
  );
}

function EmptyState({ colors }: { colors: ColorScheme }) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 60, gap: 12 }}>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: colors.surfaceAlt,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="mail-unread-outline" size={32} color={colors.textMuted} />
      </View>
      <Typography variant="h3" weight="bold" center>
        Bugün anket yok
      </Typography>
      <Typography variant="body" muted center style={{ maxWidth: 260 }}>
        Yarın yeni bir anket yayınlanacak. Bildirimleri açık tutmayı unutmayın.
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  options: { gap: 12 },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 20,
    justifyContent: 'center',
  },
});
