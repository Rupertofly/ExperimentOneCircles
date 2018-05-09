// @ts-check
/* eslint no-undef: 0 */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "setup|draw|preload|recordFrame|recordSetup|p5Canvas0" }] */
// region SEC: Globals
/** Colours
 * @enum {string}
 */
const colourEnum = [
  getC(hues.reds, 4).hex,
  getC(hues.apricots, 4).hex,
  getC(hues.yellows, 4).hex,
  getC(hues.greens, 4).hex,
  getC(hues.blues, 4).hex,
  getC(hues.purples, 4).hex
];
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
      /** @type {number[]} */
      behaviours: args.b
    };
    /** @type {object} */
    this.prevGen = args.pg;
    this.lifeData = {};
    this.relationships = {};
    this.Sprite.maxSpeed = 2;
    this.Sprite.restitution = 0.8;
    this.Sprite.rotationSpeed = random() * 2;
    // this.Sprite.velocity.x = Math.cos(Math.random() * TWO_PI);
    // this.Sprite.velocity.y = Math.sin(Math.random() * TWO_PI);

    this.Sprite.setCollider("circle", 0, 0, 25);

    this.Sprite.draw = () => {
      let fill1 = color(colourEnum[this.fingerprint.cols[0]]);
      let fill2 = color(colourEnum[this.fingerprint.cols[1]]);
      let fill3 = color(colourEnum[this.fingerprint.cols[2]]);
      fill(getC(hues.neutrals, 4).hex);
      ellipse(0, 0, 50, 50);
      fill(getC(hues.neutrals, 5).hex);
      ellipse(0, 0, 46, 46);
      fill(getC(hues.neutrals, 6).hex);
      ellipse(0, 0, 30, 30);
      let ang1 = 0;

      let ang2 = TWO_PI / 3 * 1;
      let ang3 = TWO_PI / 3 * 2;
      fill(fill1);
      arc(0, 0, 25, 25, ang1, ang2);
      fill(fill2);
      arc(0, 0, 25, 25, ang2, ang3);
      fill(fill3);
      arc(0, 0, 25, 25, ang3, TWO_PI);
      fill(255);
      ellipse(0, 0, 20, 20);
      edgeCollide(this.Sprite);

      stroke(120);
      strokeWeight(1);
      for (let i = 0; i < this.fingerprint.creationHash % 5; i++) {
        let ang = GR * i;
        let ang2 = ang + PI;

        line(sin(ang) * 5, cos(ang) * 5, sin(ang2) * 5, cos(ang2) * 5);
      }
    };
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
    this.node1 = n1;
    this.node2 = n2;
    this.colour = c;
    this.length = p5.Vector.dist(n1.Sprite.position, n2.Sprite.position);
    this.draw = () => {
      noFill();
      stroke(colourEnum[this.colour]);
      strokeWeight(3);
      line(
        this.node1.Sprite.position.x,
        this.node1.Sprite.position.y,
        this.node2.Sprite.position.x,
        this.node2.Sprite.position.y
      );
      this.BaseStrength = abs(map(this.length, 0, 100, -1, 1));
      this.angle = 0;
    };
  }
}

// endregion
function preload() {}
/** @type {Actor[]} */
let listOfActors = [];
let listOfLinks = [];
function setup() {
  p5Canvas0 = createCanvas(800, 600);
}
let thislink = 0;
function draw() {
  background(getC(hues.neutrals, 6).hex);
  for (let l of listOfLinks) {
    l.draw();
  }

  for (let i of listOfActors) {
    i.Sprite.display();
    i.Sprite.bounce(allSprites);
  }
  asLinks();
}
function mousePressed() {
  console.log(listOfActors);
  listOfActors.push(
    new Actor(this, mouseX, mouseY, {
      pg: {},
      d1c: Math.floor(random(6)),
      d2c: Math.floor(random(6)),
      d3c: Math.floor(random(6)),
      cH: second(),
      b: [5]
    })
  );
}
async function asLinks() {
  await calculateLinks();
}
function calculateLinks() {
  let tempLinks = [];
  for (let [i, a] of listOfActors.entries()) {
    for (let [j, b] of listOfActors.entries()) {
      if (i >= j) continue;
      if (p5.Vector.dist(a.Sprite.position, b.Sprite.position) < 100) {
        tempLinks.push(new Link(a, b, 2));
      }
    }
  }
  let ang = 0;
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
    if (link.length > 70 && cat1 !== cat2) {
      n1.Sprite.attractionPoint(
        0.001,
        n2.Sprite.position.x,
        n2.Sprite.position.y
      );
      n2.Sprite.attractionPoint(
        0.001,
        n1.Sprite.position.x,
        n1.Sprite.position.y
      );
    } else {
      n1.Sprite.attractionPoint(
        -0.001,
        n2.Sprite.position.x,
        n2.Sprite.position.y
      );
      n2.Sprite.attractionPoint(
        -0.001,
        n1.Sprite.position.x,
        n1.Sprite.position.y
      );
    }
  }
  listOfLinks = tempLinks;
}
/**
 *
 *
 * @param {p5.Vector} s1
 * @param {p5.Vector} s2
 * @returns
 */
