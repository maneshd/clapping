import audioclip from '../resources/SpeechSample.wav';
import clap01 from '../resources/clap01.wav'
import clap02 from '../resources/clap02.wav'
import clap03 from '../resources/clap03.wav'
import clap04 from '../resources/clap04.wav'
import clap05 from '../resources/clap05.wav'
import clap06 from '../resources/clap06.wav'
import clap07 from '../resources/clap07.wav'
import clap08 from '../resources/clap08.wav'
import clap09 from '../resources/clap09.wav'
import clap10 from '../resources/clap10.wav'
import clap11 from '../resources/clap11.wav'
import clap12 from '../resources/clap12.wav'
import {Traveller} from './traveller.js';
import {Drunk2DPath, Radial2DPath, StationaryPath, PulsingRadial2DPath,
  RectangleBoundary, CircularBoundary} from './paths.js';
import {CanvasWrapper} from './canvas-wrapper.js';
import {ResonanceAudioWrapper} from './audio-wrapper.js';
import {ThePassageOfTime} from './time.js';

import './style.css';


// TODO: make some widgets so the user can select sound sources and change
// their volume, movement strategy, etc.
// TODO: make a controllable Traveller


const ROOM_DIMENSIONS = {width:800, depth:600, height:100};
// const WALL_MATERIALS = {};
const _M = 'transparent';
const WALL_MATERIALS = {
  left: _M, right: _M, front: _M, back: _M, down: _M, up: 'transparent'
};
const TRAVELLER_RADIUS = 10;
const TRAVELLER_SPEED = 55.0;


// Note: this is for the visual representation.
const ROOM_WIDTH = 700;
const ROOM_HEIGHT = 700;


const TRAVELLER_PROPS = {
  radius: 30,
  fillColor: '#CCCCCC'
};

const MAX_JITTER = 0.004;


function makeTravellers(resonanceAudioWrapper, canvas, boundary) {
  let travellers = [];
  // let r = 50;
  let r = 200;
  let audioClips = [clap01, clap02, clap03, clap04, clap05, clap06, clap07,
      clap08, clap09, clap10, clap11, clap12];
  let theta = 2 * Math.PI / audioClips.length;

  audioClips.forEach((clip, idx)=>{
    // let pos = {x: r*Math.cos(theta*idx), y: r*Math.sin(theta*idx)};
    // let path = new Drunk2DPath(pos, asUnitVector(pos), TRAVELLER_SPEED, boundary);
    // let path = new Radial2DPath(r, idx*theta, 0.2);
    let randomSign = Math.random() > 0.5 ? 1 : -1;
    let angularVelocity = randomSign * (Math.random() * 0.1 + 0.05)
    let path = new PulsingRadial2DPath(r, r/3.0, idx*theta, angularVelocity, 10);

    let audioSource = resonanceAudioWrapper.createAudioSource(clip);
    audioSource.setCurrentTime(Math.random() * MAX_JITTER);

    let traveller = new Traveller(path, audioSource, canvas, TRAVELLER_PROPS);
    traveller.draw();
    travellers.push(traveller);
  });

  return travellers;
}

function main() {
  // plop some divs on there.
  let mainDiv = document.getElementById("content");
  let debugDiv = document.createElement('div');
  debugDiv.classList.add("debug");
  mainDiv.append(debugDiv);

  // Graphics and Audio wrappers
  let canvas = CanvasWrapper.Create(mainDiv, ROOM_WIDTH, ROOM_HEIGHT);
  let resonanceAudioWrapper = ResonanceAudioWrapper.Create(ROOM_DIMENSIONS, WALL_MATERIALS);

  // Make some doobs.
  let boundary = new CircularBoundary(100);
  let travellers = makeTravellers(resonanceAudioWrapper, canvas, boundary);

  let thePassageOfTime = new ThePassageOfTime();
  thePassageOfTime.onUpdate(d => {
    canvas.clear();
    travellers.forEach( t => t.update(d) );
  });

  let onKeyPress = e => {
    if (e.keyCode !== 32) return;
    thePassageOfTime.toggle();
    resonanceAudioWrapper.toggle();
    travellers.forEach( t => t.toggleAudio() );
    e.preventDefault();
  };
  document.addEventListener("keypress", onKeyPress, false);
}


main();
