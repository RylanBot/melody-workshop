import ReactDOM from "react-dom";
import { useSettingStore } from "@/stores/settingStore";

const LoadingOverlay: React.FC = () => {
  const { loading } = useSettingStore();

  if (!loading) return <></>;

  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[9999]">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-12 rounded-md bg-green-400"
              style={{
                animation: `bounce 1.2s ${i * 0.2}s infinite ease-in-out`,
              }}
            ></div>
          ))}
        </div>
      </div>
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: scaleY(0.4);
            }
            50% {
              transform: scaleY(1);
            }
          }
        `}
      </style>
    </>,
    document.body
  );
};

export default LoadingOverlay;
