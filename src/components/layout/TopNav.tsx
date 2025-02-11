import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, Tag } from "tdesign-react";

import { useSettingStore } from "@/stores/settingStore";
const { TabPanel } = Tabs;

const TopNav: React.FC = () => {
  const { themeMode, setThemeMode } = useSettingStore();

  const navigate = useNavigate();
  const location = useLocation().pathname;

  const isHome = location === "/";

  const formatLocation = () => {
    if (isHome) return;
    const word = location.split("/")[1];
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  return (
    <nav
      className="h-[5vh] w-screen flex-between py-10 px-12"
      max-lg="px-4"
    >
      <div className="flex-center">
        <div
          onClick={() => !isHome && navigate("/")}
          className={`flex-center mr-6 ${!isHome ? "cursor-pointer" : ""}`}
          max-lg="mr-4"
        >
          <img
            src="/image/favicon.png"
            className="w-8"
          />
          <h1
            className="text-2xl max-lg:text-xl font-sans font-bold text-green-700 dark:text-green-500 ml-4"
            max-lg={!isHome ? "hidden" : undefined}
          >
            Melody Workshop
          </h1>
        </div>
        {!isHome && (
          <Tag
            theme="success"
            variant="outline"
          >
            <span className="font-bold italic">Audio {formatLocation()}</span>
          </Tag>
        )}
      </div>

      {/* 主题切换 */}
      <Tabs
        theme="card"
        className="rounded-sm h-8 w-16 flex-center border border-green-600"
        value={themeMode}
        onChange={(v) => setThemeMode(v as "light" | "dark")}
      >
        <TabPanel
          value="light"
          className="w-4 flex-center"
          label={<div className="i-material-symbols:sunny text-lg"></div>}
        ></TabPanel>
        <TabPanel
          value="dark"
          className="w-4 flex-center"
          label={<div className="i-material-symbols:nightlight text-lg"></div>}
        ></TabPanel>
      </Tabs>
    </nav>
  );
};

export default TopNav;
