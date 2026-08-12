export type ColorTheme = 'dark' | 'light';

const STORAGE_KEY = 'cuenti-erp-docs-theme';

export const readTheme = (): ColorTheme => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'dark'
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
};

export const applyTheme = (theme: ColorTheme) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
};

export const persistTheme = (theme: ColorTheme) => {
  applyTheme(theme);
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // The selected theme still applies when browser storage is unavailable.
  }
};

export const initializeTheme = () => {
  const theme = readTheme();
  applyTheme(theme);
  return theme;
};
