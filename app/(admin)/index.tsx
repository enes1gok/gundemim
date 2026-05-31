import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { supabase } from '../../lib/supabase';
import { Survey } from '../../types/app';
import { Tag } from '../../components/ui/Tag';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { darkColors, lightColors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Taslak',
  scheduled: 'Planlandı',
  active: 'Yayında',
  completed: 'Tamamlandı',
};

const STATUS_COLORS: Record<string, string> = {
  draft: '#71717A',
  scheduled: '#F59E0B',
  active: '#22C55E',
  completed: '#A1A1AA',
};

function useAdminSurveys() {
  return useQuery<Survey[]>({
    queryKey: ['admin', 'surveys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .order('scheduled_for', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as Survey[];
    },
  });
}

export default function AdminIndexScreen() {
  const { isAdmin, signOut } = useAdminAuth();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const { data: surveys, refetch } = useAdminSurveys();

  useEffect(() => {
    if (!isAdmin) router.replace('/(admin)/login');
  }, [isAdmin]);

  if (!isAdmin) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Typography variant="h2" weight="extraBold">
            Admin Panel
          </Typography>
          <Typography variant="caption" muted>
            Anket Yönetimi
          </Typography>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            onPress={() => router.push('/(admin)/create')}
            style={[styles.iconBtn, { backgroundColor: colors.accent }]}
          >
            <Ionicons name="add" size={22} color={colors.background} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { signOut(); router.replace('/(main)'); }}
            style={[styles.iconBtn, { backgroundColor: colors.surfaceAlt }]}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={surveys}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/(admin)/survey/[id]', params: { id: item.id } })}
          >
            <Card style={{ marginBottom: 12, gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tag category={item.category} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: STATUS_COLORS[item.status],
                    }}
                  />
                  <Typography variant="tiny" style={{ color: STATUS_COLORS[item.status] }}>
                    {STATUS_LABELS[item.status]}
                  </Typography>
                </View>
              </View>
              <Typography variant="body" weight="semiBold" numberOfLines={2}>
                {item.question}
              </Typography>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography variant="caption" muted>
                  {format(parseISO(item.scheduled_for), 'd MMMM yyyy', { locale: tr })}
                </Typography>
                <Typography variant="caption" muted>
                  {item.total_votes.toLocaleString('tr-TR')} oy
                </Typography>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 40, gap: 12 }}>
            <Typography style={{ fontSize: 40 }}>📝</Typography>
            <Typography variant="body" muted center>
              Henüz anket oluşturulmadı.
            </Typography>
            <Button
              label="İlk Anketi Oluştur"
              onPress={() => router.push('/(admin)/create')}
            />
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
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
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
