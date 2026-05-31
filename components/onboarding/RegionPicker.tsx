import React, { useMemo, useRef } from 'react';
import { View, TouchableOpacity, FlatList, useColorScheme } from 'react-native';
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

  // Grouped by region
  const grouped = useMemo(() => {
    return GEOGRAPHIC_REGIONS.map((region) => ({
      region,
      provinces: PROVINCES.filter((p) => p.region === region),
    }));
  }, []);

  const flatData = useMemo(() => {
    const items: Array<{ type: 'header'; label: string } | { type: 'item'; code: string; name: string }> = [];
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
          borderWidth: 1.5,
          borderColor: selected ? colors.brand : colors.border,
          backgroundColor: selected ? colors.brandDim : colors.surface,
        }}
      >
        <Typography
          variant="body"
          style={{ color: selected ? colors.brand : colors.textMuted }}
          weight={selected ? 'semiBold' : 'regular'}
        >
          {selectedProvince?.name ?? 'İlinizi seçin'}
        </Typography>
        <Ionicons
          name="chevron-down"
          size={18}
          color={selected ? colors.brand : colors.textMuted}
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
            item.type === 'header' ? `h-${item.label}` : `i-${item.code}`
          }
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return (
                <View
                  style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 6 }}
                >
                  <Typography variant="caption" weight="bold" muted>
                    {item.label.toUpperCase()}
                  </Typography>
                </View>
              );
            }
            const isSelected = item.code === selected;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  onSelect(item.code);
                  sheetRef.current?.close();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  paddingVertical: 13,
                  backgroundColor: isSelected ? colors.brandDim : 'transparent',
                }}
              >
                <Typography
                  variant="body"
                  weight={isSelected ? 'semiBold' : 'regular'}
                  style={{ color: isSelected ? colors.brand : colors.text }}
                >
                  {item.name}
                </Typography>
                {isSelected && (
                  <Ionicons name="checkmark" size={18} color={colors.brand} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </BottomSheet>
    </>
  );
}
