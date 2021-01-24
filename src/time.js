
/*
ThePassageOfTime keeps track of time! To use it, add callback functions w/
onUpdate. Callback functions take a time delta, which is the number of
seconds since the previous update.

Example:
let t = new ThePassageOfTime();
t.onUpdate(dt => {
  console.log(`Time since last update: ${dt}s`);
});
t.start();
*/
export class ThePassageOfTime {

  constructor() {
    this.t0 = 0;
    this.isOn = false;
    this.callbackFunctions = [];
  }

  clearAllCallbacks() {
    this.callbackFunctions = [];
  }

  onUpdate(cb) {
    this.callbackFunctions.push(cb);
  }

  toggle() {
    this.isOn ? this.stop() : this.start();
  }

  start() {
    console.log("Time is: ON");
    this.t0 = performance.now();
    this.isOn = true;
    window.requestAnimationFrame(this._step.bind(this));
  }

  stop() {
    console.log("Time is: OFF");
    this.isOn = false;
  }

  _step(ts) {
    if (!this.isOn) return;
    let delta = (ts - this.t0)/1000.0;  // seconds
    this.t0 = ts;
    for (let f of this.callbackFunctions) {
      f(delta);
    }
    window.requestAnimationFrame(this._step.bind(this));
  }
}
