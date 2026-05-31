import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { supabase, getTurkeyDateString } from '../../lib/supabase';
import { Survey } from '../../types/app';
import { Tag } from '../../components/ui/Tag';
import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { darkColors, lightColors } from '../../theme/colors';
import { MotiView } from 'moti';

function useArchiveSurveys() {
  return useQuery<Survey[]>({
    queryKey: ['surveys', 'archive'],
    queryFn: async () => {
      const today = getTurkeyDateString();
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('status', 'completed')
        .lt('scheduled_for', today)
        .order('scheduled_for', { ascending: false })
        .limit(30);
      if (error) throw error;
      return data as Survey[];
    },
    staleTime: 1000 * 60 * 10,
  });
}

export default function ArchiveScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const { data: surveys, isLoading } = useArchiveSurveys();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Typography variant="h2" weight="extraBold">
          Arşiv
        </Typography>
        <Typography variant="caption" muted>
          Geçmiş anketler
        </Typography>
      </View>

      {isLoading ? (
        <View style={{ padding: 20, gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <MotiView
              key={i}
              from={{ opacity: 0.3 }}
              animate={{ opacity: 0.7 }}
              transition={{ loop: true, type: 'timing', duration: 800, delay: i * 100 }}
              style={{ height: 80, borderRadius: 12, backgroundColor: colors.surfaceAlt }}
            />
          ))}
        </View>
      ) : !surveys || surveys.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Typography style={{ fontSize: 40 }}>📚</Typography>
          <Typography variant="body" muted center>
            Henüz arşivlenmiş anket yok.
          </Typography>
        </View>
      ) : (
        <FlatList
          data={surveys}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: index * 50 }}
            >
              <Card style={{ marginBottom: 12, gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Tag category={item.category} />
                  <Typography variant="tiny" muted>
                    {format(parseISO(item.scheduled_for), 'd MMM', { locale: tr })}
                  </Typography>
                </View>
                <Typography variant="body" weight="semiBold" numberOfLines={2}>
                  {item.question}
                </Typography>
                <Typography variant="caption" muted>
                  {item.total_votes.toLocaleString('tr-TR')} oy
                </Typography>
              </Card>
            </MotiView>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 2,
  },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
});
