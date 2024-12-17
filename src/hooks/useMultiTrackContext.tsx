import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import MultiTrack from "wavesurfer-multitrack";

import { WAVE_OPTIONS } from "@/libs/config";

interface MultiTrackContextType {
  multiTrackRef: React.RefObject<MultiTrack | null>;
  containerRef: React.RefObject<HTMLDivElement>;
  isPlaying: boolean;
  initMultiTrack: (fileUrls: string[]) => void;
  togglePlay: () => void;
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

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(1);

  const togglePlay = () => {
    if (multiTrackRef.current) {
      multiTrackRef.current.isPlaying() ? multiTrackRef.current.pause() : multiTrackRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const initMultiTrack = (fileUrls: string[]) => {
    if (!containerRef.current) return;

    const tracks = fileUrls.map((url, index) => ({
      id: index + 1,
      url,
      startPosition: 0,
      draggable: true,
      options: {
        ...WAVE_OPTIONS,
        height: 70
      }
    }));

    const multiTrack = MultiTrack.create(tracks, {
      container: containerRef.current,
      cursorColor: "#0a9528",
      cursorWidth: 1.5
    });
    multiTrackRef.current = multiTrack;

    // 默认将第一个设为选中状态
    const parentDiv = containerRef.current.querySelector("#multitrack > div > div");
    if (parentDiv) {
      const children = Array.from(parentDiv.children) as HTMLElement[];
      // 第 0 个 div 是 cursor，不是音轨
      children[1].classList.add("active");
    }
    // 获取点击的子音轨
    containerRef.current.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const clickedDiv = target.closest("#multitrack > div > div > div") as HTMLElement | null;
      const parentDiv = clickedDiv?.parentElement;
      if (parentDiv) {
        const children = Array.from(parentDiv.children) as HTMLElement[];
        children.forEach((child) => child.classList.remove("active"));
        clickedDiv.classList.add("active");

        const index = children.indexOf(clickedDiv);
        setActiveIndex(index);
      }
    });
  };

  useEffect(() => {
    return () => {
      if (multiTrackRef.current) {
        multiTrackRef.current.destroy();
        multiTrackRef.current = null;
      }
    };
  }, []);

  return (
    <MultiTrackContext.Provider
      value={{
        multiTrackRef,
        containerRef,
        isPlaying,
        initMultiTrack,
        togglePlay
      }}
    >
      {children}
    </MultiTrackContext.Provider>
  );
};

export default useMultiTrackContext;
