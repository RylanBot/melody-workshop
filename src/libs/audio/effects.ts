export const EQ_BANDS = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
export const EQ_PRESETS = ["Default", "Dance", "Live"];

export const sliceBufferByTime = (buffer: AudioBuffer, start: number, end: number): AudioBuffer => {
  const sampleRate = buffer.sampleRate;
  const startSample = Math.max(0, Math.floor(start * sampleRate));
  const endSample = Math.min(buffer.length, Math.floor(end * sampleRate));

  const slicedBuffer = new AudioBuffer({
    length: endSample - startSample,
    numberOfChannels: buffer.numberOfChannels,
    sampleRate: buffer.sampleRate
  });

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    const origData = buffer.getChannelData(i);
    const slicedData = slicedBuffer.getChannelData(i);
    slicedData.set(origData.subarray(startSample, endSample));
  }

  return slicedBuffer;
};
