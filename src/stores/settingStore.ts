import { create } from "zustand";

type ThemeMode = "light" | "dark";

interface SettingState {
  loading: boolean;
  themeMode: ThemeMode;
}

interface SettingAction {
  setLoading: (value: boolean) => void;
  setThemeMode: (value: ThemeMode) => void;
}

type SettingStore = SettingState & SettingAction;

const updateThemeAttr = (value: ThemeMode) => {
  document.documentElement.setAttribute("theme-mode", value);
  localStorage.setItem("theme-mode", value);
};

const initThemeMode = () => {
  const localTheme = localStorage.getItem("theme-mode");

  if (localTheme === "light" || localTheme === "dark") {
    updateThemeAttr(localTheme);
    return localTheme;
  }

  const preferTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  updateThemeAttr(preferTheme);
  return preferTheme;
};

export const useSettingStore = create<SettingStore>((set) => ({
  loading: false,
  setLoading: (value) => {
    set({ loading: value });
  },
  themeMode: initThemeMode(),
  setThemeMode: (value) => {
    set({ themeMode: value });
    updateThemeAttr(value);
  }
}));
