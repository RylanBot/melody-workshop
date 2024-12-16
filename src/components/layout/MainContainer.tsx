import { ReactNode } from "react";
import { Dropdown } from "tdesign-react";

interface MainContainerProps {
  slot?: ReactNode;
  children?: ReactNode;
  onExport: (format: string) => void;
}

const MainContainer: React.FC<MainContainerProps> = ({ slot, children, onExport }) => {
  const FORMAT_OPTIONS = ["wav", "mp3"];

  return (
    <>
      <div className="h-screen w-[80vw] m-auto flex-col flex-center text-green-900 dark:text-green-500">
        <div className="w-full">
          <div className="flex-between">
            {/* 切换栏 */}
            <div className="ml-1.5">{slot}</div>
            {/* 导出 */}
            <div className="mr-1.5">
              <Dropdown
                placement="top"
                trigger="hover"
                onClick={(opt) => onExport(opt.value as string)}
                options={FORMAT_OPTIONS.map((format) => ({
                  content: <div text="center">{format}</div>,
                  value: format
                }))}
                style={{ width: 113 }}
              >
                <div className="px-4 py-1 text-white bg-green-700 dark:bg-green-800 border-2 border-green-600 border-b-none">
                  <div className="flex-center font-bold">
                    <div className="i-ri:folder-music-line mr-4 text-lg"></div>
                    <span>Export</span>
                  </div>
                </div>
              </Dropdown>
            </div>
          </div>
          <div className="h-125 bg-green-50 border-2 border-green-600 px-10 rounded-md dark:bg-dark-600">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainContainer;
