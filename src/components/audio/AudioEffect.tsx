import { Select } from "tdesign-react";

const AudioEffect: React.FC = () => {
  return (
    <div className="flex items-center">
      <strong className="w-23">Effect: </strong>
      <Select
        options={[]}
        style={{ width: "300px" }}
      />
    </div>
  );
};

export default AudioEffect;
