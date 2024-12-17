import { Button, Slider } from "tdesign-react";

const AudioTrackControls: React.FC = () => {
  return (
    <div className="w-full flex justify-between">
      {/* 添加音轨 */}
      <Button
        theme="primary"
        variant="outline"
        icon={<div className="i-material-symbols:add-circle mr-2 text-lg"></div>}
      >
        <span font="bold">Add Tracks</span>
      </Button>

      <div className="flex-center space-x-3">
        {/* 重置位置 */}
        <Button
          theme="primary"
          variant="outline"
          icon={<div className="i-radix-icons:reset mr-2 text-lg"></div>}
        >
          <span font="bold">Reset</span>
        </Button>

        {/* 删除音轨 */}
        <Button
          theme="primary"
          variant="outline"
          icon={<div className="i-solar:trash-bin-trash-outline mr-2 text-lg"></div>}
        >
          <span font="bold">Delete</span>
        </Button>

        {/* 调节音量 */}
        <div className="w-46 flex-center bg-white dark:bg-dark-500 border-1 border-green-500 rounded-sm py-1 pl-4 pr-6">
          <div className="i-tdesign:sound mr-4 text-xl text-green-500"></div>
          <Slider
            min={0.1}
            max={2}
            step={0.1}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioTrackControls;
