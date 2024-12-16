import { Button } from "tdesign-react";

interface AudioPlayButtonProps {
  isPlaying: boolean;
  togglePlay: () => void;
} 

const AudioPlayButton: React.FC<AudioPlayButtonProps> = ({ isPlaying, togglePlay }) => {
  return (
    <Button onClick={togglePlay}>
      <div className={`${isPlaying ? "i-solar:pause-bold" : "i-solar:play-bold"}`}></div>
    </Button>
  );
};

export default AudioPlayButton;
