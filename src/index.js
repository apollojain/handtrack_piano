import "./styles.css";
import * as fp from 'fingerpose'
import * as Tone from 'tone'
Navigator.getUserMedia =
  Navigator.getUserMedia ||
  Navigator.webkitUserMedia ||
  Navigator.mozUserMedia ||
  Navigator.msUserMedia;

const thumbs_up = "thumbs_up";
const victory = "victory";

const sampler = new Tone.Sampler({
	urls: {
		"C4": "C4.mp3",
		"D#4": "Ds4.mp3",
		"F#4": "Fs4.mp3",
		"A4": "A4.mp3",
	},
	release: 1,
	baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

const boxes = {
  1: [0, 0, 160, 280],
  2: [160, 0, 160, 280],
  3: [320, 0, 160, 280],
  4: [480, 0, 160, 280],
  5: [0, 280, 220, 280],
  6: [220, 280, 200, 200],
  7: [420, 280, 220, 200]
}
const notes = ["C", "D", "E", "F", "G", "A", "B"]

function getBoxHit(handCenter) {
  var centerX = handCenter[0];
  var centerY = handCenter[1];
  for(var boxId in boxes) {
    var box = boxes[boxId]
    if (centerX > box[0] && centerX < box[0] + box[2]) {
      if (centerY > box[1] && centerY < box[1] + box[3]) {
        return boxId;
      }
    }
  }
  return null;
}

function getBoxesHit(handCenters) {
  var boxesHit = []
  for(var i = 0; i < handCenters.length; i ++ ) {
    var boxHit = getBoxHit(handCenters[i])
    if (boxHit != null && boxesHit.includes(boxHit) == false) {
      boxesHit.push(boxHit)
    }
  }
  return boxesHit;
}

function drawBoxes(boxesHit, context) {
  context.font = "30px Arial"
  for(var boxId in boxes) {
    var bbox = boxes[boxId];
    if (boxesHit.includes(boxId)) {
      context.fillStyle = "#CA3433";
      context.fillRect(bbox[0], bbox[1], bbox[2], bbox[3]);
    } else {
      context.fillStyle = "#FFFFFF";
      context.fillRect(bbox[0], bbox[1], bbox[2], bbox[3]);
    }
    context.strokeRect(bbox[0], bbox[1], bbox[2], bbox[3]);
    context.font = "30px Arial";
    context.fillText(notes[boxId - 1], bbox[0] + 10, bbox[1] + 50);
  }
}

function playTones(boxesHit, gesture) {
  var notesToPlay = []
  for (var i = 0; i < boxesHit.length; i ++) {
    var note = notes[boxesHit[i] - 1];
    if (gesture == thumbs_up) {
      note += "4";
    }
    else if (gesture == victory) {
      note += "2";
    }
    else {
      note += "3";
    }
    notesToPlay.push(note);
  }
  if (notesToPlay.length > 0) {
    console.log(notesToPlay);
    Tone.loaded().then(() => {
      sampler.triggerAttackRelease(notesToPlay, 4);
    })
  }
}

const config = {
  video: { width: 640, height: 480, fps: 30 }
};

const landmarkColors = {
  thumb: 'red',
  indexFinger: 'blue',
  middleFinger: 'yellow',
  ringFinger: 'green',
  pinky: 'pink',
  palmBase: 'white'
};

const gestureStrings = {
  thumbs_up: '👍',
  victory: '✌🏻'
};

async function main() {

  const video = document.querySelector("#pose-video");
  const canvas = document.querySelector("#pose-canvas");
  const ctx = canvas.getContext("2d");

  const resultLayer = document.querySelector("#pose-result");

  // configure gesture estimator
  // add "✌🏻" and "👍" as sample gestures
  const knownGestures = [
    fp.Gestures.VictoryGesture,
    fp.Gestures.ThumbsUpGesture,
  ];
  const GE = new fp.GestureEstimator(knownGestures);

  // load handpose model
  const model = await handpose.load();
  console.log("Handpose model loaded");

  // main estimation loop
  const estimateHands = async () => {

    // clear canvas overlay
    ctx.clearRect(0, 0, config.video.width, config.video.height);
    resultLayer.innerText = '';

    // get hand landmarks from video
    // Note: Handpose currently only detects one hand at a time
    // Therefore the maximum number of predictions is 1
    const predictions = await model.estimateHands(video, true);

    var handCenters = []
    var gesture = null;
    for(let i = 0; i < predictions.length; i++) {

      // draw colored dots at each predicted joint position
      for(let part in predictions[i].annotations) {
        for(let point of predictions[i].annotations[part]) {
          drawPoint(ctx, point[0], point[1], 3, landmarkColors[part]);
        }
      }

      // now estimate gestures based on landmarks
      // using a minimum confidence of 7.5 (out of 10)
      const est = GE.estimate(predictions[i].landmarks, 7.5);

      if(est.gestures.length > 0) {

        // find gesture with highest confidence
        let result = est.gestures.reduce((p, c) => { 
          return (p.confidence > c.confidence) ? p : c;
        });

        gesture = result.name;
        resultLayer.innerText = gestureStrings[gesture];
      }

      // get the center of the bbox
      var bbox = predictions[i].boundingBox;
      var centerX = (bbox.topLeft[0] + bbox.bottomRight[0]) / 2.0;
      var centerY = (bbox.topLeft[1] + bbox.bottomRight[1]) / 2.0;
      handCenters.push([centerX, centerY]);
    }
    
    var boxesHit = getBoxesHit(handCenters)    
    drawBoxes(boxesHit, ctx);
    playTones(boxesHit, gesture);
    // ...and so on
    setTimeout(() => { estimateHands(); }, 1000 / config.video.fps);
  };


  ctx.globalAlpha = 0.5


  estimateHands();

  console.log("Starting predictions");
}

async function initCamera(width, height, fps) {

  const constraints = {
    audio: false,
    video: {
      facingMode: "user",
      width: width,
      height: height,
      frameRate: { max: fps }
    }
  };

  const video = document.querySelector("#pose-video");
  video.width = width;
  video.height = height;

  // get video stream
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;

  return new Promise(resolve => {
    video.onloadedmetadata = () => { resolve(video) };
  });
}

function drawPoint(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

window.addEventListener("DOMContentLoaded", () => {

  initCamera(
    config.video.width, config.video.height, config.video.fps
  ).then(video => {
    video.play();
    video.addEventListener("loadeddata", event => {
      console.log("Camera is ready");
      main();
    });
  });

  const canvas = document.querySelector("#pose-canvas");
  canvas.width = config.video.width;
  canvas.height = config.video.height;
  console.log("Canvas initialized");
});
