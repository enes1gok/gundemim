import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const DEVICE_ID_KEY = 'gundemim_device_id';

export async function getOrCreateDeviceId(): Promise<string> {
  try {
    const stored = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    if (stored) return stored;

    const random = Math.random().toString(36) + Date.now().toString(36);
    const id = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      random
    );

    await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
    return id;
  } catch {
    // Fallback in case SecureStore is unavailable (e.g. simulator edge cases)
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}
