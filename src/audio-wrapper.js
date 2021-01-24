import {ResonanceAudio} from 'resonance-audio'
// Wraps an audio tag element and a resAudio Source node.
export class AudioSource {
  constructor(audioElement, resAudioSource) {
    this._audio = audioElement;
    this._sbSource = resAudioSource;
    this._isOn = false;
  }

  get currentTime() {
    return this._audio.currentTime;
  }

  setCurrentTime(t) {
    this._audio.currentTime = t;
  }

  setPosition(p) {
    this._sbSource.setPosition(p.x, p.y, p.z);
  }

  setOrientation(forward, up) {
    up = Object.apply({x:0, y:0, z:1}, up);
    this._sbSource.setOrientation(
      forward.x, forward.y, forward.z, up.x, up.y, up.z);
  }

  play() {
    this._isOn = true;
    this._audio.play();
  }

  pause() {
    this._isOn = false;
    this._audio.pause();
  }

  toggle() {
    this._isOn ? this.pause() : this.play();
  }
}

// Wraps ResonanceAudio. The create method makes a new audio context and
// ResonanceAudio instance and hooks things up.
export class ResonanceAudioWrapper {
  constructor(audioContext, resAudio) {
    this._audioCtx = audioContext;
    this._resAudio = resAudio;
  }

  static Create(roomDimensions, walls) {
    let audioCtx = new AudioContext();
    let resAudio = new ResonanceAudio(audioCtx);
    resAudio.output.connect(audioCtx.destination);
    let res = new ResonanceAudioWrapper(audioCtx, resAudio);
    res.setRoomProperties(roomDimensions, walls);
    return res;
  }

  setRoomProperties(widthDepthHeight, walls) {
    this._resAudio.setRoomProperties(widthDepthHeight, walls);
  }

  toggle() {
    this._audioCtx.resume();
  }

  createAudioSource(filepath) {
    let audioElement = document.createElement('audio');
    audioElement.setAttribute("loop", "true");
    audioElement.src = filepath;

    let webAudioSource = this._audioCtx.createMediaElementSource(audioElement);
    let sbSource = this._resAudio.createSource();
    webAudioSource.connect(sbSource.input);

    return new AudioSource(audioElement, sbSource);
  }
}
