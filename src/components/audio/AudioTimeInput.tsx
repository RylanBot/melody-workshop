import { useEffect, useRef } from "react";
import { PatternFormat } from "react-number-format";

import { formatTime, isTimeSmallerThan } from "@/libs/common/time";

interface AudioTimeInputProps {
  max: string; // 音频本身长度
  time: string; // 当前时间
  onChange: (time: string) => void;
}

const AudioTimeInput: React.FC<AudioTimeInputProps> = ({ max, time, onChange }) => {
  const currentTimeRef = useRef<string>("00:00:00");

  useEffect(() => {
    currentTimeRef.current = time;
  }, [time]);

  const onTimeChange = (newTime: string) => {
    if (isTimeSmallerThan(newTime, max)) {
      currentTimeRef.current = newTime;
      onChange(newTime);
    }
  };

  const handleIncrease = () => {
    let [minutes, seconds, milliseconds] = currentTimeRef.current.split(":").map(Number);

    milliseconds += 1;
    if (milliseconds >= 100) {
      milliseconds = 0;
      seconds += 1; // 进位到秒
    }
    if (seconds >= 60) {
      seconds = 0;
      minutes += 1; // 进位到分钟
    }

    const newTime = formatTime(minutes, seconds, milliseconds);
    onTimeChange(newTime);
  };

  const handleDecrease = () => {
    let [minutes, seconds, milliseconds] = currentTimeRef.current.split(":").map(Number);

    if (milliseconds > 0) {
      milliseconds -= 1;
    } else if (seconds > 0) {
      seconds -= 1;
      milliseconds = 99;
    } else if (minutes > 0) {
      minutes -= 1;
      seconds = 59;
      milliseconds = 99;
    }

    const newTime = formatTime(minutes, seconds, milliseconds);
    onTimeChange(newTime);
  };

  return (
    <>
      <div className="flex">
        <PatternFormat
          value={currentTimeRef.current}
          format="##:##:##"
          mask="_"
          onChange={(e) => onTimeChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace") e.preventDefault(); // 避免文本删除 -> 需要引入复杂校验逻辑
          }}
          className="w-20 text-center text-sm"
        />
        <div className="flex flex-col mx-0.5 px-1">
          <button
            className="i-material-symbols:expand-less"
            onClick={handleIncrease}
          ></button>
          <button
            className="i-material-symbols:expand-more"
            onClick={handleDecrease}
          ></button>
        </div>
      </div>
    </>
  );
};

export default AudioTimeInput;
