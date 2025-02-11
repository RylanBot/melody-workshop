import { ReactNode } from "react";

interface MainContainerProps {
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  children?: ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({ leftSlot, rightSlot, children }) => {
  return (
    <>
      <main className="min-h-[80vh] w-[90vw] m-auto text-green-900 dark:text-green-500">
        <div
          className="w-full pt-16"
          max-lg="pt-8"
        >
          <div className="flex-between">
            {/* 切换栏 */}
            <div className="ml-1.5">{leftSlot}</div>
            {/* 导出 */}
            <div className="mr-1.5">{rightSlot}</div>
          </div>
          <div
            className="h-125 bg-green-50 border-2 border-green-600 px-10 rounded-md dark:bg-dark-600"
            max-lg="px-4 h-140"
          >
            {children}
          </div>
        </div>
      </main>
    </>
  );
};

export default MainContainer;
