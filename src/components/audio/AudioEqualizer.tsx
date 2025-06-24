import { useState } from "react";
import { Select, Slider } from "tdesign-react";

import useWaveSurferContext from "@/hooks/useWaveSurferContext";
import { EQ_BANDS, EQ_PRESETS } from "@/libs/audio/effects";

const AudioEqualizer: React.FC = () => {
  const { processorRef } = useWaveSurferContext();

  const [filterGains, setFilterGains] = useState<number[]>(Array(EQ_BANDS.length).fill(0));
  const [activePreset, setActivePreset] = useState<string>(Object.keys(EQ_PRESETS)[0]);

  const handleFilterGainChange = (index: number, value: number) => {
    if (!processorRef.current) return;
    const newFilterGains = [...filterGains];
    newFilterGains[index] = value;
    setFilterGains(newFilterGains);
    processorRef.current.applyFilter(newFilterGains);
  };

  const handlePresetChange = (preset: string) => {
    if (!processorRef.current) return;
    setActivePreset(preset);
    const presetGains = EQ_PRESETS[preset];
    setFilterGains(presetGains);
    processorRef.current.applyFilter(presetGains);
  };

  return (
    <>
      <div className="flex-end my-8 w-full">
        <div className="flex-center space-x-1">
          <strong m="r-3">Preset</strong>
          <Select
            style={{ width: "125px" }}
            value={activePreset}
            options={Object.keys(EQ_PRESETS).map((item) => ({ label: item, value: item }))}
            disabled={!processorRef.current}
            onChange={(preset) => handlePresetChange(preset as string)}
          />
        </div>
      </div>

      <div
        className="flex-center h-32 space-x-6"
        max-lg="space-x-2"
      >
        {filterGains.map((gain, index) => (
          <div
            key={index}
            className="w-15 h-full flex-center flex-col"
          >
            <Slider
              layout="vertical"
              value={gain}
              min={-40}
              max={40}
              disabled={!processorRef.current}
              onChange={(value) => handleFilterGainChange(index, value as number)}
            />
            <div className="mt-1.5 text-xs italic">
              {EQ_BANDS[index]}
              <span max-lg="hidden"> Hz</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AudioEqualizer;
