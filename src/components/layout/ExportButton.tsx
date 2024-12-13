import { Button, Dropdown } from "tdesign-react";

import useWaveSurferContext from "@/hooks/useWaveSurferContext";
import { createFilters, sliceBufferByTime } from "@/libs/audio";
import { downloadFile } from "@/libs/toolkit";
import { audioBufferToWav } from "@/libs/wav";

const ExportButton: React.FC = () => {
  const FORMAT_OPTIONS = ["wav", "mp3"];

  const { waveSurferRef, audioContextRef, startTime, endTime, filterGains } = useWaveSurferContext();

  const createBufferWithFilters = async () => {
    const audioEl = waveSurferRef.current?.getMediaElement()!;

    const response = await fetch(audioEl.src);
    const arrayBuffer = await response.arrayBuffer();
    const sourceBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);

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

  const handleAudioExport = async () => {
    if (!waveSurferRef) return;

    let audioBuffer = await createBufferWithFilters();
    audioBuffer = sliceBufferByTime(audioBuffer, startTime, endTime);

    const wav = audioBufferToWav(audioBuffer);
    const blob = new Blob([new DataView(wav)], {
      type: "audio/wav"
    });
    downloadFile(blob, "output.wav");
  };

  return (
    <>
      <div className="absolute top-10 right-40">
        <Dropdown
          hideAfterItemClick
          trigger="hover"
          options={FORMAT_OPTIONS.map((format) => ({
            content: <div text="center">{format}</div>,
            value: format
          }))}
          style={{ width: 113 }}
        >
          <Button
            theme="success"
            onClick={handleAudioExport}
          >
            <div className="flex-center font-bold">
              <div className="i-ri:folder-music-line mr-4 text-lg"></div>
              <span>Export</span>
            </div>
          </Button>
        </Dropdown>
      </div>
    </>
  );
};

export default ExportButton;
