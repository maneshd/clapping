import {Vector3D} from './util.js';
// Methods:
//   clear()
//   Create()
//   drawCircle()
//   drawVector()
//
export class CanvasWrapper {
  constructor(canvasElement) {
    this._ctx = canvasElement.getContext('2d');
    this._w = canvasElement.width;
    this._h = canvasElement.height;
  }

  static Create(parentDiv, width, height) {
    let canvasElement = document.createElement('canvas');
    canvasElement.width = width;
    canvasElement.height = height;
    parentDiv.append(canvasElement);
    return new CanvasWrapper(canvasElement);
  }

  _inCanvasCoordinates(v) {
    return new Vector3D(v.x + this._w/2.0, -v.y + this._h/2.0);
  }

  clear() {
    this._ctx.clearRect(0, 0, this._w, this._h);
  }

  drawCircle(center, radius, fillColor='white', strokeColor='black') {
    let c = this._inCanvasCoordinates(center);
    this._ctx.beginPath();
    this._ctx.arc(c.x, c.y, radius, 0, 2*Math.PI);
    this._ctx.strokeStyle = strokeColor;
    this._ctx.fillStyle = fillColor;
    this._ctx.fill();
    this._ctx.stroke();
  }

  drawVector(v, center, color='green') {
    let s = this._inCanvasCoordinates(center);
    let t = this._inCanvasCoordinates(center.add(v));
    this._ctx.beginPath();
    this._ctx.strokeStyle = color;
    this._ctx.moveTo(s.x, s.y);
    this._ctx.lineTo(t.x, t.y);
    this._ctx.stroke();
  }
}
