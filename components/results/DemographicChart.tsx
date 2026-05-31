import React, { useState } from 'react';
import { View, TouchableOpacity, useColorScheme, ScrollView } from 'react-native';
import { Typography } from '../ui/Typography';
import { ProgressBar } from '../ui/ProgressBar';
import { darkColors, lightColors } from '../../theme/colors';
import { MotiView } from 'moti';
import { SurveyOption, SurveyResults } from '../../types/app';
import { getDemographicBreakdown } from '../../lib/analytics';

type Dimension = 'by_age' | 'by_gender' | 'by_region' | 'by_education';

const TABS: { key: Dimension; label: string }[] = [
  { key: 'by_age', label: 'Yaş' },
  { key: 'by_gender', label: 'Cinsiyet' },
  { key: 'by_region', label: 'Bölge' },
  { key: 'by_education', label: 'Eğitim' },
];

const GENDER_LABELS: Record<string, string> = {
  erkek: 'Erkek',
  kadin: 'Kadın',
  belirtmek_istemiyorum: 'Belirtmedi',
};

const EDUCATION_LABELS: Record<string, string> = {
  ilkokul: 'İlkokul',
  ortaokul: 'Ortaokul',
  lise: 'Lise',
  onlisans: 'Ön Lisans',
  lisans: 'Lisans',
  yukseklisans: 'Yüksek Lisans',
  doktora: 'Doktora',
};

function formatDimLabel(dimension: Dimension, label: string): string {
  if (dimension === 'by_gender') return GENDER_LABELS[label] ?? label;
  if (dimension === 'by_education') return EDUCATION_LABELS[label] ?? label;
  if (dimension === 'by_region') {
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
  return label;
}

interface DemographicChartProps {
  results: SurveyResults;
  options: SurveyOption[];
  chosenOptionId: string;
  baseDelay?: number;
}

export function DemographicChart({
  results,
  options,
  chosenOptionId,
  baseDelay = 0,
}: DemographicChartProps) {
  const [activeTab, setActiveTab] = useState<Dimension>('by_age');
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  const breakdown = getDemographicBreakdown(activeTab, results, options);

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 400, delay: baseDelay }}
    >
      <Typography variant="h3" weight="bold" style={{ marginBottom: 14 }}>
        Türkiye Ne Düşündü?
      </Typography>

      {/* Tab bar */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.surfaceAlt,
          borderRadius: 10,
          padding: 3,
          marginBottom: 16,
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: isActive ? colors.surface : 'transparent',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="caption"
                weight={isActive ? 'bold' : 'regular'}
                style={{ color: isActive ? colors.brand : colors.textMuted }}
              >
                {tab.label}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Breakdown rows */}
      {breakdown.length === 0 ? (
        <Typography variant="caption" muted center>
          Yeterli veri yok
        </Typography>
      ) : (
        <View style={{ gap: 16 }}>
          {breakdown.map(({ label, bars }, idx) => {
            const chosenBar = bars.find((b) => b.optionId === chosenOptionId);
            return (
              <MotiView
                key={label}
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'timing', duration: 300, delay: baseDelay + idx * 80 }}
              >
                <Typography variant="caption" weight="semiBold" muted style={{ marginBottom: 6 }}>
                  {formatDimLabel(activeTab, label)}
                </Typography>
                {bars.map((bar) => (
                  <View key={bar.optionId} style={{ marginBottom: 6 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 3,
                      }}
                    >
                      <Typography variant="tiny" numberOfLines={1} style={{ flex: 1, marginRight: 8 }}>
                        {bar.label}
                      </Typography>
                      <Typography variant="tiny" weight="semiBold">
                        %{bar.pct}
                      </Typography>
                    </View>
                    <ProgressBar
                      percentage={bar.pct}
                      delay={baseDelay + idx * 80 + 100}
                      color={bar.optionId === chosenOptionId ? colors.brand : colors.textFaint}
                      height={5}
                    />
                  </View>
                ))}
              </MotiView>
            );
          })}
        </View>
      )}
    </MotiView>
  );
}
