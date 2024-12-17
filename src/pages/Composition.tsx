import { useState } from "react";

import { AudioPlayButton, AudioUploader } from "@/components/audio";
import AudioTrackControls from "@/components/audio/AudioTrackControls";
import MainContainer from "@/components/layout/MainContainer";

import useMultiTrackContext from "@/hooks/useMultiTrackContext";

const Composition = () => {
  const { containerRef, isPlaying, initMultiTrack, togglePlay } = useMultiTrackContext();
  const [audioFiles, setAudioFiles] = useState<File[] | null>();

  const handleAudioExport = (format: string) => {};

  const handleTrackInit = (files: File[]) => {
    setAudioFiles(files);
    initMultiTrack(files.map((file) => URL.createObjectURL(file)));
  };

  return (
    <MainContainer onExport={(format) => handleAudioExport(format)}>
      {!audioFiles && (
        <AudioUploader
          multiple={true}
          defaultAudio={["Do not go gentle into that good night.mp3", "Imminent.mp3"]}
          onUpload={(files) => handleTrackInit(files as File[])}
          labelHeight="h-2/3"
        />
      )}
      <div className={`${audioFiles ? "h-[85%] pt-8 flex space-x-10 overflow-y-auto" : undefined}`}>
        <div
          id="multitrack"
          ref={containerRef}
        />
      </div>
      {audioFiles && (
        <div className="flex items-center space-x-5 my-5">
          <AudioPlayButton
            isPlaying={isPlaying}
            togglePlay={togglePlay}
          />
          <AudioTrackControls />
        </div>
      )}
    </MainContainer>
  );
};

export default Composition;
