// @ts-check
/* eslint no-undef: 0 */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "setup|draw|preload|recordFrame|recordSetup|checkNested" }] */

if (!Object.entries)
  Object.entries = function(obj) {
    let ownProps = Object.keys(obj);
    let i = ownProps.length;
    let resArray = new Array(i); // preallocate the Array
    while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];
    return resArray;
  };
function checkNested(obj /*, level1, level2, ... levelN */) {
  var args = Array.prototype.slice.call(arguments, 1);

  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
}
var recorder;
var canvasObject;
var lastFrame = 60;

// For Recording

/**
 * Adds A frame to the recording and saves if at end
 *
 */
function recordFrame() {
  if (frameCount <= lastFrame) {
    recorder.capture(canvasObject);
    if (frameCount === lastFrame) {
      recorder.stop();
      recorder.save();
    }
  }
}
/**
 * Set's up Recording
 *
 */
function recordSetup() {
  recorder = new CCapture({
    format: "webm",
    framerate: 60
  });
  canvasObject = document.getElementById("defaultCanvas0");
  recorder.start();
}
function sqr(x) {
  return x * x;
}
function dist2(v, w) {
  return sqr(v[0] - w[0]) + sqr(v[1] - w[1]);
}
function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p.x - v[0]) * (w[0] - v[0]) + (p.y - v[1]) * (w[1] - v[1])) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist2(p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]);
}
function distToSegment(p, v, w) {
  return Math.sqrt(distToSegmentSquared(p, v, w));
}

