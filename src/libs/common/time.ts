/**
 * 确保 分:秒:毫秒（01:23:456) 都是两位数
 * 如果位数不够，在前面补充 0
 */
export const formatTime = (minutes: number, seconds: number, milliseconds: number) => {
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(3, "0")}`;
};

/**
 * 将毫数（12345）转换为 分:秒:毫秒 的字符串格式
 */
export const millisecondsToTime = (ms: number) => {
  const remainingMs = Math.floor(ms / 1000);

  const milliseconds = ms % 1000;
  const seconds = remainingMs % 60;
  const minutes = Math.floor(remainingMs / 60);

  return formatTime(minutes, seconds, milliseconds);
};

/**
 * 将秒数（123.345）转换为 分:秒:毫秒 的字符串格式
 */
export const secondsToTime = (s: number) => {
  // 扩大倍数 -> 降低浮点数误差
  const totalMs = Math.round(s * 1000);
  const remainingMs = totalMs % 60000;

  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor(remainingMs / 1000);
  const milliseconds = remainingMs % 1000;

  return formatTime(minutes, seconds, milliseconds);
};

/**
 * 将时间字符串，转为总秒数
 */
export const timeToSeconds = (time: string) => {
  const [minutesStr, secondsStr, millisecondsStr] = time.split(":");
  const minutes = parseInt(minutesStr, 10);
  const seconds = parseInt(secondsStr, 10);
  const milliseconds = parseInt(millisecondsStr, 10);
  return minutes * 60 + seconds + milliseconds / 1000;
};

/**
 * 比较两个输入的时间字符串
 * 是否前者小于等于后者
 */
export const isTimeSmallerThan = (time1: string, time2: string) => {
  const seconds1 = timeToSeconds(time1);
  const seconds2 = timeToSeconds(time2);
  return seconds1 <= seconds2;
};
