///<reference path="p5.d.ts" />
///<reference path="p5.play.js" />
declare namespace p5 {
  declare class Group {}
  //Functions
  declare class Sprite {
    constructor(pInst: any, _x: number, _y: number, _w: number, _h: number);
    color(): void;
    createVector(): void;
    random(): void;
    print(): void;
    push(): void;
    pop(): void;
    colorMode(): void;
    noStroke(): void;
    rectMode(): void;
    ellipseMode(): void;
    imageMode(): void;
    translate(): void;
    scale(): void;
    rotate(): void;
    stroke(): void;
    strokeWeight(): void;
    line(): void;
    noFill(): void;
    fill(): void;
    textAlign(): void;
    textSize(): void;
    text(): void;
    rect(): void;
    cos(): void;
    sin(): void;
    atan2(): void;
    position: p5.Vector;
    previousPosition: p5.Vector;
    newPosition: p5.Vector;
    deltaX: number;
    deltaY: number;
    velocity: p5.Vector;
    maxSpeed: number;
    friction: number;
    collider: object;
    touching: object;
    mass: number;
    immovable: boolean;
    restitution: number;
    rotation: number;
    rotationSpeed: number;
    rotateToDirection: boolean;
    depth: number;
    scale: number;
    visiblity: boolean;
    mouseActive: boolean;
    mouseIsOver: boolean;
    mouseIsPressed: boolean;
    width: number;
    height: number;
    removed: boolean;
    shapeColor: p5.Color;
  }
}
declare function allSprites(): Group;
declare function createSprite(
  x: number,
  y: number,
  width: number,
  height: number
): Sprite;
declare function removeSprite(sprite: Sprite): void;
declare function updateSprites(upd: boolean): void;
declare function getSprites(): Sprite[];
declare function drawSprites(group: Group): void;
declare function drawSprite(sprite: Sprite): void;
declare function loadAnimation(sprite: Sprite): Animation;
declare function loadSpriteSheet(): SpriteSheet;
declare function animation(anim: Animation, x: number, y: number);

//Utils functions
