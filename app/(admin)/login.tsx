import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAdminStore } from '../../stores/adminStore';
import { Button } from '../../components/ui/Button';
import { Typography } from '../../components/ui/Typography';
import { darkColors, lightColors } from '../../theme/colors';
import { radius } from '../../theme/spacing';

export default function AdminLoginScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const { signIn, loading, error } = useAdminStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const ok = await signIn(email.trim(), password);
    if (ok) router.replace('/(admin)/');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        {/* Close */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.closeBtn, { backgroundColor: colors.surfaceAlt }]}
        >
          <Ionicons name="close" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <Typography variant="h2" weight="extraBold" style={{ marginBottom: 6 }}>
          Admin Girişi
        </Typography>
        <Typography variant="body" muted style={{ marginBottom: 32 }}>
          Yetkili hesabınızla giriş yapın.
        </Typography>

        {/* Email */}
        <View style={{ marginBottom: 12 }}>
          <Typography variant="caption" weight="semiBold" style={{ marginBottom: 6, color: colors.textMuted }}>
            E-POSTA
          </Typography>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
                fontFamily: 'PlusJakartaSans-Regular',
              },
            ]}
            placeholderTextColor={colors.textMuted}
            placeholder="admin@gundemim.app"
          />
        </View>

        {/* Password */}
        <View style={{ marginBottom: 24 }}>
          <Typography variant="caption" weight="semiBold" style={{ marginBottom: 6, color: colors.textMuted }}>
            ŞİFRE
          </Typography>
          <View>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                  fontFamily: 'PlusJakartaSans-Regular',
                  paddingRight: 48,
                },
              ]}
              placeholderTextColor={colors.textMuted}
              placeholder="••••••••"
            />
            <TouchableOpacity
              onPress={() => setShowPassword((p) => !p)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {error && (
          <Typography
            variant="caption"
            style={{ color: colors.error, marginBottom: 16 }}
          >
            {error}
          </Typography>
        )}

        <Button
          label="Giriş Yap"
          fullWidth
          loading={loading}
          disabled={!email || !password}
          onPress={handleLogin}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 24,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    top: 0,
    height: 50,
    justifyContent: 'center',
  },
});
