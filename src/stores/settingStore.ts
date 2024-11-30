import { create } from "zustand";

type ThemeMode = "light" | "dark";

interface SettingState {
  themeMode: ThemeMode;
}

interface SettingAction {
  setThemeMode: (value: ThemeMode) => void;
}

type SettingStore = SettingState & SettingAction;

export const useSettingStore = create<SettingStore>((set, get) => ({
  themeMode: "light",
  setThemeMode: (value) => {
    set({ themeMode: value });
    document.documentElement.setAttribute("theme-mode", value);
  }
}));
