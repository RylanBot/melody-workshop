import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import MultiTrack from "wavesurfer-multitrack";

import { TRACK_OPTIONS } from "@/libs/config";

type Track = {
  id: number;
  url: string;
  name: string;
  position: number;
  volume: number;
};

interface MultiTrackContextType {
  containerRef: React.RefObject<HTMLDivElement>;
  tracks: Track[];
  isPlaying: boolean;
  activeId: number;
  togglePlay: () => void;
  addTracks: (file: { url: string; name: string }[]) => void;
  deleteTrack: () => void;
  setTrackVolume: (volume: number) => void;
}

const MultiTrackContext = createContext<MultiTrackContextType | null>(null);

const useMultiTrackContext = () => {
  const context = useContext(MultiTrackContext);
  if (!context) {
    throw new Error("This Context must be inside MultiTrackProvider");
  }
  return context;
};

export const MultiTrackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const multiTrackRef = useRef<MultiTrack | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [tracks, setTracks] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeId, setActiveId] = useState<number>(0);

  const createMultiTrack = (newTracks: Track[]) => {
    if (!containerRef.current) return;
    cleanUpResource();

    const tracksConfig = newTracks.map((track) => ({
      id: track.id,
      url: track.url,
      startPosition: track.position,
      ...TRACK_OPTIONS
    }));

    multiTrackRef.current = MultiTrack.create(tracksConfig, {
      container: containerRef.current,
      cursorColor: "#0a9528",
      cursorWidth: 1.5,
      dragBounds: true,
      timelineOptions: {
        insertPosition: "beforebegin"
      }
    });

    multiTrackRef.current.on("start-position-change", ({ id, startPosition }) => {
      const numericId = id as number;
      setTracks((prev) =>
        prev.map((track) => (track.id === numericId ? { ...track, position: startPosition } : track))
      );
    });

    const parentDiv = containerRef.current?.querySelector("#multitrack > div > div");
    if (parentDiv) {
      const children = Array.from(parentDiv.children) as HTMLElement[];
      // 第 0 个是 timeline，第 1 个是 cursor
      children[1].classList.add("active");
    }
  };

  const addTracks = (files: { url: string; name: string }[]) => {
    const newTracks = [
      ...tracks,
      ...files.map((file, index) => ({
        id: tracks.length + index,
        url: file.url,
        name: file.name,
        position: 0,
        volume: 1
      }))
    ];

    setTracks(newTracks);
    createMultiTrack(newTracks);
  };

  const deleteTrack = () => {
    const newTracks = tracks.filter((track) => track.id !== activeId);
    setTracks(newTracks);
    setActiveId(0);
    createMultiTrack(newTracks);
  };

  const togglePlay = () => {
    if (multiTrackRef.current) {
      multiTrackRef.current.isPlaying() ? multiTrackRef.current.pause() : multiTrackRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const setTrackVolume = (volume: number) => {
    if (multiTrackRef.current) {
      multiTrackRef.current.setTrackVolume(activeId, volume);
      setTracks((prev) => prev.map((track) => (track.id === activeId ? { ...track, volume } : track)));
    }
  };

  const cleanUpResource = () => {
    setIsPlaying(false);
    if (multiTrackRef.current) {
      multiTrackRef.current.destroy();
      multiTrackRef.current = null;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const clickedDiv = target.closest("#multitrack > div > div > div") as HTMLElement | null;
      const parentDiv = clickedDiv?.parentElement;
      if (parentDiv) {
        const children = Array.from(parentDiv.children) as HTMLElement[];
        children.forEach((child) => child.classList.remove("active"));
        clickedDiv.classList.add("active");

        const index = children.indexOf(clickedDiv) - 2;
        setActiveId(index);

        multiTrackRef.current?.pause();
        setIsPlaying(false);
      }
    };

    containerRef.current.addEventListener("click", handleClick);
    return () => {
      containerRef.current?.removeEventListener("click", handleClick);
      cleanUpResource();
      setTracks([]);
    };
  }, []);

  useEffect(() => {
    if (!multiTrackRef.current) return;

    // 没有监听音频结束的 API -> 通过获取滚动条的位置判断
    const cursorDiv = document.querySelector("#multitrack > div > div > div") as HTMLElement;
    if (!cursorDiv) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          const left = cursorDiv.style.left;
          if (left === "100%") {
            setIsPlaying(false);
          }
        }
      });
    });

    observer.observe(cursorDiv, {
      attributes: true,
      attributeFilter: ["style"]
    });

    return () => {
      observer.disconnect();
    };
  }, [multiTrackRef.current]);

  return (
    <MultiTrackContext.Provider
      value={{
        containerRef,
        tracks,
        isPlaying,
        activeId,
        togglePlay,
        addTracks,
        deleteTrack,
        setTrackVolume
      }}
    >
      {children}
    </MultiTrackContext.Provider>
  );
};

export default useMultiTrackContext;
