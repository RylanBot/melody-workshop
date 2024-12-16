import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin, { Region } from "wavesurfer.js/dist/plugins/regions.esm.js";

import { EQ_BANDS } from "@/libs/audio";
import { WAVE_OPTIONS } from "@/libs/config";

interface WaveSurferContextType {
  waveSurferRef: React.RefObject<WaveSurfer | null>;
  containerRef: React.RefObject<HTMLDivElement>;
  audioContextRef: React.RefObject<AudioContext | null>;
  audioSourceRef: React.RefObject<MediaElementAudioSourceNode | null>;
  isPlaying: boolean;
  /**
   * 以下三个时间变量
   * 单位 - 秒（s），保留两位小数
   */
  duration: number;
  startTime: number;
  endTime: number;
  filterGains: number[];
  initWaveform: (audioElement: HTMLAudioElement) => void;
  togglePlay: () => void;
  setStartTime: (time: number) => void;
  setEndTime: (time: number) => void;
  setFilterGains: (gains: number[]) => void;
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

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  // 加工数据
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [filterGains, setFilterGains] = useState<number[]>(Array(EQ_BANDS.length).fill(0));

  const syncRegionTime = (region: Region) => {
    setStartTime(Number(region.start.toFixed(2)));
    setEndTime(Number(region.end.toFixed(2)));
  };

  const initWaveform = (audioElement: HTMLAudioElement) => {
    if (!containerRef.current) return;

    if (waveSurferRef.current) {
      // 避免创建多个轨道
      waveSurferRef.current.destroy();
      regionsRef.current?.destroy();
    }

    regionsRef.current = RegionsPlugin.create();

    waveSurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      media: audioElement,
      plugins: [regionsRef.current],
      ...WAVE_OPTIONS
    });

    /* 波谱相关事件 */
    waveSurferRef.current.on("ready", () => {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(waveSurferRef!.current!.getMediaElement());
      source.connect(audioContext.destination);
      audioContextRef.current = audioContext;
      audioSourceRef.current = source;
    });

    waveSurferRef.current.on("decode", () => {
      const audioDuration = waveSurferRef.current!.getDuration();
      setDuration(Number(audioDuration.toFixed(2)));

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
    regionsRef.current.on("region-update", (region) => syncRegionTime(region));
  };

  const togglePlay = () => {
    if (waveSurferRef.current) {
      waveSurferRef.current.playPause();
    }
  };

  const resetOptions = () => {
    setStartTime(0);
    setEndTime(0);
  };

  useEffect(() => {
    return () => {
      resetOptions();
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
        waveSurferRef.current = null;
      }
      if (regionsRef.current) {
        regionsRef.current.destroy();
        regionsRef.current = null;
      }
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
        waveSurferRef,
        containerRef,
        audioContextRef,
        audioSourceRef,
        isPlaying,
        duration,
        startTime,
        endTime,
        filterGains,
        initWaveform,
        togglePlay,
        setStartTime,
        setEndTime,
        setFilterGains
      }}
    >
      {children}
    </WaveSurferContext.Provider>
  );
};

export default useWaveSurferContext;
