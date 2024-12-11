import { Button, Dropdown } from "tdesign-react";

const ExportButton: React.FC = () => {
  const FORMAT_OPTIONS = ["wav", "mp3"];

  const handleAudioExport = async () => {};

  return (
    <>
      <div className="absolute top-10 right-40">
        <Dropdown
          hideAfterItemClick
          trigger="hover"
          options={FORMAT_OPTIONS.map((format) => ({
            content: <div text="center">{format}</div>,
            value: format
          }))}
          style={{ width: 113 }}
        >
          <Button
            theme="success"
            onClick={handleAudioExport}
          >
            <div className="flex-center font-bold">
              <div className="i-ri:folder-music-line mr-4 text-lg"></div>
              <span>Export</span>
            </div>
          </Button>
        </Dropdown>
      </div>
    </>
  );
};

export default ExportButton;
