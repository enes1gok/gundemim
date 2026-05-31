import { Redirect } from 'expo-router';
import { useUserStore } from '../stores/userStore';

export default function RootIndex() {
  const { onboardingCompleted } = useUserStore();
  return onboardingCompleted ? (
    <Redirect href="/(main)" />
  ) : (
    <Redirect href="/(onboarding)/welcome" />
  );
}
