import React, { useState } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { darkColors, lightColors } from '../../theme/colors';
import { radius } from '../../theme/spacing';
import { Category } from '../../types/app';
import { CATEGORIES } from '../../constants/categories';

interface OptionInput {
  id: string;
  text: string;
}

export default function CreateSurveyScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const qc = useQueryClient();

  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('siyaset');
  const [scheduledFor, setScheduledFor] = useState('');
  const [options, setOptions] = useState<OptionInput[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addOption = () => {
    if (options.length < 4) {
      setOptions((prev) => [...prev, { id: Date.now().toString(), text: '' }]);
    }
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions((prev) => prev.filter((o) => o.id !== id));
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));
  };

  const isValid =
    question.length >= 5 &&
    scheduledFor.match(/^\d{4}-\d{2}-\d{2}$/) &&
    options.every((o) => o.text.trim().length > 0);

  const handleSave = async (status: 'draft' | 'scheduled') => {
    if (!isValid) return;
    setSaving(true);
    setError(null);

    const { error: insertError } = await supabase.from('surveys').insert({
      question: question.trim(),
      description: description.trim() || null,
      category,
      status,
      scheduled_for: scheduledFor,
      options: options.map((o, i) => ({ id: crypto.randomUUID?.() ?? i.toString(), text: o.text.trim(), order: i })),
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    qc.invalidateQueries({ queryKey: ['admin', 'surveys'] });
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Typography variant="body" weight="semiBold">
            Yeni Anket
          </Typography>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Date */}
          <Field label="TARİH (YYYY-MM-DD)">
            <TextInput
              value={scheduledFor}
              onChangeText={setScheduledFor}
              placeholder="2026-06-15"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            />
          </Field>

          {/* Category */}
          <Field label="KATEGORİ">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setCategory(cat.id)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: radius.full,
                    borderWidth: 1.5,
                    borderColor: category === cat.id ? cat.color : colors.border,
                    backgroundColor: category === cat.id ? cat.color + '22' : 'transparent',
                  }}
                >
                  <Typography
                    variant="caption"
                    weight="semiBold"
                    style={{ color: category === cat.id ? cat.color : colors.textMuted }}
                  >
                    {cat.label}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </Field>

          {/* Question */}
          <Field label={`SORU (${question.length}/120)`}>
            <TextInput
              value={question}
              onChangeText={(t) => setQuestion(t.slice(0, 120))}
              placeholder="Anket sorusunu buraya yazın…"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              style={[
                styles.input,
                styles.textarea,
                { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
              ]}
            />
          </Field>

          {/* Description (optional) */}
          <Field label="AÇIKLAMA (opsiyonel)">
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Ek bağlam veya kaynak (opsiyonel)…"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            />
          </Field>

          {/* Options */}
          <Field label={`SEÇENEKLER (${options.length}/4)`}>
            <View style={{ gap: 8 }}>
              {options.map((opt, index) => (
                <View key={opt.id} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      backgroundColor: colors.surfaceAlt,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="tiny" weight="bold" style={{ color: colors.textMuted }}>
                      {String.fromCharCode(65 + index)}
                    </Typography>
                  </View>
                  <TextInput
                    value={opt.text}
                    onChangeText={(t) => updateOption(opt.id, t)}
                    placeholder={`Seçenek ${index + 1}`}
                    placeholderTextColor={colors.textMuted}
                    style={[
                      styles.input,
                      { flex: 1, backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
                    ]}
                  />
                  {options.length > 2 && (
                    <TouchableOpacity onPress={() => removeOption(opt.id)}>
                      <Ionicons name="close-circle-outline" size={22} color={colors.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              {options.length < 4 && (
                <TouchableOpacity
                  onPress={addOption}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    padding: 10,
                    borderRadius: radius.md,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderStyle: 'dashed',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="add" size={18} color={colors.textMuted} />
                  <Typography variant="caption" muted>
                    Seçenek ekle
                  </Typography>
                </TouchableOpacity>
              )}
            </View>
          </Field>

          {error && (
            <Typography variant="caption" style={{ color: colors.error, marginBottom: 12 }}>
              {error}
            </Typography>
          )}

          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 40 }}>
            <Button
              label="Taslak"
              variant="secondary"
              onPress={() => handleSave('draft')}
              disabled={!isValid || saving}
              loading={saving}
              style={{ flex: 1 }}
            />
            <Button
              label="Planla"
              onPress={() => handleSave('scheduled')}
              disabled={!isValid || saving}
              loading={saving}
              style={{ flex: 1 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  return (
    <View style={{ marginBottom: 20 }}>
      <Typography variant="tiny" weight="bold" style={{ color: colors.textMuted, marginBottom: 8, letterSpacing: 0.8 }}>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: { paddingHorizontal: 20, paddingTop: 8 },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  textarea: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
});
