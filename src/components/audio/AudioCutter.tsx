import { useState } from "react";
import { Slider } from "tdesign-react";

import useWaveSurferContext from "@/hooks/useWaveSurferContext";
import { secondsToTime, timeToSeconds } from "@/libs/common/time";

import AudioTimeInput from "./AudioTimeInput";

const AudioCutter: React.FC = () => {
  const { processorRef, duration, startTime, endTime, setStartTime, setEndTime } = useWaveSurferContext();

  const [volume, setVolume] = useState<number>(1);
  const [speed, setSpeed] = useState<number>(1);

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

  const handleSpeedChange = (speed: number) => {
    if (!processorRef.current) return;
    setSpeed(speed);
    processorRef.current.applySpeed(speed);
  };

  return (
    <div
      className="space-y-10"
      max-sm="space-y-5 w-full flex-col text-sm"
    >
      {/* 时间 */}
      <div
        className="flex-center space-x-8"
        max-sm="space-x-4"
      >
        <div className="w-1/2 flex-start">
          <strong className="mr-2">Start</strong>
          <AudioTimeInput
            max={secondsToTime(duration)}
            time={secondsToTime(startTime)}
            onChange={(time) => validateStartTime(time)}
          />
        </div>
        <div className="w-1/2 flex-start">
          <strong className="mr-2">End</strong>
          <AudioTimeInput
            max={secondsToTime(duration)}
            time={secondsToTime(endTime)}
            onChange={(time) => validateEndTime(time)}
          />
        </div>
      </div>
      {/* 音量 */}
      <div className="flex pr-4">
        <strong className="mr-4">Volume</strong>
        <Slider
          min={0}
          max={1}
          step={0.1}
          disabled={!processorRef.current}
          value={volume}
          onChange={(value) => handleVolumeChange(value as number)}
        />
      </div>
      {/* 音速 */}
      <div className="flex pr-4">
        <strong className="mr-6">Speed</strong>
        <Slider
          min={0.5}
          max={4}
          step={0.1}
          disabled={!processorRef.current}
          value={speed}
          onChange={(value) => handleSpeedChange(value as number)}
        />
      </div>
    </div>
  );
};

export default AudioCutter;
