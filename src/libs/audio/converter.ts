import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

import { type AudioFormat, type BitRate, SAMPLE_RATE } from "./effects";
import { audioBufferToWav } from "./wav";

interface AudioConverterOptions {
  format: AudioFormat;
  bitrate: BitRate;
}

class AudioConverter {
  private ffmpeg: FFmpeg;
  private audioBuffer: AudioBuffer;

  private format: AudioFormat = "wav";
  private rawData: ArrayBuffer | Uint8Array | null = null;

  // private startTime: number = 0;
  // private endTime: number = 0;

  constructor(audioBuffer: AudioBuffer) {
    this.ffmpeg = new FFmpeg();
    this.audioBuffer = audioBuffer;
  }

  private async initFFmpeg() {
    await this.ffmpeg.load({
      coreURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js"
    });
  }

  private getFormatCodec(format: AudioFormat) {
    const codecMap = {
      wav: "", // 只是为了绕过 ts 检查
      flac: "flac",
      mp3: "libmp3lame",
      m4a: "aac",
      ogg: "libvorbis"
    };
    return codecMap[format];
  }

  public async convert(options: AudioConverterOptions) {
    const { format, bitrate } = options;
    this.format = format;

    // this.startTime = performance.now();

    const rawWav = audioBufferToWav(this.audioBuffer);
    if (format === "wav") {
      this.rawData = rawWav;
      return rawWav;
    }

    await this.initFFmpeg();

    try {
      const inputName = "input.wav";
      const outputName = `output.${format}`;
      const wavBlob = new Blob([new DataView(rawWav)], { type: "audio/wav" });

      // 写入 FFmpeg 的虚拟文件系统
      const fileData = await fetchFile(wavBlob);
      await this.ffmpeg.writeFile(inputName, fileData);

      // 相关命令
      const command = [
        "-i",
        inputName,
        "-c:a",
        this.getFormatCodec(format),
        "-b:a",
        bitrate,
        "-ac",
        "2", // 通道数
        "-ar",
        SAMPLE_RATE.toString(),
        outputName
      ];
      await this.ffmpeg.exec(command);

      this.rawData = (await this.ffmpeg.readFile(outputName)) as Uint8Array;

      // 清理临时文件
      await this.ffmpeg.deleteFile(inputName);
      await this.ffmpeg.deleteFile(outputName);

      // 记录整体转换所需的时间
      // this.endTime = performance.now();
      // const duration = ((this.endTime - this.startTime) / 1000).toFixed(2);
      // console.log(`Conversion completed in ${duration} seconds`);

      return this.rawData;
    } catch (error) {
      console.error("Audio conversion failed:", error);
      throw error;
    }
  }

  public async download(name: string = "output") {
    if (!this.rawData) {
      console.error("No audio data available");
      return;
    }

    const blob = new Blob([this.rawData instanceof Uint8Array ? this.rawData : new DataView(this.rawData)], {
      type: `audio/${this.format}`
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name}.${this.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export default AudioConverter;
