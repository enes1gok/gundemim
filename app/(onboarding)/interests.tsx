import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StepIndicator } from '../../components/onboarding/StepIndicator';
import { InterestCard } from '../../components/onboarding/InterestCard';
import { Button } from '../../components/ui/Button';
import { Typography } from '../../components/ui/Typography';
import { darkColors, lightColors } from '../../theme/colors';
import { CATEGORIES } from '../../constants/categories';
import { useUserStore } from '../../stores/userStore';
import { supabase } from '../../lib/supabase';
import { Category } from '../../types/app';

export default function InterestsScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const { deviceId, profile, setProfile, setOnboardingCompleted } = useUserStore();

  const [selected, setSelected] = useState<Set<Category>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (id: Category) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleFinish = async () => {
    if (selected.size === 0 || !deviceId) return;
    setSaving(true);
    setError(null);

    const interests = Array.from(selected);
    const fullProfile = {
      device_id: deviceId,
      age_range: profile?.age_range ?? null,
      gender: profile?.gender ?? null,
      region: profile?.region ?? null,
      education: profile?.education ?? null,
      interests,
      onboarding_completed: true,
    };

    const { error: upsertError } = await supabase
      .from('user_profiles')
      .upsert(fullProfile, { onConflict: 'device_id' });

    if (upsertError) {
      setError('Kaydedilemedi. İnternet bağlantınızı kontrol edin.');
      setSaving(false);
      return;
    }

    setProfile({ ...fullProfile, created_at: new Date().toISOString() });
    await AsyncStorage.setItem('gundemim_onboarding_done', '1');
    setOnboardingCompleted(true);
    router.replace('/(main)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <StepIndicator current={1} total={2} />
        <Typography variant="caption" muted>Adım 2 / 2</Typography>
      </View>

      <View style={styles.content}>
        <Typography variant="h1" weight="extraBold" style={{ marginBottom: 6 }}>
          İlgi Alanlarınız
        </Typography>
        <Typography variant="body" muted style={{ marginBottom: 28, lineHeight: 22 }}>
          Size özel anketler sunabilmemiz için en az birini seçin.
        </Typography>

        <View style={styles.grid}>
          <View style={styles.row}>
            {CATEGORIES.slice(0, 2).map((cat) => (
              <InterestCard
                key={cat.id}
                category={cat}
                selected={selected.has(cat.id)}
                onToggle={() => toggle(cat.id)}
              />
            ))}
          </View>
          <View style={styles.row}>
            {CATEGORIES.slice(2).map((cat) => (
              <InterestCard
                key={cat.id}
                category={cat}
                selected={selected.has(cat.id)}
                onToggle={() => toggle(cat.id)}
              />
            ))}
          </View>
        </View>

        {error && (
          <Typography
            variant="caption"
            style={{ color: colors.error, textAlign: 'center', marginTop: 12 }}
          >
            {error}
          </Typography>
        )}
      </View>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Button
          label="Tamamla"
          fullWidth
          disabled={selected.size === 0}
          loading={saving}
          onPress={handleFinish}
        />
      </View>
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
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  grid: { gap: 12 },
  row: { flexDirection: 'row', gap: 12 },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 16,
    borderTopWidth: 1,
  },
});
