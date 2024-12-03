import { Slider } from "tdesign-react";

const AudioModifier: React.FC = () => {
  return (
    <>
      {/* 音量 */}
      <div className="flex justify-end items-center">
        <strong className="w-22 mr-4">Volume: </strong>
        <Slider></Slider>
      </div>
      {/* 速度 */}
      <div className="flex justify-end items-center">
        <strong className="w-22 mr-4">Speed: </strong>
        <Slider></Slider>
      </div>
      {/* 音高 */}
      <div className="flex justify-end items-center">
        <strong className="w-22 mr-4">Pitch: </strong>
        <Slider></Slider>
      </div>
    </>
  );
};

export default AudioModifier;
