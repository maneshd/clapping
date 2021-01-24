import {throwErrorIfNotInstanceOf} from './util.js';
import {BasePath} from './paths.js';
import {AudioSource} from './audio-wrapper.js';
import {CanvasWrapper} from './canvas-wrapper.js';


let defaultProperties = {
  radius: 20,
  fillColor: 'white',
};

export class Traveller {

  // possible properties:
  constructor(path, audioSource, canvasWrapper, properties) {
    throwErrorIfNotInstanceOf(path, "path", BasePath);
    throwErrorIfNotInstanceOf(audioSource, "audioSource", AudioSource);
    throwErrorIfNotInstanceOf(canvasWrapper, "canvasWrapper", CanvasWrapper);

    this._path = path;
    this._audioSource = audioSource;
    this._canvasWrapper = canvasWrapper;
    this._props = Object.assign({}, defaultProperties, properties);
  }

  get position() {
    return this._path.position;
  }

  get forwardVector() {
    return this._path.forwardVector;
  }

  get radius() {
    return this._props.radius;
  }

  draw() {
    this._canvasWrapper.drawCircle(this.position, this.radius, this._props.fillColor);

    let v = this.forwardVector.scale(this.radius);
    let c = this.position;
    this._canvasWrapper.drawVector(v, c);
  }

  updateAudio() {
    // TODO: pull out 0.03 as a constant?
    this._audioSource.setPosition(this.position.scale(0.03));
    this._audioSource.setOrientation(this.forwardVector);
  }

  toggleAudio() {
    this._audioSource.toggle();
  }

  update(dt) {
    this._path.update(dt);
    this.draw();
    this.updateAudio();
  }
}
