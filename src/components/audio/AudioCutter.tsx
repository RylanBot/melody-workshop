import { useState } from "react";
import { Slider } from "tdesign-react";

import useWaveSurferContext from "@/hooks/useWaveSurferContext";
import { secondsToTime, timeToSeconds } from "@/libs/common/time";

import AudioTimeInput from "./AudioTimeInput";

const AudioCutter: React.FC = () => {
  const { processorRef, duration, startTime, endTime, setStartTime, setEndTime } = useWaveSurferContext();
  const [volume, setVolume] = useState<number>(1);

  const validateStartTime = (time: string) => {
    const secondes = timeToSeconds(time);
    const newTime = secondes <= endTime ? secondes : endTime - 1;
    setStartTime(newTime);
  };

  const validateEndTime = (time: string) => {
    const secondes = timeToSeconds(time);
    const newTime = secondes >= startTime ? secondes : startTime + 1;
    setEndTime(newTime);
  };

  const handleVolumeChange = (volume: number) => {
    if (!processorRef.current) return;
    setVolume(volume);
    processorRef.current.applyVolume(volume);
  };

  return (
    <div className="space-y-10">
      {/* 时间 */}
      <div className="flex items-center space-x-8">
        <div className="flex-center">
          <strong className="mr-2">Start: </strong>
          <AudioTimeInput
            max={secondsToTime(duration)}
            time={secondsToTime(startTime)}
            onChange={(time) => validateStartTime(time)}
          />
        </div>
        <div className="flex-center">
          <strong className="mr-2">End: </strong>
          <AudioTimeInput
            max={secondsToTime(duration)}
            time={secondsToTime(endTime)}
            onChange={(time) => validateEndTime(time)}
          />
        </div>
      </div>
      {/* 音量 */}
      <div className="flex pr-4">
        <strong className="mr-4">Volume: </strong>
        <Slider
          min={0}
          max={1}
          step={0.1}
          disabled={!processorRef.current}
          value={volume}
          onChange={(value) => handleVolumeChange(value as number)}
        />
      </div>
    </div>
  );
};

export default AudioCutter;
