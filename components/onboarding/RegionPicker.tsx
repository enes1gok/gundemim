import React, { useMemo, useRef } from 'react';
import { View, TouchableOpacity, useColorScheme } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../ui/Typography';
import { darkColors, lightColors } from '../../theme/colors';
import { radius } from '../../theme/spacing';
import { PROVINCES, GEOGRAPHIC_REGIONS } from '../../constants/turkishRegions';

interface RegionPickerProps {
  selected: string | null;
  onSelect: (code: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function RegionPicker({ selected, onSelect, isOpen, onClose }: RegionPickerProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const sheetRef = useRef<BottomSheet>(null);

  const selectedProvince = PROVINCES.find((p) => p.code === selected);

  const grouped = useMemo(() => {
    return GEOGRAPHIC_REGIONS.map((region) => ({
      region,
      provinces: PROVINCES.filter((p) => p.region === region),
    }));
  }, []);

  const flatData = useMemo(() => {
    const items: Array<
      { type: 'header'; label: string } | { type: 'item'; code: string; name: string }
    > = [];
    grouped.forEach(({ region, provinces }) => {
      items.push({ type: 'header', label: region });
      provinces.forEach((p) => items.push({ type: 'item', code: p.code, name: p.name }));
    });
    return items;
  }, [grouped]);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => sheetRef.current?.expand()}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: selected ? colors.accent : colors.border,
          backgroundColor: selected ? colors.surfaceAlt : colors.surface,
        }}
      >
        <Typography
          variant="body"
          style={{ color: selected ? colors.text : colors.textMuted }}
          weight={selected ? 'semiBold' : 'regular'}
        >
          {selectedProvince?.name ?? 'İlinizi seçin'}
        </Typography>
        <Ionicons
          name="chevron-down"
          size={18}
          color={selected ? colors.textMuted : colors.textFaint}
        />
      </TouchableOpacity>

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={['70%']}
        enablePanDownToClose
        onClose={onClose}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
      >
        <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
          <Typography variant="h3" weight="bold">
            İl Seçin
          </Typography>
        </View>
        <BottomSheetFlatList
          data={flatData}
          keyExtractor={(item, index) =>
            item.type === 'header' ? `h-${item.label}` : `i-${(item as any).code}`
          }
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return (
                <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 6 }}>
                  <Typography
                    variant="tiny"
                    weight="semiBold"
                    style={{
                      color: colors.textFaint,
                      letterSpacing: 1.2,
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.label}
                  </Typography>
                </View>
              );
            }
            const isSelected = (item as any).code === selected;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  onSelect((item as any).code);
                  sheetRef.current?.close();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  paddingVertical: 13,
                  backgroundColor: isSelected ? colors.surfaceAlt : 'transparent',
                }}
              >
                <Typography
                  variant="body"
                  weight={isSelected ? 'semiBold' : 'regular'}
                  style={{ color: isSelected ? colors.text : colors.text }}
                >
                  {(item as any).name}
                </Typography>
                {isSelected && (
                  <Ionicons name="checkmark" size={18} color={colors.accent} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </BottomSheet>
    </>
  );
}
