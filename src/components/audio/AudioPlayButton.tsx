import { Button } from "tdesign-react";

interface AudioPlayButtonProps {
  isPlaying: boolean;
  togglePlay: () => void;
  replay: () => void;
}

const AudioPlayButton: React.FC<AudioPlayButtonProps> = ({ isPlaying, togglePlay, replay }) => {
  return (
    <div className="space-x-5">
      <Button onClick={togglePlay}>
        <div className={`${isPlaying ? "i-solar:pause-bold" : "i-solar:play-bold"}`}></div>
      </Button>
      <Button onClick={replay}>
        <div className="i-icon-park-solid:replay-music text-lg"></div>
      </Button>
    </div>
  );
};

export default AudioPlayButton;
