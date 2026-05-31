import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { darkColors, lightColors } from '../../theme/colors';

const FEATURES = [
  { icon: 'checkmark-done-outline' as const, text: 'Her gün güncel bir anket' },
  { icon: 'bar-chart-outline' as const, text: 'Anlık istatistikler ve analizler' },
  { icon: 'lock-closed-outline' as const, text: 'Tamamen anonim ve şeffaf' },
];

export default function WelcomeScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Secret admin trigger: tap logo 5 times quickly
  const handleLogoTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 2000);

    if (tapCount.current >= 5) {
      tapCount.current = 0;
      router.push('/(admin)/login');
    }
  };

  return (
    <LinearGradient
      colors={
        scheme === 'dark'
          ? ['#09090B', '#18181B', '#09090B']
          : ['#FFFFFF', '#FAFAFA', '#FFFFFF']
      }
      style={styles.container}
    >
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />

      <View style={styles.inner}>
        {/* Logo area */}
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 200 }}
          style={styles.logoContainer}
        >
          <TouchableOpacity activeOpacity={0.9} onPress={handleLogoTap}>
            <View
              style={[
                styles.logoCircle,
                { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
              ]}
            >
              <Ionicons name="stats-chart" size={40} color={colors.text} />
            </View>
          </TouchableOpacity>
        </MotiView>

        {/* Title */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 400 }}
          style={styles.titleContainer}
        >
          <Typography variant="display" weight="extraBold" center style={{ color: colors.text }}>
            Gündemim
          </Typography>
          <Typography
            variant="h3"
            center
            style={{ color: colors.textMuted, marginTop: 8 }}
          >
            Her gün bir soru.{'\n'}Türkiye ne düşünüyor?
          </Typography>
        </MotiView>

        {/* Features */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 500, delay: 700 }}
          style={styles.features}
        >
          {FEATURES.map((f) => (
            <View key={f.text} style={styles.featureRow}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: colors.surfaceAlt,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name={f.icon} size={16} color={colors.text} />
              </View>
              <Typography variant="body" style={{ color: colors.textMuted, flex: 1 }}>
                {f.text}
              </Typography>
            </View>
          ))}
        </MotiView>
      </View>

      {/* CTA */}
      <MotiView
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15, delay: 900 }}
        style={styles.footer}
      >
        <Button
          label="Başlayalım"
          fullWidth
          onPress={() => router.push('/(onboarding)/demographics')}
        />
        <Typography variant="tiny" muted center style={{ marginTop: 12 }}>
          Kişisel veri toplanmaz · Tamamen ücretsiz
        </Typography>
      </MotiView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 32,
  },
  logoContainer: { alignItems: 'center' },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: { alignItems: 'center', gap: 4 },
  features: { gap: 14, alignSelf: 'stretch' },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  footer: { paddingHorizontal: 24, paddingBottom: 40 },
});
