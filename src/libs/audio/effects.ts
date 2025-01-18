export const SAMPLE_RATE = 44100 as const;

export const AUDIO_FORMAT = ["wav", "flac", "mp3", "m4a", "ogg"] as const;
export type AudioFormat = (typeof AUDIO_FORMAT)[number];

export const BIT_RATE = ["320k", "256k", "192k", "128k", "96k", "64k"] as const;
export type BitRate = (typeof BIT_RATE)[number];

export const EQ_BANDS = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
export const EQ_PRESETS: Record<string, number[]> = {
  Default: Array(EQ_BANDS.length).fill(0),
  Live: [0, 0, 0, 5, 10, 5, 0, -5, 0, 0],
  Jazz: [0, 5, 5, 8, 8, 5, 2, 0, -5, -8],
  Rock: [5, 10, 8, 5, 0, -2, -5, -10, 10, 20],
  Dance: [10, 15, 5, 10, 0, -5, -5, -10, 15, 20],
  Classical: [-5, 0, 5, 5, 10, 5, 3, 0, -3, -5]
};

export const sliceBufferByTime = (buffer: AudioBuffer, start: number, end: number) => {
  const sampleRate = buffer.sampleRate;
  const startSample = Math.max(0, Math.round(start * sampleRate));
  const endSample = Math.min(buffer.length, Math.round(end * sampleRate));

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
