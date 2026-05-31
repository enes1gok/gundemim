import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { StepIndicator } from '../../components/onboarding/StepIndicator';
import { OptionGrid } from '../../components/onboarding/OptionGrid';
import { RegionPicker } from '../../components/onboarding/RegionPicker';
import { Button } from '../../components/ui/Button';
import { Typography } from '../../components/ui/Typography';
import { darkColors, lightColors } from '../../theme/colors';
import { useUserStore } from '../../stores/userStore';
import { AgeRange, Gender, Education } from '../../types/app';

const AGE_OPTIONS = [
  { id: '13-17', label: '13–17' },
  { id: '18-24', label: '18–24' },
  { id: '25-34', label: '25–34' },
  { id: '35-44', label: '35–44' },
  { id: '45-54', label: '45–54' },
  { id: '55-64', label: '55–64' },
  { id: '65+', label: '65+' },
];

const GENDER_OPTIONS = [
  { id: 'erkek', label: 'Erkek' },
  { id: 'kadin', label: 'Kadın' },
  { id: 'belirtmek_istemiyorum', label: 'Belirtmek istemiyorum' },
];

const EDUCATION_OPTIONS = [
  { id: 'ilkokul', label: 'İlkokul' },
  { id: 'ortaokul', label: 'Ortaokul' },
  { id: 'lise', label: 'Lise' },
  { id: 'onlisans', label: 'Ön Lisans' },
  { id: 'lisans', label: 'Lisans' },
  { id: 'yukseklisans', label: 'Yüksek Lisans' },
  { id: 'doktora', label: 'Doktora' },
];

export default function DemographicsScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const { profile, setProfile } = useUserStore();

  const [ageRange, setAgeRange] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [education, setEducation] = useState<string | null>(null);

  const isValid = !!ageRange && !!gender && !!region && !!education;

  const handleNext = () => {
    // Store partial profile in memory for the next step
    setProfile({
      device_id: '',
      age_range: ageRange as AgeRange,
      gender: gender as Gender,
      region,
      education: education as Education,
      interests: [],
      onboarding_completed: false,
      created_at: new Date().toISOString(),
    });
    router.push('/(onboarding)/interests');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <StepIndicator current={0} total={2} />
        <Typography variant="caption" muted>Adım 1 / 2</Typography>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Typography variant="h1" weight="extraBold" style={{ marginBottom: 6 }}>
          Sizi tanıyalım
        </Typography>
        <Typography variant="body" muted style={{ marginBottom: 28, lineHeight: 22 }}>
          Bu bilgiler anket analizlerini kişiselleştirmek için kullanılır. Asla paylaşılmaz.
        </Typography>

        {/* Age */}
        <Section label="Yaş aralığınız?">
          <OptionGrid options={AGE_OPTIONS} selected={ageRange} onSelect={setAgeRange} columns={3} />
        </Section>

        {/* Gender */}
        <Section label="Cinsiyetiniz?">
          <OptionGrid options={GENDER_OPTIONS} selected={gender} onSelect={setGender} columns={1} />
        </Section>

        {/* Region */}
        <Section label="Hangi ildesiniz?">
          <RegionPicker
            selected={region}
            onSelect={setRegion}
            isOpen={false}
            onClose={() => {}}
          />
        </Section>

        {/* Education */}
        <Section label="Eğitim durumunuz?">
          <OptionGrid
            options={EDUCATION_OPTIONS}
            selected={education}
            onSelect={setEducation}
            columns={2}
          />
        </Section>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Button
          label="Devam Et"
          fullWidth
          disabled={!isValid}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  return (
    <View style={{ marginBottom: 28 }}>
      <Typography variant="body" weight="bold" style={{ marginBottom: 12, color: colors.text }}>
        {label}
      </Typography>
      {children}
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
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 16,
    borderTopWidth: 1,
  },
});
