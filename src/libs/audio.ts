export const EQ_BANDS = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
export const EQ_PRESETS = ["Default", "Dance", "Live"];

export const createFilters = (audioContext: AudioContext | OfflineAudioContext, filterGains: number[]) => {
  const filters = EQ_BANDS.map((band, index) => {
    const filter = audioContext.createBiquadFilter();
    filter.type = band <= 32 ? "lowshelf" : band >= 16000 ? "highshelf" : "peaking";
    filter.gain.value = filterGains[index];
    filter.Q.value = 1;
    filter.frequency.value = band;
    return filter;
  });

  return filters;
};

export const createFilterBuffer = async (file: File, filterGains: number[]) => {
  const response = await fetch(URL.createObjectURL(file));
  const arrayBuffer = await response.arrayBuffer();
  const sourceBuffer = await new AudioContext().decodeAudioData(arrayBuffer);

  const offlineContext = new OfflineAudioContext(
    sourceBuffer.numberOfChannels,
    sourceBuffer.length,
    sourceBuffer.sampleRate
  );

  const offlineSource = offlineContext.createBufferSource();
  offlineSource.buffer = sourceBuffer;

  const filters = createFilters(offlineContext, filterGains);

  for (let i = 0; i < filters.length - 1; i++) {
    filters[i].connect(filters[i + 1]);
  }
  filters[filters.length - 1].connect(offlineContext.destination);
  offlineSource.connect(filters[0]);

  offlineSource.start();
  const renderedBuffer = await offlineContext.startRendering();
  return renderedBuffer;
};

export const sliceBufferByTime = (audioBuffer: AudioBuffer, startTime: number, endTime: number): AudioBuffer => {
  const sampleRate = audioBuffer.sampleRate;
  const startSample = Math.max(0, Math.floor(startTime * sampleRate));
  const endSample = Math.min(audioBuffer.length, Math.floor(endTime * sampleRate));

  const slicedBuffer = new AudioBuffer({
    length: endSample - startSample,
    numberOfChannels: audioBuffer.numberOfChannels,
    sampleRate: audioBuffer.sampleRate
  });

  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    const origData = audioBuffer.getChannelData(i);
    const slicedData = slicedBuffer.getChannelData(i);
    slicedData.set(origData.subarray(startSample, endSample));
  }

  return slicedBuffer;
};
