
export class Vector3D {
  constructor(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  add(v) {
    return new Vector3D(this.x+v.x, this.y+v.y, this.z+v.z);
  }

  scale(a) {
    return new Vector3D(a*this.x, a*this.y, a*this.z);
  }

  rotateXY(theta) {
    let cosTheta = Math.cos(theta);
    let sinTheta = Math.sin(theta);
    return new Vector3D(
      this.x*cosTheta - this.y*sinTheta,
      this.x*sinTheta + this.y*cosTheta,
      this.z
    );
  }

  unitVector() {
    let length = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    return this.scale(1/length);
  }

  toString() {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}

export function rotate2DVector(v, theta) {
  let cosTheta = Math.cos(theta);
  let sinTheta = Math.sin(theta);
  return new Vector3D(
    v.x*cosTheta - v.y*sinTheta,
    v.x*sinTheta + v.y*cosTheta,
    v.z
  );
};

export function throwErrorIfNotInstanceOf(arg, argName, argClass) {
  if (!(arg instanceof argClass)) {
    throw (argName + " must be an instance of " + argClass.constructor.name);
  }
}

export function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
