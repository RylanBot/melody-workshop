import { useEffect } from "react";
import { useSettingStore } from "@/stores/settingStore";

const useSettings = () => {
  const { setThemeMode } = useSettingStore();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const isNightTime = () => {
      const now = new Date();
      const hour = now.getHours();
      return hour >= 20 || hour < 6;
    };

    const handleThemeChange = () => {
      if (mediaQuery.matches) {
        setThemeMode("dark");
      } else {
        setThemeMode(isNightTime() ? "dark" : "light");
      }
    };

    handleThemeChange();
    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);
};

export default useSettings;
