import { useSettingStore } from "@/stores/settingStore";

const LoadingOverlay: React.FC = () => {
  const { loading } = useSettingStore();

  return loading ? (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
      style={{ zIndex: 2501 }}
    >
      <div className="w-30 h-30 rounded-full animate-spin absolute border-10 border-solid border-green-400 border-t-transparent"></div>
    </div>
  ) : null;
};

export default LoadingOverlay;
