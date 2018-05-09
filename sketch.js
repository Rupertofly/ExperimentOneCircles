// @ts-check
/* eslint no-undef: 0 */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "setup|draw|preload|recordFrame|recordSetup|p5Canvas0" }] */
// region SEC: Globals

const colourEnum = [
  getC(hues.reds, 2).hex,
  getC(hues.apricots, 2).hex,
  getC(hues.yellows, 2).hex,
  getC(hues.greens, 2).hex,
  getC(hues.blues, 2).hex,
  getC(hues.purples, 2).hex
];

let p5Canvas0;
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
class Actor {
  /**
   * Creates an instance of Actor.
   * @param {any} p p5 instance to use
   * @param {number} _x x pos
   * @param {number} _y y pos
   * @param {object} args fingerprint arguements
   * @memberof Actor
   */

  constructor(p, _x, _y, args) {
    this.Sprite = createSprite(_x, _y, 30, 30);
    this.fingerprint = {
      /** @type {number} */
      dot1_colour: args.d1c,
      /** @type {number} */
      dot2_colour: args.d2c,
      /** @type {number} */
      dot3_colour: args.d3c,
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
    this.Sprite.velocity.x = Math.cos(Math.random() * TWO_PI * 20);
    this.Sprite.velocity.y = Math.sin(Math.random() * TWO_PI * 20);

    this.Sprite.setCollider("circle", 0, 0, 25);
    this.Sprite.draw = () => {
      fill(getC(hues.neutrals, 4).hex);
      ellipse(0, 0, 50, 50);
      fill(getC(hues.neutrals, 5).hex);
      ellipse(0, 0, 46, 46);
      fill(getC(hues.neutrals, 6).hex);
      ellipse(0, 0, 30, 30);
      let ang1 = 0;
      fill(colourEnum[this.fingerprint.dot1_colour]);
      ellipse(sin(ang1) * 10, cos(ang1) * 10, 8, 8);
      let ang2 = TWO_PI / 3 * 1;
      fill(colourEnum[this.fingerprint.dot2_colour]);
      ellipse(sin(ang2) * 10, cos(ang2) * 10, 8, 8);
      let ang3 = TWO_PI / 3 * 2;
      fill(colourEnum[this.fingerprint.dot3_colour]);
      ellipse(sin(ang3) * 10, cos(ang3) * 10, 8, 8);
      edgeCollide(this.Sprite);
      const GR = TWO_PI / 1.618;
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

function draw() {
  background(getC(hues.neutrals, 6).hex);
  for (let l of listOfLinks) {
    l.draw();
  }
  for (let i of listOfActors) {
    i.Sprite.display();
    i.Sprite.bounce(allSprites);
  }
  if (frameCount % 50) asLinks();
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
  listOfLinks = tempLinks;
}
