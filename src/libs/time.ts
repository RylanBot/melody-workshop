/**
 * 确保 分:秒:毫秒（01:23:45) 都是两位数
 * 如果只有个位数，在前面补充 0
 */
export const formatTime = (minutes: number, seconds: number, milliseconds: number) => {
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(2, "0")}`;
};

/**
 * 将秒数（123.34）转换为 分:秒:毫秒 的字符串格式
 */
export const secondsToTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60); // 剩余的秒数
  const milliseconds = Math.floor((seconds % 1) * 100);

  return formatTime(minutes, remainingSeconds, milliseconds);
}

/**
 * 将时间字符串，转为总秒数
 */
export const timeToSeconds = (time: string) => {
  const [minutesStr, secondsStr, millisecondsStr] = time.split(":");
  const minutes = parseInt(minutesStr, 10);
  const seconds = parseInt(secondsStr, 10);
  const milliseconds = parseInt(millisecondsStr, 10);
  return minutes * 60 + seconds + milliseconds / 1000;
}

/**
 * 比较两个输入的时间字符串
 * 是否前者小于等于后者
 */
export const isTimeSmallerThan = (time1: string, time2: string) => {
  const seconds1 = timeToSeconds(time1);
  const seconds2 = timeToSeconds(time2);
  return seconds1 <= seconds2;
};
