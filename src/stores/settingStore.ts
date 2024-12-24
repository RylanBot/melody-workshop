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

export const useSettingStore = create<SettingStore>((set) => ({
  loading: false,
  setLoading: (value) => {
    set({ loading: value });
  },
  themeMode: "light",
  setThemeMode: (value) => {
    set({ themeMode: value });
    document.documentElement.setAttribute("theme-mode", value);
  }
}));
