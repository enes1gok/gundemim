import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, AgeRange, Gender, Education, Category } from '../types/app';

const ONBOARDING_KEY = 'gundemim_onboarding_done';
const VOTED_KEY = 'gundemim_voted_';

interface UserState {
  deviceId: string | null;
  profile: UserProfile | null;
  onboardingCompleted: boolean;
  theme: 'dark' | 'light' | 'system';
  setDeviceId: (id: string) => void;
  setProfile: (profile: UserProfile) => void;
  setOnboardingCompleted: (v: boolean) => void;
  setTheme: (t: 'dark' | 'light' | 'system') => void;
  getVotedOptionId: (surveyId: string) => Promise<string | null>;
  saveVote: (surveyId: string, optionId: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  deviceId: null,
  profile: null,
  onboardingCompleted: false,
  theme: 'system',

  setDeviceId: (id) => set({ deviceId: id }),
  setProfile: (profile) => set({ profile, onboardingCompleted: profile.onboarding_completed }),
  setOnboardingCompleted: async (v) => {
    set({ onboardingCompleted: v });
    await AsyncStorage.setItem(ONBOARDING_KEY, v ? '1' : '0');
  },
  setTheme: (theme) => set({ theme }),

  getVotedOptionId: async (surveyId) => {
    return AsyncStorage.getItem(VOTED_KEY + surveyId);
  },

  saveVote: async (surveyId, optionId) => {
    await AsyncStorage.setItem(VOTED_KEY + surveyId, optionId);
  },
}));
