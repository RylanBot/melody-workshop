import useWaveSurferContext from "@/hooks/useWaveSurferContext";
import { secondsToTime, timeToSeconds } from "@/libs/time";
import AudioTimeInput from "./AudioTimeInput";

const AudioTimeInputSet: React.FC<{ max: string }> = ({ max }) => {
  const { startTime, endTime, setStartTime, setEndTime } = useWaveSurferContext();

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
        <strong className="mr-4">Start: </strong>
        <AudioTimeInput
          max={max}
          time={secondsToTime(startTime)}
          onChange={(time) => validateStartTime(time)}
        />
      </div>
      <div className="flex-center">
        <strong className="mr-4">End: </strong>
        <AudioTimeInput
          max={max}
          time={secondsToTime(endTime)}
          onChange={(time) => validateEndTime(time)}
        />
      </div>
    </div>
  );
};

export default AudioTimeInputSet;
