interface AudioUploaderProps {
  multiple?: boolean;
  defaultAudio: string | string[];
  onUpload: (audio: File | File[]) => void;
}
const AudioUploader: React.FC<AudioUploaderProps> = ({ multiple = false, defaultAudio, onUpload }) => {
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    onUpload(multiple ? Array.from(files) : files[0]);
  };

  const loadDefaultAudio = async () => {
    const loadAudioFile = async (audioUrl: string) => {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      return new File([blob], audioUrl, { type: "audio/mp3" });
    };

    const audioUrls = Array.isArray(defaultAudio) ? defaultAudio : [defaultAudio];
    const files = await Promise.all(audioUrls.map(loadAudioFile));
    multiple ? onUpload(Array.from(files)) : onUpload(files[0]);
  };

  return (
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
          multiple={multiple}
          onChange={handleAudioUpload}
        />
        <div className="i-line-md:uploading-loop text-3xl mb-2"></div>
        <div className="font-bold ">Upload your audio file${multiple && "s"}</div>
      </label>
    </>
  );
};

export default AudioUploader;
