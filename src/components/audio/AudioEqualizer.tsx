import { useState } from "react";
import { Select, Slider } from "tdesign-react";

import useWaveSurferContext from "@/hooks/useWaveSurferContext";

const EQ_BANDS = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
const EQ_PRESETS = ["Default", "Dance", "Live"];

const AudioEqualizer: React.FC = () => {
  const { audioContextRef, audioSourceRef } = useWaveSurferContext();
  const [activePreset, setActivePreset] = useState<string>(EQ_PRESETS[0]);
  const [filterGains, setFilterGains] = useState<number[]>(Array(EQ_BANDS.length).fill(0));

  const handleFilterGainChange = (index: number, value: number) => {
    const newFilterGains = [...filterGains];
    newFilterGains[index] = value;
    setFilterGains(newFilterGains);

    if (!audioContextRef || !audioSourceRef) return;

    const filters = EQ_BANDS.map((band) => {
      const filter = audioContextRef.current!.createBiquadFilter();
      filter.type = band <= 32 ? "lowshelf" : band >= 16000 ? "highshelf" : "peaking";
      filter.gain.value = filterGains[EQ_BANDS.indexOf(band)];
      filter.Q.value = 1;
      filter.frequency.value = band;
      return filter;
    });

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
