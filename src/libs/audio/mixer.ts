import { SAMPLE_RATE } from "./effects";

export interface Track {
  url: string;
  position: number;
  volume: number;
}

interface LoadedTrack {
  track: Track;
  audioBuffer: AudioBuffer;
}

class AudioMixer {
  private offlineContext: OfflineAudioContext | null = null;
  private tracks: Track[];
  private loadedTracks: LoadedTrack[] = [];

  constructor(tracks: Track[]) {
    this.tracks = tracks;
  }

  private async loadAllTracks() {
    const loadTrack = async (track: Track) => {
      const response = await fetch(track.url);
      const arrayBuffer = await response.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      return { track, audioBuffer };
    };

    this.loadedTracks = await Promise.all(this.tracks.map((track) => loadTrack(track)));

    const totalDuration = this.loadedTracks.reduce(
      (maxDuration, { track, audioBuffer }) => Math.max(maxDuration, track.position + audioBuffer.duration),
      0
    );

    this.offlineContext = new OfflineAudioContext(2, Math.ceil(SAMPLE_RATE * totalDuration), SAMPLE_RATE);
  }

  private mixAllTracks() {
    this.loadedTracks.forEach(({ track, audioBuffer }) => {
      const source = this.offlineContext!.createBufferSource();
      source.buffer = audioBuffer;

      const gainNode = this.offlineContext!.createGain();
      gainNode.gain.value = track.volume;

      source.connect(gainNode).connect(this.offlineContext!.destination);
      source.start(track.position);
    });
  }

  public async getAudioBuffer() {
    await this.loadAllTracks();

    if (!this.offlineContext) {
      throw new Error("Tracks not initialized.");
    }

    this.mixAllTracks();

    return await this.offlineContext.startRendering();
  }
}

export default AudioMixer;
