import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin, { Region } from "wavesurfer.js/dist/plugins/regions.esm.js";

import AudioProcessor from "@/libs/audio/processor";
import { WAVE_OPTIONS } from "@/libs/common/config";

interface WaveSurferContextType {
  containerRef: React.RefObject<HTMLDivElement>;
  processorRef: React.RefObject<AudioProcessor | null>;
  isPlaying: boolean;
  duration: number;
  startTime: number;
  endTime: number;
  initTrack: (audio: HTMLAudioElement) => void;
  togglePlay: () => void;
  setStartTime: (time: number) => void;
  setEndTime: (time: number) => void;
}

const WaveSurferContext = createContext<WaveSurferContextType | null>(null);

const useWaveSurferContext = () => {
  const context = useContext(WaveSurferContext);
  if (!context) {
    throw new Error("This Context must be inside WaveSurferProvider");
  }
  return context;
};

export const WaveSurferProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const regionsRef = useRef<RegionsPlugin | null>(null);

  const processorRef = useRef<AudioProcessor | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  /* 时间单位 - 秒（s），保留三位小数 */
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  const syncRegionTime = (region: Region) => {
    setStartTime(Number(region.start.toFixed(3)));
    setEndTime(Number(region.end.toFixed(3)));
  };

  const initWaveform = (audioElement: HTMLAudioElement) => {
    if (!containerRef.current) return;
    cleanUpResource();

    regionsRef.current = RegionsPlugin.create();

    waveSurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      media: audioElement,
      plugins: [regionsRef.current],
      ...WAVE_OPTIONS
    });

    /* 波谱相关事件 */
    waveSurferRef.current.on("ready", () => {
      processorRef.current = new AudioProcessor(waveSurferRef!.current!.getMediaElement());
    });

    waveSurferRef.current.on("decode", () => {
      const audioDuration = waveSurferRef.current!.getDuration();
      setDuration(Number(audioDuration.toFixed(3)));

      regionsRef.current!.addRegion({
        start: 0,
        end: audioDuration / 2
      });
    });

    waveSurferRef.current.on("play", () => setIsPlaying(true));
    waveSurferRef.current.on("pause", () => setIsPlaying(false));
    waveSurferRef.current.on("click", () => waveSurferRef.current!.pause());

    waveSurferRef.current.on("timeupdate", () => {
      // 只播放选中部分
      const currentTime = waveSurferRef.current!.getCurrentTime();
      const region = regionsRef.current?.getRegions()[0];
      // note: 不能直接和 endTime 比较，监听器引用的可能不是实时值
      if (region && currentTime >= region.end) {
        waveSurferRef!.current!.pause();
      }
    });

    /* 选区相关事件 */
    regionsRef.current.on("region-created", (region) => syncRegionTime(region));
    regionsRef.current.on("region-updated", (region) => syncRegionTime(region));
  };

  const togglePlay = () => {
    if (waveSurferRef.current) {
      waveSurferRef.current.playPause();
    }
  };

  const cleanUpResource = () => {
    setStartTime(0);
    setEndTime(0);
    if (waveSurferRef.current) {
      waveSurferRef.current.destroy();
      waveSurferRef.current = null;
    }
    if (regionsRef.current) {
      regionsRef.current.destroy();
      regionsRef.current = null;
}
    if (processorRef.current) {
      processorRef.current.destroy();
      processorRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      cleanUpResource();
    };
  }, []);

  useEffect(() => {
    // 同步外界 input 的修改
    const region = regionsRef?.current?.getRegions()[0];
    if (region && startTime < endTime) {
      region.setOptions({
        start: startTime,
        end: endTime
      });
    }
  }, [startTime, endTime]);

  return (
    <WaveSurferContext.Provider
      value={{
        containerRef,
        processorRef,
        isPlaying,
        duration,
        startTime,
        endTime,
        initTrack: initWaveform,
        togglePlay,
        setStartTime,
        setEndTime
      }}
    >
      {children}
    </WaveSurferContext.Provider>
  );
}

export default useWaveSurferContext;
