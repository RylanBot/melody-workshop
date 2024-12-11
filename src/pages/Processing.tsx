import { useState } from "react";
import { Radio } from "tdesign-react";

import { AudioCutter, AudioEqualizer, AudioPlayButton } from "@/components/audio";
import ExportButton from "@/components/layout/ExportButton";

import useWaveSurferContext from "@/hooks/useWaveSurferContext";
import { secondsToTime } from "@/libs/time";

function Processing() {
  const { waveformRef, duration, startTime, endTime, loadAudioWave } = useWaveSurferContext();
  const [audioFile, setAudioFile] = useState<File | null>();

  const TAB_LIST = [
    { id: "cutter", name: "Cutter", icon: "i-ph:scissors", component: <AudioCutter /> },
    { id: "equalizer", name: "Equalizer", icon: "i-cil:equalizer", component: <AudioEqualizer /> }
  ];
  const [activeTab, setActiveTab] = useState<string>(TAB_LIST[0].id);

  const handleWaveInit = async (file: File) => {
    setAudioFile(file);
    loadAudioWave(file);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleWaveInit(file);
    }
  };

  const loadDefaultAudio = async () => {
    const audio = "Super Mario.mp3";
    const response = await fetch(audio);
    const blob = await response.blob();
    const file = new File([blob], audio, { type: "audio/mp3" });
    handleWaveInit(file);
  };

  return (
    <div className="h-screen w-[80vw] m-auto flex-col flex-center text-green-900 dark:text-green-500">
      <div className="w-full">
        {/* 切换栏 */}
        <div className="ml-1.5 space-x-4">
          <Radio.Group
            variant="default-filled"
            defaultValue={TAB_LIST[0].id}
            onChange={(id) => setActiveTab(id as string)}
          >
            {TAB_LIST.map((tab) => (
              <Radio.Button
                key={tab.id}
                value={tab.id}
              >
                <div className="flex-center space-x-2 text-green-800 dark:text-green-300">
                  <div className={tab.icon}></div>
                  <div>{tab.name}</div>
                </div>
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        <div className="h-125 bg-green-50 border-2 border-green-600 px-10 rounded-md dark:bg-dark-600">
          {/* note: 使用 CSS 隐藏，不能直接销毁 DOM ref，否则波谱无法及时更新 */}
          <div className={!audioFile ? "hidden" : undefined}>
            <div className="h-12 my-6 flex justify-between items-center">
              <label className="flex-center hover:text-green-600 dark:hover:text-green-400">
                <strong>{audioFile?.name}</strong>
                <div className="i-solar:refresh-square-outline text-2xl ml-3"></div>
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleAudioUpload}
                />
              </label>
              <div className="text-sm italic">
                <div>
                  <strong>Original: </strong>
                  {secondsToTime(duration)}
                </div>
                <div>
                  <strong>Selected: </strong>
                  {secondsToTime(endTime - startTime)}
                </div>
              </div>
            </div>
            <div
              id="wave"
              ref={waveformRef}
              h="32"
            ></div>
          </div>

          {/* 音频上传 */}
          {!audioFile && (
            <>
              <div className="h-12 my-6 flex justify-between items-center">
                <button
                  className="flex-center text-sm italic space-x-3"
                  hover="text-green-500 font-bold"
                  onClick={loadDefaultAudio}
                >
                  <div>No local audio? Click here for the default to experience!</div>
                  <div className="i-tdesign:attach text-lg"></div>
                </button>
              </div>
              <label className="flex-center flex-col h-32 p-5 border-2 border-dashed border-green-500">
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleAudioUpload}
                />
                <div className="i-line-md:uploading-loop text-3xl mb-2"></div>
                <div className="font-bold ">Upload your audio file</div>
              </label>
            </>
          )}

          <div className="flex-between h-46 my-10">
            {/* 播放 */}
            <AudioPlayButton />
            {/* 调节组件 */}
            {TAB_LIST.map((tab) => (
              <div
                key={tab.id}
                id={tab.id}
                hidden={activeTab !== tab.id}
              >
                {tab.component}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 导出 */}
      <ExportButton />
    </div>
  );
}

export default Processing;
