import { useState } from "react";
import { Button, Dialog, Radio } from "tdesign-react";

import { AUDIO_FORMAT, BIT_RATE, type AudioFormat, type BitRate } from "@/libs/audio/effects";

interface AudioExportDialogProps {
  disable: boolean;
  onExport: (format: AudioFormat, rate: BitRate) => void;
}

const AudioExportDialog: React.FC<AudioExportDialogProps> = ({ disable, onExport }) => {
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [activeFormat, setActiveFormat] = useState<AudioFormat>(AUDIO_FORMAT[0]);
  const [activeRate, setActiveRate] = useState<BitRate>(BIT_RATE[0]);

  // 无损类型
  const rateDisabled = activeFormat === "wav" || activeFormat === "flac";

  return (
    <>
      <button
        disabled={disable}
        className="h-9 w-30 text-white bg-green-700 dark:bg-green-800 border-2 border-green-600 border-b-none"
      >
        <div
          className="relative flex-center font-bold"
          onClick={() => setDialogVisible(true)}
        >
          <div className="i-ri:folder-music-line mr-4 text-lg"></div>
          <span>Export</span>
        </div>
      </button>
      <Dialog
        placement="center"
        width="600px"
        confirmBtn={null}
        cancelBtn={null}
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
      >
        <div className="text-base space-y-10">
          <div>
            <div className="font-bold mb-3">Format</div>
            <div className="flex space-x-5">
              <Radio.Group
                variant="default-filled"
                value={activeFormat}
                onChange={(value) => setActiveFormat(value as AudioFormat)}
                options={AUDIO_FORMAT.map((format) => ({ value: format, label: format }))}
              />
            </div>
          </div>

          <div className="h-24">
            <div className="font-bold mb-3">
              Bit Rate
              {!rateDisabled && <span className="text-sm text-stone-400 ml-2">(Higher quality, Larger file)</span>}
            </div>
            <div>
              {rateDisabled ? (
                <div className="text-sm text-stone-400 italic font-bold">Not available for this format</div>
              ) : (
                <div
                  className="flex space-x-6"
                  max-lg="space-x-4 mt-6"
                >
                  {BIT_RATE.map((rate) => (
                    <Radio
                      key={rate}
                      value={rate}
                      checked={activeRate === rate}
                      disabled={rateDisabled}
                      onChange={() => setActiveRate(rate)}
                      className="flex-center max-lg:flex-col"
                    >
                      <div max-lg="my-1">{rate}</div>
                    </Radio>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Button
            className="float-right"
            onClick={() => onExport(activeFormat, activeRate)}
          >
            <div className="flex-center">
              <div className="i-ri:download-2-line mr-3"></div>
              <div className="italic">Start</div>
            </div>
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default AudioExportDialog;
