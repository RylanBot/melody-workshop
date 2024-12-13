import { useState } from "react";
import { Select, Slider } from "tdesign-react";

import useWaveSurferContext from "@/hooks/useWaveSurferContext";
import { EQ_BANDS, EQ_PRESETS, createFilters } from "@/libs/audio";

const AudioEqualizer: React.FC = () => {
  const { audioContextRef, audioSourceRef, filterGains, setFilterGains } = useWaveSurferContext();
  const [activePreset, setActivePreset] = useState<string>(EQ_PRESETS[0]);

  const handleFilterGainChange = (index: number, value: number) => {
    if (!audioContextRef) return;

    // note: 避免滤波器不断叠加
    if (audioSourceRef.current) {
      audioSourceRef.current.disconnect();
    }

    const newFilterGains = [...filterGains];
    newFilterGains[index] = value;
    setFilterGains(newFilterGains);

    const filters = createFilters(audioContextRef.current!, newFilterGains);
    for (let i = 0; i < filters.length - 1; i++) {
      filters[i].connect(filters[i + 1]);
    }
    filters[filters.length - 1].connect(audioContextRef.current!.destination);

    audioSourceRef.current!.connect(filters[0]);
  };

  return (
    <div>
      <div className="flex justify-end items-center mb-8">
        <strong m="r-3">Preset: </strong>
        <Select
          autoWidth={true}
          options={EQ_PRESETS.map((item) => ({ label: item, value: item }))}
          value={activePreset}
          onChange={(value) => setActivePreset(value as string)}
          style={{ width: "25%" }}
        />
      </div>

      <div className="flex h-32 space-x-6">
        {filterGains.map((gain, index) => (
          <div
            key={index}
            className="w-14 flex-center flex-col"
          >
            <Slider
              layout="vertical"
              value={gain}
              min={-40}
              max={40}
              disabled={!audioContextRef.current}
              onChange={(value) => handleFilterGainChange(index, value as number)}
            />
            <div className="mt-1.5 text-xs italic">{EQ_BANDS[index]} Hz</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioEqualizer;
