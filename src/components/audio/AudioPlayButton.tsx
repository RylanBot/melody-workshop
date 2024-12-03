import { Button } from "tdesign-react";
import useWaveSurferContext from "@/hooks/useWaveSurferContext";

const AudioPlayButton: React.FC = () => {
  const { isPlaying, togglePlay } = useWaveSurferContext();

  return (
    <Button
      size="large"
      shape="circle"
      onClick={togglePlay}
    >
      <div className={`${isPlaying ? "i-solar:pause-bold" : "i-solar:play-bold"}`}></div>
    </Button>
  );
};

export default AudioPlayButton;
