import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const isNative = () => {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

export async function hapticImpact(style: 'light' | 'medium' | 'heavy' = 'light'): Promise<void> {
  if (!isNative()) return;
  try {
    const mapped = style === 'heavy' ? ImpactStyle.Heavy : style === 'medium' ? ImpactStyle.Medium : ImpactStyle.Light;
    await Haptics.impact({ style: mapped });
  } catch {
    // no-op
  }
}

export async function hapticSelectionChanged(): Promise<void> {
  if (!isNative()) return;
  try {
    await Haptics.selectionChanged();
  } catch {
    // no-op
  }
}
