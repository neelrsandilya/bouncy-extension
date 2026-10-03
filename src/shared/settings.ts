export interface BounceSettings {
  enabled: boolean;
  mouseEnabled: boolean;
  scrollEnabled: boolean;
  intensity: number;
  stiffness: number;
  damping: number;
  rotationEnabled: boolean;
  scrollIntensity: number;
  version?: number;
}

export const defaultSettings: BounceSettings = {
  enabled: true,
  mouseEnabled: true,
  scrollEnabled: true,
  intensity: 1.0,
  stiffness: 280,
  damping: 25,
  rotationEnabled: true,
  scrollIntensity: 1.0,
  version: 5,
};

export async function getSettings(): Promise<BounceSettings> {
  if (typeof chrome === 'undefined' || !chrome.storage) return defaultSettings;
  return new Promise((resolve) => {
    chrome.storage.sync.get('bounceSettings', (result: any) => {
      if (result.bounceSettings) {
        let loadedSettings = { ...defaultSettings, ...result.bounceSettings };
        
        if (!result.bounceSettings.version || result.bounceSettings.version < 3) {
          loadedSettings.intensity = Math.min(3.0, loadedSettings.intensity * 10);
          loadedSettings.scrollIntensity = Math.min(3.0, loadedSettings.scrollIntensity * 10);
        }
        
        if (!result.bounceSettings.version || result.bounceSettings.version < 5) {
          loadedSettings.version = 5;
          chrome.storage.sync.set({ bounceSettings: loadedSettings });
        }
        
        resolve(loadedSettings);
      } else {
        resolve(defaultSettings);
      }
    });
  });
}

export async function saveSettings(settings: BounceSettings): Promise<void> {
  if (typeof chrome === 'undefined' || !chrome.storage) return;
  return new Promise((resolve) => {
    chrome.storage.sync.set({ bounceSettings: settings }, () => {
      resolve();
    });
  });
}

export function onSettingsChange(callback: (settings: BounceSettings) => void) {
  if (typeof chrome === 'undefined' || !chrome.storage) return;
  chrome.storage.onChanged.addListener((changes: any, areaName: string) => {
    if (areaName === 'sync' && changes.bounceSettings) {
      callback({ ...defaultSettings, ...changes.bounceSettings.newValue });
    }
  });
}
