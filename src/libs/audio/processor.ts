import { EQ_BANDS } from "./effects";

class AudioProcessor {
  private audioContext: AudioContext;
  private sourceNode: MediaElementAudioSourceNode;

  /* 效果节点 */
  private gainNode: GainNode | null = null;
  private filterNodes: BiquadFilterNode[] | null = null;

  constructor(audio: HTMLMediaElement) {
    const audioContext = new AudioContext();
    this.audioContext = audioContext;

    const sourceNode = audioContext.createMediaElementSource(audio);
    sourceNode.connect(audioContext.destination);
    this.sourceNode = sourceNode;
  }

  /**
   * 按顺序重新连接所有音频节点，确保链路的完整性
   * - sourceNode -> gainNode -> filterNodes -> ... -> destination
   * - 未来如果引入更多效果的 node，需要同步这里
   */
  private updateAudioChain() {
    this.sourceNode.disconnect();

    const allNodes: AudioNode[] = [this.sourceNode];
    if (this.gainNode) allNodes.push(this.gainNode);
    if (this.filterNodes) allNodes.push(...this.filterNodes);

    allNodes.push(this.audioContext.destination);

    for (let i = 0; i < allNodes.length - 1; i++) {
      allNodes[i].connect(allNodes[i + 1]);
    }
  }

  /**
   * @param volume 范围 0 ~ 1
   */
  public applyVolume(volume: number) {
    if (!this.gainNode) {
      this.gainNode = this.audioContext.createGain();
    }

    this.gainNode.gain.value = volume;
    this.updateAudioChain();
  }

  /**
   * @param filterGains 增益数组
   */
  public applyFilter(filterGains: number[]) {
    if (!this.filterNodes) {
      this.filterNodes = EQ_BANDS.map((band) => {
        const filter = this.audioContext.createBiquadFilter();
        filter.type = band <= 32 ? "lowshelf" : band >= 16000 ? "highshelf" : "peaking";
        filter.Q.value = 1;
        filter.frequency.value = band;
        return filter;
      });
    }

    this.filterNodes.forEach((filter, index) => {
      filter.gain.value = filterGains[index];
    });

    this.updateAudioChain();
  }

  public async getAudioBuffer() {
    const response = await fetch(this.sourceNode.mediaElement.src);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
  
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );
  
    const offlineSourceNode = offlineContext.createBufferSource();
    offlineSourceNode.buffer = audioBuffer;
  
    const allNodes: AudioNode[] = [offlineSourceNode];
    /**
     * 克隆节点，避免报错：
     * cannot connect to an AudioNode belonging to a different audio context.
     */
    if (this.gainNode) {
      const clonedGainNode = offlineContext.createGain();
      clonedGainNode.gain.value = this.gainNode.gain.value;
      allNodes.push(clonedGainNode);
    }
    if (this.filterNodes) {
      this.filterNodes.forEach((filterNode) => {
        const clonedFilter = offlineContext.createBiquadFilter();
        clonedFilter.type = filterNode.type;
        clonedFilter.Q.value = filterNode.Q.value;
        clonedFilter.frequency.value = filterNode.frequency.value;
        clonedFilter.gain.value = filterNode.gain.value;
        allNodes.push(clonedFilter);
      });
    }
  
    allNodes.push(offlineContext.destination);
  
    for (let i = 0; i < allNodes.length - 1; i++) {
      allNodes[i].connect(allNodes[i + 1]);
    }
  
    offlineSourceNode.start();
    const renderedBuffer = await offlineContext.startRendering();
    return renderedBuffer;
  }
  
  public destroy() {
    this.sourceNode.disconnect();
    this.gainNode?.disconnect();
    this.filterNodes?.forEach((node) => node.disconnect());
    this.audioContext.close();
  }
}

export default AudioProcessor;
