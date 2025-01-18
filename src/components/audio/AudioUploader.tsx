interface AudioUploaderProps {
  multiple?: boolean;
  defaultAudio: string | string[];
  onUpload: (audio: File | File[]) => void;
  labelHeight?: string; // 对应 UnoCSS 的 h-xx 写法
}

const AudioUploader: React.FC<AudioUploaderProps> = ({
  multiple = false,
  defaultAudio,
  onUpload,
  labelHeight = "h-32"
}) => {
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    onUpload(multiple ? Array.from(files) : files[0]);
  };

  const loadDefaultAudio = async () => {
    const loadAudioFile = async (audioUrl: string) => {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const fileName = decodeURIComponent(
        new URL(audioUrl, window.location.href).pathname.split("/").pop() || audioUrl
      );
      return new File([blob], fileName, { type: "audio/mp3" });
    };

    const audioUrls = Array.isArray(defaultAudio) ? defaultAudio : [defaultAudio];
    const files = await Promise.all(audioUrls.map(loadAudioFile));
    multiple ? onUpload(Array.from(files)) : onUpload(files[0]);
  };

  return (
    <>
      <div
        className="h-12 my-6 flex justify-between items-center"
        max-sm="my-3"
      >
        <button
          className="flex-center text-sm italic space-x-3"
          hover="text-green-500 font-bold"
          max-sm="text-xs"
          onClick={loadDefaultAudio}
        >
          <div>No local audio? Try the default here!</div>
        </button>
      </div>
      <label className={`${labelHeight} flex-center flex-col p-5 border-2 border-dashed border-green-500`}>
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          multiple={multiple}
          onChange={handleAudioUpload}
        />
        <div className="i-line-md:uploading-loop text-3xl mb-2"></div>
        <div className="font-bold max-sm:text-sm">Upload your audio file{multiple && "s"}</div>
      </label>
    </>
  );
};

export default AudioUploader;
