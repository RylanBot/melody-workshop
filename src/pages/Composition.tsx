import { Button, Slider } from "tdesign-react";

import { AudioPlayButton, AudioUploader } from "@/components/audio";
import MainContainer from "@/components/layout/MainContainer";
import useMultiTrackContext from "@/hooks/useMultiTrackContext";

const Composition = () => {
  const { containerRef, tracks, isPlaying, activeId, togglePlay, addTracks, deleteTrack, setTrackVolume } =
    useMultiTrackContext();

  const handleAddTracks = (files: File[]) => {
    if (files.length === 0) return;

    const newTracks = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));
    addTracks(newTracks);
  };

  const handleAudioExport = (format: string) => {};

  return (
    <MainContainer onExport={(format) => handleAudioExport(format)}>
      {tracks.length === 0 && (
        <AudioUploader
          multiple={true}
          defaultAudio={["Do not go gentle into that good night.mp3", "Imminent.mp3"]}
          onUpload={(files) => handleAddTracks(files as File[])}
          labelHeight="h-2/3"
        />
      )}
      <div className={`${tracks.length > 0 ? "h-[72%] mt-8" : undefined}`}>
        <div
          id="multitrack"
          ref={containerRef}
          className="h-full"
        />
      </div>
      {tracks.length > 0 && (
        <>
          <div className="flex justify-end text-sm italic my-3">
            <div className="truncate">{tracks[activeId]?.name}</div>
          </div>
          <div className="flex-between">
            <div className="flex items-center space-x-5">
              <AudioPlayButton
                isPlaying={isPlaying}
                togglePlay={togglePlay}
              />
              {/* 新增音轨 */}
              <label className="bg-td-brand dark:bg-td-brand-dark text-white px-4 py-1 rounded-sm">
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  multiple={true}
                  onChange={(event) => {
                    handleAddTracks([...(event.target.files || [])]);
                    event.target.value = "";
                  }}
                />
                <div className="flex-center">
                  <div className="i-material-symbols:add-circle mr-2 text-lg"></div>
                  <div font="bold">Add Tracks</div>
                </div>
              </label>
            </div>
            <div className="flex-center space-x-3">
              {/* 删除音轨 */}
              <Button
                theme="primary"
                variant="outline"
                icon={<div className="i-solar:trash-bin-trash-outline mr-2 text-lg"></div>}
                onClick={deleteTrack}
              >
                <span font="bold">Delete</span>
              </Button>
              {/* 调节音量 */}
              <div className="w-46 flex-center bg-white dark:bg-dark-500 border-1 border-green-500 rounded-sm py-1 pl-4 pr-6">
                <div className="i-tdesign:sound mr-4 text-xl text-green-500"></div>
                <Slider
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={tracks[activeId].volume}
                  onChange={(value) => setTrackVolume(value as number)}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </MainContainer>
  );
};

export default Composition;
