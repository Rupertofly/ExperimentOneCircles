// @ts-check
/* eslint no-undef: 0 */
/* eslint new-cap: 0 */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "setup|draw|preload|recordFrame|recordSetup|p5Canvas0|mousePressed|previewP5" }] */
// region SEC: Globals
/** Colours
 * @enum {string}
 */
const colourEnum = [
  getC(hues.reds, 5).hex,
  getC(hues.apricots, 5).hex,
  getC(hues.yellows, 5).hex,
  getC(hues.greens, 5).hex,
  getC(hues.blues, 5).hex,
  getC(hues.purples, 5).hex
];

let database;
/**
 * canvas
 * @type {HTMLCanvasElement}
 */
let p5Canvas0;
/**
 * Checks whether sprite will go over edge and bounces it
 *
 * @param {p5.Sprite} s
 */
function edgeCollide(s) {
  if (s.position.x < 25) {
    s.position.x = 26;
    s.velocity.x = abs(s.velocity.x);
  }

  if (s.position.x > width - 25) {
    s.position.x = width - 26;
    s.velocity.x = -abs(s.velocity.x);
  }

  if (s.position.y < 25) {
    s.position.y = 26;
    s.velocity.y = abs(s.velocity.y);
  }

  if (s.position.y > height - 25) {
    s.position.y = height - 26;
    s.velocity.y = -abs(s.velocity.y);
  }
}
// Angle for Identifier
const GR = 6.2831 / 1.618;
/**
 * Actor Class
 *
 * @class Actor
 */
class Actor {
  /**
   * Creates an instance of Actor.
   * @param {p5} p p5 instance to use
   * @param {number} _x x pos
   * @param {number} _y y pos
   * @param {object} args fingerprint arguements
   * @memberof Actor
   */

  constructor(p, _x, _y, args) {
    this.Sprite = createSprite(_x, _y, 30, 30);
    this.fingerprint = {
      /** @type {number[]} */
      cols: [args.d1c, args.d2c, args.d3c],
      /** @type {number} */
      creationHash: args.cH,
      /** @type {string[]} */
      behaviours: args.b
    };
    this.strengths = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    /** @type {object} */
    this.prevGen = args.pg;
    this.lifeData = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    /** @type {Link[]} */
    this.relationships = [];
    // set Default maxspeed and restitution
    this.Sprite.maxSpeed = 0.6;
    this.Sprite.restitution = 0.8;
    this.growMult = 1;
    this.drainMult = 1;
    // set default roteSpeed
    this.Sprite.rotationSpeed = 0.3;
    this.Sprite.velocity.x = Math.cos(Math.random() * TWO_PI) / 10;
    this.Sprite.velocity.y = Math.sin(Math.random() * TWO_PI) / 10;
    // Set Collision
    this.Sprite.setCollider("circle", 0, 0, 25);
    let fill1 = color(colourEnum[this.fingerprint.cols[0]]);
    let fill2 = color(colourEnum[this.fingerprint.cols[1]]);
    let fill3 = color(colourEnum[this.fingerprint.cols[2]]);
    // Calculate Behaviours
    if (this.fingerprint.behaviours[0] !== "0") {
      if (this.fingerprint.behaviours[0] === "E") this.Sprite.maxSpeed = 1;
      else this.Sprite.maxSpeed = 0.3;
    }
    if (this.fingerprint.behaviours[1] !== "0") {
      if (this.fingerprint.behaviours[1] === "N") this.drainMult -= 0.5;
      else this.drainMult += 0.5;
    }
    if (this.fingerprint.behaviours[2] !== "0") {
      if (this.fingerprint.behaviours[2] === "T")
        this.Sprite.rotationSpeed -= 0.2;
      else this.Sprite.rotationSpeed += 0.2;
    }
    if (this.fingerprint.behaviours[3] !== "0") {
      if (this.fingerprint.behaviours[3] === "J") this.growMult += 0.2;
      else this.growMult -= 0.2;
    }
    // Draw Loop
    this.Sprite.draw = () => {
      // Draw Outside Circles
      fill(getC(hues.neutrals, 4).hex);
      ellipse(0, 0, 50, 50);
      fill(getC(hues.neutrals, 6).hex);
      ellipse(0, 0, 48, 48);
      let ang1 = 0;
      let ang2 = TWO_PI / 3 * 1;
      let ang3 = TWO_PI / 3 * 2;
      fill(fill1);
      arc(0, 0, 46, 46, ang1, ang2);
      fill(fill2);
      arc(0, 0, 46, 46, ang2, ang3);
      fill(fill3);
      arc(0, 0, 46, 46, ang3, TWO_PI);
      fill(getC(hues.neutrals, 6).hex);
      ellipse(0, 0, 36, 36);
      this.formulateLifeData();
      let startAng = 0 - radians(this.Sprite.rotation);
      let drawInd = 0;
      for (let c in this.lifeData) {
        if (this.lifeData[c] !== 0 || this.lifeData[c] !== null) {
          let endAng = startAng + TWO_PI * this.lifeData[c] - 0.01;
          fill(colourEnum[c]);
          if (this.lifeData[c] !== 0) arc(0, 0, 30, 30, startAng, endAng);
          startAng = endAng;
        }
      }
      fill(color(255));
      ellipse(0, 0, 20, 20);
      edgeCollide(this.Sprite);

      stroke(120);
      strokeWeight(1);
      let cHash = this.fingerprint.creationHash;
      for (let i = 0; i < cHash % 8; i++) {
        let ang = GR * i;
        let ang2 = ang + PI / 2;
        strokeWeight(0.8);
        let l = 7;
        line(0, 0, sin(ang2) * l, cos(ang2) * l);
        rectMode(RADIUS);
        ellipseMode(RADIUS);
        if (Math.floor(cHash * 2.33) % 3 === 0) rect(0, 0, 4, 4);
        else if (Math.floor(cHash * 2.33) % 3 === 1) ellipse(0, 0, 4, 4);
      }
    };
  }
  formulateLifeData() {
    for (let i = this.relationships.length - 1; i >= 0; i--) {
      if (!listOfLinks.includes(this.relationships[i])) {
        this.relationships.splice(i, 1);
        continue;
      }
      let link = this.relationships[i];
      if (
        this.lifeData[link.colour] === undefined ||
        this.lifeData[link.colour] === null
      )
        this.lifeData[link.colour] = 0;
      this.lifeData[link.colour] += 0.001;
    }
    for (let c in this.lifeData) {
      if (this.lifeData[c] === 0) continue;
      if (frameCount % 2 === 0)
        /** @type {number} */
        this.lifeData[c] -= 0.0005 * this.drainMult;
      if (this.lifeData[c] <= 0) {
        this.lifeData[c] = 0;
      }
    }
    /** @type {number} */
    let sum = Object.values(this.lifeData).reduce((a, b) => {
      return a + b;
    });

    for (let c in this.lifeData) {
      if (sum !== 0) this.lifeData[c] = this.lifeData[c] / sum;
      let cNum = Number(c);
      let cStr = this.lifeData[c];
      if (cStr < 0.3) this.strengths[cNum] = 0.5 * this.growMult;
      else if (cStr > 0.8) this.strengths[cNum] = -0.5 * this.growMult;
      else this.strengths[cNum] = map(cStr, 0.3, 0.8, 0.5, -0.5);
    }
  }
}
class Link {
  /**
   * Creates an instance of link.
   * @param {Actor} n1
   * @param {Actor} n2
   * @param {number} c
   * @memberof link
   */
  constructor(n1, n2, c) {
    this.n1des = 1;
    this.n2des = 1;
    this.node1 = n1;
    this.node2 = n2;
    this.angle = 0;
    /** @type{number} */
    this.colour = c;
    this.BaseStrength = 1;

    this.length = p5.Vector.dist(n1.Sprite.position, n2.Sprite.position);
    this.draw = () => {
      this.BaseStrength = 1 - 0.2 * (this.length / 150);
      if (this.length < 75 && (this.n1des < 0 || this.n2des < 0))
        this.BaseStrength = 0.01;
      if (this.n1des < 0) this.n1des *= 1;
      if (this.n2des < 0) this.n2des *= 1;
      this.n1str = this.n1des * this.BaseStrength * 0.001;

      this.n2str = this.n2des * this.BaseStrength * 0.001;
      if (this.n2str < 0) this.n2str *= 100;
      let a1 = this.node1.Sprite.position;
      let a2 = this.node2.Sprite.position;
      this.node1.Sprite.attractionPoint(this.n2str, a2.x, a2.y);
      this.node2.Sprite.attractionPoint(this.n1str, a1.x, a1.y);
      if (this.length < 75) {
        this.node1.Sprite.attractionPoint(-0.001, a2.x, a2.y);
        this.node2.Sprite.attractionPoint(-0.001, a1.x, a1.y);
      }
      noFill();
      stroke(colourEnum[this.colour]);
      strokeWeight(3);
      line(
        this.node1.Sprite.position.x,
        this.node1.Sprite.position.y,
        this.node2.Sprite.position.x,
        this.node2.Sprite.position.y
      );
    };
  }
}
var preview = p => {
  p.setup = () => {
    p.createCanvas(50, 50);
    p.background(255);
    p.frameRate(3);
  };
  p.draw = () => {
    p.push();
    p.noStroke();
    p.translate(25, 25);
    p.fill(getC(hues.neutrals, 4).hex);
    p.ellipse(0, 0, 50, 50);

    p.fill(getC(hues.neutrals, 6).hex);
    p.ellipse(0, 0, 48, 48);
    let ang = [0, TWO_PI / 3 * 1, TWO_PI / 3 * 2, TWO_PI];
    for (let i = 1; i <= 3; i++) {
      let q = document.querySelector(`input[name="options${i}"]:checked`);
      if (q === null) {
      } else {
        let j = q.id.match(/\d/);
        p.fill(colourEnum[j[0]]);
        p.arc(0, 0, 46, 46, ang[i - 1], ang[i]);
      }
    }
    p.fill(color(255));
    p.ellipse(0, 0, 36, 36);
    p.stroke(0);
    let d = new Date();
    let cHash = Math.floor(d.getTime() / 1000) % 32;
    for (let i = 0; i < cHash % 8; i++) {
      let ang = GR * i;
      let ang2 = ang + PI / 2;
      strokeWeight(0.8);
      let l = 9;
      p.line(0, 0, sin(ang2) * l, cos(ang2) * l);
      p.rectMode(RADIUS);
      p.ellipseMode(RADIUS);
      if (Math.floor(cHash * 2.33) % 3 === 0) p.rect(0, 0, 3, 3);
      else if (Math.floor(cHash * 2.33) % 3 === 1) p.ellipse(0, 0, 3, 3);
    }
  };
};
// @ts-ignore
let previewP5 = new p5(preview, "prev");
let loaded;
let downloadedData = {};
// endregion
function preload() {}
/** @type {Actor[]} */
let listOfActors = [];
/** @type {Link[]} */
let listOfLinks = [];
let config;

function setup() {
  loaded = false;
  config = {
    apiKey: "AIzaSyCZh7bDhcHYesPc0FeKxriL7EZ2Kopk2us",
    authDomain: "awesomesaucerupert.firebaseapp.com",
    databaseURL: "https://awesomesaucerupert.firebaseio.com",
    projectId: "awesomesaucerupert",
    storageBucket: "awesomesaucerupert.appspot.com",
    messagingSenderId: "465094389233"
  };
  firebase.initializeApp(config);
  database = firebase.database().ref("ExcerciseOne");
  database.once("value", data => {
    downloadedData = data.val();
    for (let a of Object.values(downloadedData)) {
      /** @type {Actor} */

      listOfActors.push(
        new Actor(this, Math.random() * width, Math.random() * height, a)
      );
    }
    loaded = true;
  });
  p5Canvas0 = createCanvas(windowWidth - 100, 720);
  p5Canvas0.parent("canvas");
  /** @type {p5.Element} */
  // @ts-ignore
  let x = select("#submitButton");
  x.mousePressed(() => submitNewActor());
}
function draw() {
  background(getC(hues.neutrals, 6).hex);
  for (let l of listOfLinks) {
    l.draw();
  }

  for (let [j, i] of listOfActors.entries()) {
    i.Sprite.display();
    if (Number(j) === listOfActors.length - 1 && frameCount < 600) {
      noFill();
      strokeWeight(3);
      stroke(255, 200, 200, 255 - frameCount);
      ellipse(i.Sprite.position.x, i.Sprite.position.y, 60, 60);
    }
    i.Sprite.bounce(allSprites);
  }
  if (frameCount % 20 === 0) asLinks();
}
function submitNewActor() {
  // checks
  let actorArgs = {};
  let c = [];
  let isAnyNull = false;
  for (let i = 1; i <= 3; i++) {
    let but = document.querySelector(`input[name="options${i}"]:checked`);
    if (but === null) {
      isAnyNull = true;
      break;
    }
    c.push(Number(but.id.match(/\d/)));
  }
  if (isAnyNull) return 0;
  Object.assign(actorArgs, { d1c: c[0], d2c: c[1], d3c: c[2] });
  console.log(actorArgs);
  let d = new Date();
  let seconds = Math.floor(d.getTime() / 1000);
  actorArgs.cH = seconds % 32;
  const bEnum = ["E_I", "N_S", "T_F", "J_P"];
  let behaviours = [];
  for (let key of bEnum) {
    let bObj = document.querySelector(`input[name="${key}"]:checked`);
    let b;
    if (bObj === null) b = "0";
    else b = bObj.id.length === 3 ? "0" : bObj.id;
    behaviours.push(b);
  }
  actorArgs.b = behaviours;
  database.push(actorArgs);
  listOfActors.push(new Actor(this, random(width), random(height), actorArgs));
  location.reload();
}

// function mousePressed() {
//   if (mouseX > width || mouseY > height) return;
//   console.log(listOfActors);
//   listOfActors.push(
//     new Actor(this, mouseX, mouseY, {
//       pg: {},
//       d1c: Math.floor(random(6)),
//       d2c: Math.floor(random(6)),
//       d3c: Math.floor(random(6)),
//       cH: second() % 8,
//       b: [5]
//     })
//   );
// }
async function asLinks() {
  calculateLinks();
}
function calculateLinks() {
  let tempLinks = [];
  for (let [i, a] of listOfActors.entries()) {
    for (let [j, b] of listOfActors.entries()) {
      if (i >= j) continue;
      let d = p5.Vector.dist(a.Sprite.position, b.Sprite.position);
      if (d < 150 && d > 50) {
        let l = new Link(a, b, 2, 0);
        tempLinks.push(l);
        a.relationships.push(l);
        b.relationships.push(l);
      }
    }
  }

  for (let link of tempLinks) {
    let n1 = link.node1;
    let n2 = link.node2;
    /** @type {p5.Vector} */
    let p1 = n1.Sprite.position;
    let ns = p5.Vector.sub(p1, n2.Sprite.position).heading();
    link.angle =
      (ns + PI + radians(-(n1.Sprite.rotation % 360) + 720)) % TWO_PI;
    let cat1 = Math.floor(link.angle / TWO_PI * 2.999);
    link.colour = n1.fingerprint.cols[cat1];
    let cat2 = Math.floor(
      ((link.angle + PI + radians(n2.Sprite.rotation - 90)) % TWO_PI) * 2.999
    );
    let n1c = n1.fingerprint.cols[cat1];
    let n2c = n2.fingerprint.cols[cat2];
    if (n1.strengths[n2c] >= n2.strengths[n1c]) {
      link.colour = n2c;
    } else {
      link.colour = n1c;
    }
    link.n1des = n1.strengths[link.colour];
    link.n2des = n2.strengths[link.colour];
    if (
      link.length > 70 &&
      n1.fingerprint.cols[cat1] !== n2.fingerprint.cols[cat2]
    ) {
    }
  }
  listOfLinks = tempLinks;
}
