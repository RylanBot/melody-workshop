import { PatternFormat } from "react-number-format";
import { isTimeSmallerThan, millisecondsToTime } from "@/libs/common/time";

interface AudioTimeInputProps {
  max: string; // 音频本身长度
  time: string; // 当前时间
  onChange: (time: string) => void;
}

const AudioTimeInput: React.FC<AudioTimeInputProps> = ({ max, time, onChange }) => {
  const onTimeChange = (newTime: string) => {
    if (isTimeSmallerThan(newTime, max)) {
      onChange(newTime);
    }
  };

  const handleIncrease = () => {
    let [minutes, seconds, milliseconds] = time.split(":").map(Number);

    let totalMs = minutes * 60 * 1000 + seconds * 1000 + milliseconds;
    totalMs += 100;

    const newTime = millisecondsToTime(totalMs);
    onTimeChange(newTime);
  };

  const handleDecrease = () => {
    let [minutes, seconds, milliseconds] = time.split(":").map(Number);

    let totalMs = minutes * 60 * 1000 + seconds * 1000 + milliseconds;
    totalMs -= 100;

    if (totalMs < 0) {
      totalMs = 0;
    }

    const newTime = millisecondsToTime(totalMs);
    onTimeChange(newTime);
  };

  return (
    <>
      <div className="flex">
        <PatternFormat
          className="w-20 text-center text-sm"
          value={time}
          format="##:##:###"
          mask=""
          onChange={(e) => onTimeChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace") e.preventDefault(); // 避免文本删除 -> 需要引入复杂校验逻辑
          }}
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
