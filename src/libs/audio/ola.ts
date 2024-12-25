/**
 * ----------------------------------------
 * 算法源码参考
 * @see https://github.com/echo66/OLA-TS.js
 * ----------------------------------------
 */

type WindowFunc = (length: number, index: number, beta: number) => number;

const WindowFunctions: Record<string, WindowFunc> = {
  Lanczos: (length, index, beta) => {
    const x = (2 * index) / (length - 1) - 1;
    return Math.pow(Math.sin(Math.PI * x) / (Math.PI * x), beta);
  },

  Triangular: (length, index, beta) => {
    return Math.pow((2 / length) * (length / 2 - Math.abs(index - (length - 1) / 2)), beta);
  },

  Bartlett: (length, index, beta) => {
    return Math.pow((2 / (length - 1)) * ((length - 1) / 2 - Math.abs(index - (length - 1) / 2)), beta);
  },

  BartlettHann: (length, index, beta) => {
    return Math.pow(
      0.62 - 0.48 * Math.abs(index / (length - 1) - 0.5) - 0.38 * Math.cos((2 * Math.PI * index) / (length - 1)),
      beta
    );
  },

  Blackman: (length, index, alpha) => {
    const a0 = (1 - alpha) / 2;
    const a1 = 0.5;
    const a2 = alpha / 2;

    return (
      a0 - a1 * Math.cos((2 * Math.PI * index) / (length - 1)) + a2 * Math.cos((4 * Math.PI * index) / (length - 1))
    );
  },

  Cosine: (length, index, beta) => {
    return Math.pow(Math.cos((Math.PI * index) / (length - 1) - Math.PI / 2), beta);
  },

  Gauss: (length, index, alpha) => {
    return Math.pow(Math.E, -0.5 * Math.pow((index - (length - 1) / 2) / ((alpha * (length - 1)) / 2), 2));
  },

  Hamming: (length, index, beta) => {
    return Math.pow(0.54 - 0.46 * Math.cos((2 * Math.PI * index) / (length - 1)), beta);
  },

  Hann: (length, index, beta) => {
    return Math.pow(0.5 * (1 - Math.cos((2 * Math.PI * index) / (length - 1))), beta);
  },

  Rectangular: (_length, _index, beta) => {
    return beta;
  },

  SinBeta: (length, index, beta) => {
    return Math.pow(Math.sin((Math.PI * index) / length), beta);
  },

  Trapezoidal: (length, index, beta) => {
    const div = 10;
    const topIdx = Math.round(length / 4);
    const i1 = topIdx - 1;
    const i2 = topIdx * (div - 1) - 1;
    if (index <= i1) {
      return Math.pow(index / i1, beta);
    } else if (index >= i2) {
      return Math.pow(i2 / index, beta);
    } else {
      return 1;
    }
  }
};

class CBuffer<T extends number> {
  public size: number;

  private start: number;
  private end: number;
  private overflow: ((item: T, buffer: CBuffer<T>) => void) | null;
  private length: number;
  private data: T[];

  constructor(length: number) {
    if (length <= 0) {
      throw new Error("Missing Argument: You must pass a valid buffer length");
    }

    this.size = this.start = 0;
    this.overflow = null;
    this.length = length;
    this.data = new Array<T>(length);
    this.end = this.length - 1;
  }

  private defaultComparitor(a: T, b: T): number {
    if (a === b) return 0;
    return a > b ? 1 : -1;
  }

  pop() {
    if (this.size === 0) return undefined;
    const item = this.data[this.end];
    delete this.data[this.end];
    this.end = (this.end - 1 + this.length) % this.length;
    this.size--;
    return item;
  }

  push(...items: T[]) {
    let i = 0;
    if (this.overflow && this.size + items.length > this.length) {
      for (; i < this.size + items.length - this.length; i++) {
        this.overflow(this.data[(this.end + i + 1) % this.length], this);
      }
    }
    for (i = 0; i < items.length; i++) {
      this.data[(this.end + i + 1) % this.length] = items[i];
    }

    this.size = Math.min(this.size + items.length, this.length);
    this.end = (this.end + items.length) % this.length;
    this.start = (this.length + this.end - this.size + 1) % this.length;
    return this.size;
  }

  reverse() {
    let tmp: T;
    for (let i = 0; i < Math.floor(this.size / 2); i++) {
      tmp = this.data[(this.start + i) % this.length];
      this.data[(this.start + i) % this.length] = this.data[(this.start + this.size - i - 1) % this.length];
      this.data[(this.start + this.size - i - 1) % this.length] = tmp;
    }
    return this;
  }

  rotateLeft(cntr: number = 1) {
    for (let i = 0; i < cntr; i++) {
      this.push(this.shift()!);
    }
    return this;
  }

  rotateRight(cntr: number = 1) {
    for (let i = 0; i < cntr; i++) {
      this.unshift(this.pop()!);
    }
    return this;
  }

  shift() {
    if (this.size === 0) return;
    const item = this.data[this.start];
    this.start = (this.start + 1) % this.length;
    this.size--;
    return item;
  }

  sort(fn?: (a: T, b: T) => number) {
    this.data.sort(fn || this.defaultComparitor);
    this.start = 0;
    this.end = this.size - 1;
    return this;
  }

  unshift(...items: T[]) {
    let i = 0;
    if (this.overflow && this.size + items.length > this.length) {
      for (; i < this.size + items.length - this.length; i++) {
        this.overflow(this.data[this.end - (i % this.length)], this);
      }
    }
    for (i = 0; i < items.length; i++) {
      this.data[(this.length + this.start - (i % this.length) - 1) % this.length] = items[i];
    }

    if (this.length - this.size - i < 0) {
      this.end += this.length - this.size - i;
      if (this.end < 0) this.end = this.length + (this.end % this.length);
    }

    this.size = Math.min(this.size + items.length, this.length);
    this.start = (this.start - items.length + this.length) % this.length;
    return this.size;
  }

  indexOf(arg: T, idx: number = 0) {
    for (let i = idx; i < this.size; i++) {
      if (this.data[(this.start + i) % this.length] === arg) return i;
    }
    return -1;
  }

  lastIndexOf(arg: T, idx: number = this.size - 1) {
    for (let i = idx; i >= 0; i--) {
      if (this.data[(this.start + i) % this.length] === arg) return i;
    }
    return -1;
  }

  sortedIndex(value: T, comparitor: (a: T, b: T) => number = this.defaultComparitor, context?: any) {
    let low = this.start,
      high = this.size - 1;

    if (low && comparitor.call(context, value, this.data[high]) > 0) {
      low = 0;
      high = this.end;
    }

    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (comparitor.call(context, value, this.data[mid]) > 0) low = mid + 1;
      else high = mid;
    }
    return (((low - this.start) % this.size) + this.size) % this.size;
  }

  every(callback: (value: T, index: number, array: CBuffer<T>) => boolean, context?: any) {
    for (let i = 0; i < this.size; i++) {
      if (!callback.call(context, this.data[(this.start + i) % this.length], i, this)) return false;
    }
    return true;
  }

  forEach(callback: (value: T, index: number, array: CBuffer<T>) => void, context?: any) {
    for (let i = 0; i < this.size; i++) {
      callback.call(context, this.data[(this.start + i) % this.length], i, this);
    }
  }

  some(callback: (value: T, index: number, array: CBuffer<T>) => boolean, context?: any) {
    for (let i = 0; i < this.size; i++) {
      if (callback.call(context, this.data[(this.start + i) % this.length], i, this)) return true;
    }
    return false;
  }

  avg() {
    return this.size === 0 ? 0 : this.sum() / this.size;
  }

  sum() {
    return this.data.slice(0, this.size).reduce((acc, val) => (acc + val) as unknown as number, 0);
  }

  median() {
    if (this.size === 0) return 0;
    const values = this.slice().sort(this.defaultComparitor);
    const half = Math.floor(values.length / 2);
    return values.length % 2 === 0 ? (values[half - 1] + values[half]) / 2.0 : values[half];
  }

  empty() {
    this.size = this.start = 0;
    this.end = this.length - 1;
    return this;
  }

  fill(arg: T | (() => T)) {
    if (typeof arg === "function") {
      for (let i = 0; i < this.length; i++) {
        this.data[i] = (arg as () => T)();
      }
    } else {
      for (let i = 0; i < this.length; i++) {
        this.data[i] = arg;
      }
    }
    this.start = 0;
    this.end = this.length - 1;
    this.size = this.length;
    return this;
  }

  first() {
    return this.data[this.start];
  }

  last() {
    return this.data[this.end];
  }

  get(arg: number) {
    return this.data[(this.start + arg) % this.length];
  }

  isFull() {
    return this.length === this.size;
  }

  set(idx: number, arg: T) {
    this.data[(this.start + idx) % this.length] = arg;
  }

  toArray() {
    return this.slice();
  }

  slice(start: number = 0, end: number = this.size) {
    const result: T[] = [];
    for (let i = start; i < end; i++) {
      result.push(this.data[(this.start + i) % this.length]);
    }
    return result;
  }
}

export class OLATS {
  private _frameSize: number;
  private _alpha: number;
  private _Ha: number;
  private _Hs: number;
  private _beta: number;
  private _overlapFactor: number;
  private _windowType: string;
  private _window: Float32Array | null;
  private _squaredFramingWindow: Float32Array | null;
  private _numSamples: number;
  private _overlapBuffers: CBuffer<number>;
  private _owOverlapBuffers: CBuffer<number>;
  private _clean: boolean;

  constructor(frameSize: number) {
    this._frameSize = frameSize;
    this._alpha = 1;
    this._Ha = 0;
    this._Hs = 0;
    this._beta = 1;
    this._overlapFactor = 1.1;
    this._windowType = "Lanczos";
    this._window = null;
    this._squaredFramingWindow = null;
    this._numSamples = 0;
    this._overlapBuffers = new CBuffer(this._frameSize);
    this._owOverlapBuffers = new CBuffer(this._frameSize);
    this._clean = true;

    for (let i = 0; i < this._frameSize; i++) {
      this._overlapBuffers.push(0);
      this._owOverlapBuffers.push(0);
    }

    this.set_alpha(1);
    this.set_beta(this._beta);
  }

  process(frame: Float32Array, outputArray: Float32Array) {
    const input = this.window_mul(frame);
    this.overlap_and_add(
      this._Hs,
      input,
      this._squaredFramingWindow!,
      this._overlapBuffers,
      this._owOverlapBuffers,
      this._frameSize,
      outputArray
    );
    this._clean = false;
    return this._Hs;
  }

  overlap_and_add(
    RS: number,
    inF: Float32Array,
    squaredWinF: Float32Array,
    oBuf: CBuffer<number>,
    owOBuf: CBuffer<number>,
    windowSize: number,
    outF: Float32Array
  ) {
    let owSample: number,
      oSample = 0;

    for (let i = 0; i < RS; i++) {
      owSample = owOBuf.shift() || 0;
      oSample = oBuf.shift() || 0;
      // @ts-ignore
      outF.push(oSample / (owSample < 10e-3 ? 1 : owSample));
      oBuf.push(0);
      owOBuf.push(0);
      this._numSamples--;
    }

    for (let i = 0; i < windowSize; i++) {
      oSample = oBuf.shift()!;
      oBuf.push(inF[i] + oSample);
      owSample = owOBuf.shift()!;
      owOBuf.push(squaredWinF[i] + owSample);
      this._numSamples++;
    }
  }

  beta_fn() {
    if (this._alpha <= 1) {
      return 2.0;
    } else if (this._alpha <= 1.2) {
      return 2.0;
    } else if (this._alpha <= 1.4) {
      return 2.0;
    } else if (this._alpha <= 1.8) {
      return 2.5;
    } else {
      return 3.0;
    }
  }

  overlap_fn(alpha: number) {
    if (alpha < 0.9) {
      return 1.3;
    } else if (alpha < 1) {
      return alpha + 0.15;
    } else if (alpha >= 1 && alpha < 1.25) {
      return alpha + 0.15;
    } else if (alpha >= 1.25 && alpha < 1.5) {
      return alpha + 0.2;
    } else if (alpha >= 1.5 && alpha < 1.8) {
      return alpha + 0.6;
    } else if (alpha >= 1.8 && alpha < 2) {
      return alpha + 0.9;
    } else if (alpha >= 2 && alpha < 2.5) {
      return alpha + 2.2;
    } else {
      return alpha + 2.2;
    }
  }

  get_hs() {
    return this._Hs;
  }

  get_ha() {
    return this._Ha;
  }

  get_alpha() {
    return this._alpha;
  }

  get_real_alpha() {
    return this._Hs / this._Ha;
  }

  get_overlap_factor() {
    return this._overlapFactor;
  }

  clear_buffers() {
    this._overlapBuffers = new CBuffer(this._frameSize);
    this._owOverlapBuffers = new CBuffer(this._frameSize);
    this._clean = true;
  }

  set_window_type(newType: string) {
    if (WindowFunctions[newType]) {
      this._windowType = newType;
    }
  }

  set_alpha(newAlpha: number, newOverlap?: number, newBeta?: number) {
    this._alpha = newAlpha;
    this._beta = newBeta !== undefined ? newBeta : this.beta_fn();
    this._overlapFactor = newOverlap !== undefined ? newOverlap : this.overlap_fn(this._alpha);
    this._Ha = Math.round(this._frameSize / this._overlapFactor);
    this._Hs = Math.round(this._alpha * this._Ha);
  }

  set_beta(newBeta: number) {
    this._beta = newBeta;
    this._window = this.create_window(this._frameSize, this._beta, this._windowType);
    this._squaredFramingWindow = new Float32Array(this._window.length);

    for (let i = 0; i < this._squaredFramingWindow.length; i++) {
      this._squaredFramingWindow[i] = Math.pow(this._window[i], 1);
    }
  }

  window_mul(frame: Float32Array) {
    const aux = new Float32Array(frame.length);
    for (let i = 0; i < frame.length; i++) {
      aux[i] = this._window![i] * frame[i];
    }
    return aux;
  }

  create_window(length: number, beta: number, type: string) {
    const win = new Float32Array(length);

    for (let i = 0; i < length; i++) {
      win[i] = WindowFunctions[type](length, i, beta);
    }

    return win;
  }

  is_clean() {
    return this._clean;
  }
}

/**
 *	A helper class to use OLATS with the Web Audio API.
 *	Just pass an AudioBuffer with the "set_audio_buffer" method.
 *	Then, for example, at each cycle of ScriptProcessor.onaudioprocess,
 *	change the "alpha" and "position" fields to change the stretching
 *  factor and the audio buffer position pointer. After changing one
 *  or both parameters, call the "process" method.
 */
export class BufferedTS {
  private _frameSize: number;
  private _olaL: OLATS;
  private _olaR: OLATS;
  private _buffer: AudioBuffer | null;
  private _position: number;
  private _newAlpha: number | undefined;
  private _midBufL: CBuffer<number>;
  private _midBufR: CBuffer<number>;

  constructor(frameSize: number = 4096) {
    this._frameSize = frameSize;
    this._olaL = new OLATS(this._frameSize);
    this._olaR = new OLATS(this._frameSize);
    this._buffer = null;
    this._position = 0;
    this._newAlpha = 1;

    this._midBufL = new CBuffer(Math.round(this._frameSize * 1.2));
    this._midBufR = new CBuffer(Math.round(this._frameSize * 1.2));
  }

  process(outputAudioBuffer: AudioBuffer) {
    if (!this._buffer) return;

    let sampleCounter = 0;
    const channels = this._buffer.numberOfChannels;
    let rightNum = channels === 1 ? 0 : 1;

    const il = this._buffer.getChannelData(0);
    const ir = this._buffer.getChannelData(rightNum);
    const ol = outputAudioBuffer.getChannelData(0);
    const or = outputAudioBuffer.getChannelData(rightNum);

    while (this._midBufR.size > 0 && sampleCounter < outputAudioBuffer.length) {
      ol[sampleCounter] = this._midBufL.shift()!;
      or[sampleCounter] = this._midBufR.shift()!;
      sampleCounter++;
    }

    if (sampleCounter === outputAudioBuffer.length) return;

    while (sampleCounter < outputAudioBuffer.length) {
      const bufL = il.subarray(this._position, this._position + this._frameSize);
      const bufR = ir.subarray(this._position, this._position + this._frameSize);

      if (this._newAlpha !== undefined && this._newAlpha !== this._olaL.get_alpha()) {
        this._olaL.set_alpha(this._newAlpha);
        this._olaR.set_alpha(this._newAlpha);
        this._newAlpha = undefined;
      }

      // @ts-ignore
      this._olaL.process(bufL, this._midBufL);
      // @ts-ignore
      this._olaR.process(bufR, this._midBufR);

      for (let i = sampleCounter; this._midBufL.size > 0 && i < outputAudioBuffer.length; i++) {
        ol[i] = this._midBufL.shift()!;
        or[i] = this._midBufR.shift()!;
      }

      sampleCounter += this._olaL.get_hs();
      this._position += this._olaL.get_ha();
    }
  }

  set_audio_buffer(newBuffer: AudioBuffer) {
    this._buffer = newBuffer;
  }

  get position(): number {
    return this._position;
  }

  set position(newPosition: number) {
    this._position = newPosition;
  }

  get alpha() {
    return this._olaL.get_alpha();
  }

  set alpha(newAlpha: number) {
    this._newAlpha = newAlpha;
  }
}
