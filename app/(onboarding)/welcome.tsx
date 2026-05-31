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
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { darkColors, lightColors } from '../../theme/colors';

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
          ? ['#0D0D0F', '#1A1A2E', '#0D0D0F']
          : ['#F5F5F0', '#EAE8FF', '#F5F5F0']
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
                { backgroundColor: colors.brand + '22', borderColor: colors.brand + '44' },
              ]}
            >
              <Typography
                style={{ fontSize: 48, lineHeight: 60 }}
              >
                📊
              </Typography>
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
            style={{ color: colors.textMuted, marginTop: 8, lineHeight: 30 }}
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
          {[
            { icon: '🗳️', text: 'Her gün güncel bir anket' },
            { icon: '📊', text: 'Anlık istatistikler ve analizler' },
            { icon: '🔒', text: 'Tamamen anonim ve şeffaf' },
          ].map((f) => (
            <View key={f.text} style={styles.featureRow}>
              <Typography style={{ fontSize: 20 }}>{f.icon}</Typography>
              <Typography variant="body" style={{ color: colors.textMuted }}>
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
    borderRadius: 48,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: { alignItems: 'center', gap: 4 },
  features: { gap: 14, alignSelf: 'stretch' },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  footer: { paddingHorizontal: 24, paddingBottom: 40 },
});
