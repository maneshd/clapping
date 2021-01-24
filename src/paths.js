import {Vector3D, rotate2DVector} from './util.js';

export class BaseBoundary {
  isInBounds(p) {
    throw "Not Implemented";
  }
}

export class OpenBoundary extends BaseBoundary {
  isInBounds(p) {
    return true;
  }
}

export class CircularBoundary extends BaseBoundary {
  constructor(radius) {
    super();
    self._r = radius;
  }

  isInBounds(p) {
    return Math.sqrt(p.x*p.x + p.y*p.y) <= self._r;
  }
}

export class RectangleBoundary extends BaseBoundary {
  constructor(minX, minY, maxX, maxY) {
    super();
    this._minX = minX;
    this._minY = minY;
    this._maxX = maxX;
    this._maxY = maxY;
  }

  isInBounds(p) {
    return (this._minX < p.x && this._minY < p.y &&
            this._maxX > p.x && this._maxY > p.y);
  }
}


export class BasePath {
  // pos: {x, y, z}
  // forward: {x, y, z}
  // up: {x, y, z}
  // boundary: a child of BaseBoundary
  constructor(pos, forward, up, boundary) {
    this._pos = pos;
    this._forward = forward.unitVector();
    this._up = up;
    this._boundary = boundary;
  }

  get position() {
    return this._pos;
  }

  get forwardVector() {
    return this._forward;
  }

  isValidPosition(pos) {
    return this._boundary.isInBounds(pos);
  }
  update(t) {
    throw "Not Implemented";
  }
}

export class StationaryPath extends BasePath {
  constructor(pos, forward, up) {
    super(pos, forward, up, new OpenBoundary());
  }
  update(t) {}
}

export class Radial2DPath extends BasePath {
  // angularVelocity = radians/sec
  constructor(radius, theta, angularVelocity) {
    let pos = new Vector3D(radius*Math.cos(theta), radius*Math.sin(theta));
    let forward = pos.scale(-1).unitVector();
    let up = new Vector3D(0, 0, 1);
    super(pos, forward, up, new OpenBoundary());

    this._r = radius;
    this._theta = theta;
    this._dTheta = angularVelocity;
  }

  update(t) {
    this._theta += this._dTheta*t;
    this._pos = new Vector3D(
      this._r*Math.cos(this._theta),
      this._r*Math.sin(this._theta)
    )
    this._forward = this._pos.scale(-1).unitVector();
  }
}

const STATE = {
    REST_START:0,
    MOVING_TO_TARGET:1,
    REST_TARGET:2,
    MOVING_TO_START:3
};

const STATE_TO_DIR = {1:-1, 3:1};

export class PulsingRadial2DPath extends Radial2DPath {

  _advanceState() {
    this._state = (this._state + 1) % 4;
  }

  constructor(restRadius, targetRadius, theta, angularVelocity, radialVelocity) {
    super(restRadius, theta, angularVelocity);
    this._rStart = restRadius;
    this._rTarget = targetRadius;
    this._state = STATE.REST_START;
    this._dR = radialVelocity;  // actually, speed!

    this._timeLeftStationary = 3 + Math.random() * 15;
  }

  update(dt) {
    // stuff to change radius and STATE
    if (this._state == STATE.REST_START || this._state == STATE.REST_TARGET) {
      this._timeLeftStationary -= dt;
      if (this._timeLeftStationary < 0) {
        this._advanceState();
      }
    } else {
      this._r += STATE_TO_DIR[this._state] * this._dR * dt;
      if (this._r < this._rTarget) {
        this._r = this._rTarget;
        this._advanceState();
        this._timeLeftStationary = Math.random()*10;
      } else if (this._r > this._rStart) {
        this._r = this._rStart;
        this._advanceState();
        this._timeLeftStationary = 3 + Math.random() * 15;
      }
    }
    super.update(dt);
  }
}


export class Drunk2DPath extends BasePath {
  constructor(pos, forward, speed, boundary) {
    forward.z = 0;  // dirty hack!
    let up = new Vector3D(0, 0, 1);
    super(pos, forward, up, boundary);
    this._speed = speed;
    // TODO: these should be configurable.
    this._rotSpeed = .5;
    this._rotationBias = 1;
  }

  update(t) {
    // Step in the direction of foward.
    let newPos = this._pos.add(this.forward.scale(t*this._speed));
    if (this.isValidPosition(newPos)) {
      this._pos = newPos;
    } else {
      console.log("OOB");
      // TODO: make this a function call to the boundary maybe.
      this._forward = this._forward.scale(-1);
    }

    // Randomly turn a little bit.
    // _rotationBias determines which direction we're rotating.
    if (Math.random() > 0.9) {
      this._rotationBias = (this._rotationBias + 1) % 2;
    }
    let offset = (this._rotationBias + 1) % 2;

    let dTheta = (Math.random() - offset)/30.0;
    this._forward = rotate2DVector(this._forward, dTheta).unitVector();
  }
}
