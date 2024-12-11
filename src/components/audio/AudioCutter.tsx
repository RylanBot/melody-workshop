import useWaveSurferContext from "@/hooks/useWaveSurferContext";
import { secondsToTime, timeToSeconds } from "@/libs/time";
import AudioTimeInput from "./AudioTimeInput";

const AudioCutter: React.FC = () => {
  const { duration, startTime, endTime, setStartTime, setEndTime } = useWaveSurferContext();

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

  return (
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
  );
};

export default AudioCutter;
