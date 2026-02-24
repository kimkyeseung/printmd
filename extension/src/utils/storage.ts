/**
 * Chrome storage utilities
 */

export interface ExtensionSettings {
  enabled: boolean;
  autoDetect: boolean;
}

const DEFAULT_SETTINGS: ExtensionSettings = {
  enabled: true,
  autoDetect: true,
};

/**
 * Get extension settings from chrome.storage.sync
 */
export async function getSettings(): Promise<ExtensionSettings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (result) => {
      resolve(result as ExtensionSettings);
    });
  });
}

/**
 * Save extension settings to chrome.storage.sync
 */
export async function saveSettings(settings: Partial<ExtensionSettings>): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set(settings, resolve);
  });
}

/**
 * Get recent files from chrome.storage.local
 */
export interface RecentFile {
  url: string;
  title: string;
  timestamp: number;
}

export async function getRecentFiles(): Promise<RecentFile[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get({ recentFiles: [] }, (result) => {
      resolve(result.recentFiles as RecentFile[]);
    });
  });
}

/**
 * Add a file to recent files
 */
export async function addRecentFile(file: Omit<RecentFile, 'timestamp'>): Promise<void> {
  const recentFiles = await getRecentFiles();

  // Remove duplicate if exists
  const filtered = recentFiles.filter((f) => f.url !== file.url);

  // Add new file at the beginning
  const updated = [
    { ...file, timestamp: Date.now() },
    ...filtered,
  ].slice(0, 10); // Keep only last 10 files

  return new Promise((resolve) => {
    chrome.storage.local.set({ recentFiles: updated }, resolve);
  });
}
