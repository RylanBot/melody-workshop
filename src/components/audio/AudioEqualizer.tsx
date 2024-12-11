import { useState } from "react";
import { Select, Slider } from "tdesign-react";

const EQ_BANDS = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
const EQ_PRESETS = ["Default", "Dance", "Live"];

const AudioEqualizer: React.FC = () => {
  const [activePreset, setActivePreset] = useState<string>(EQ_PRESETS[0]);
  const [filterGains, setFilterGains] = useState<number[]>(Array(EQ_BANDS.length).fill(0));

  const handleFilterGainChange = (index: number, value: number) => {
    const newFilterGains = [...filterGains];
    newFilterGains[index] = value;
    setFilterGains(newFilterGains);
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
