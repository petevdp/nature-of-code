import p5 from "p5";
import { times } from "lodash-es";

import { Sketch, sketchFunction } from "./sketch";
import { gravityMouse } from "./gravityMouse";
import { nBodyGravityMovers } from "./nBodyGravityMover";

interface Sketches {
  [key: string]: Sketch | sketchFunction;
}

const sketches: Sketches = {
  gravityMouse,
  nBodyGravityMovers
};
export { sketches, Sketches };

sketches.randomBarGraph = p => {
  let randomCounts: Array<number>;
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    randomCounts = times(20).map(() => 0);
    p.background(255);
    p.stroke(0);
    p.fill(200);
  };

  p.draw = function() {
    const index = p.int(p.random(randomCounts.length));
    randomCounts[index]++;

    const w = p.width / randomCounts.length;

    randomCounts.forEach((c, i) => {
      p.rect(i * w, p.height - c, w - 1, c);
    });
  };
};

sketches.randomWalk = p => {
  let walker: Walker;
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    walker = new Walker(p);
  };

  p.draw = function() {
    walker.step();
    walker.display();
  };
};

class Walker {
  p: p5;
  x: number;
  y: number;

  constructor(p: p5) {
    this.p = p;
    this.x = p.width / 2;
    this.y = p.height / 2;
  }

  display() {
    this.p.stroke(0);
    this.p.point(this.x, this.y);
  }

  step() {
    const stepX = this.p.random(-1, 1);
    const stepY = this.p.random(-1, 1);
    this.x += stepX;
    this.y += stepY;
  }
}

sketches.bouncingBall = p => {
  let location = p.createVector(100, 100);
  const speed = p.createVector(5.5, 3.3);
  const ballRadius = 20;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);
  };

  p.draw = function() {
    p.background(255);
    location = p5.Vector.add(location, speed);

    if (location.x > p.width - ballRadius || location.x < 0 + ballRadius) {
      speed.x *= -1;
    }
    if (location.y > p.height - ballRadius || location.y < 0 + ballRadius) {
      speed.y *= -1;
    }
    p.stroke(0);
    p.fill(175);
    p.ellipse(location.x, location.y, ballRadius * 2, ballRadius * 2);
  };
};

sketches.mouseFromCenter = p => {
  let center: p5.Vector;
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);
    center = p.createVector(p.width / 2, p.height / 2);
  };

  p.draw = function() {
    p.background(255);
    const mouse = p.createVector(p.mouseX, p.mouseY);
    const diff = p5.Vector.sub(mouse, center);

    p.translate(p.width / 2, p.height / 2);
    p.line(0, 0, diff.x, diff.y);
  };
};

sketches.randomMovers = p => {
  let movers: Array<RandomMover>;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);
    movers = times(100).map(() => {
      const location = p.createVector(p.random(p.width), p.random(p.height));
      const velocity = p.createVector(0, 0);
      return new RandomMover(p, location, velocity);
    });
  };

  p.draw = function() {
    p.background(255);
    movers.forEach(m => {
      m.update();
      m.display();
    });
  };
};

class RandomMover {
  constructor(
    private p: p5,
    private location: p5.Vector,
    private velocity: p5.Vector,
    private radius = 8
  ) {}

  update() {
    const acceleration = this.p.createVector(
      this.p.random(-1, 1),
      this.p.random(-1, 1)
    );
    this.velocity = p5.Vector.add(acceleration, this.velocity);
    this.velocity.limit(10);
    this.location = p5.Vector.add(this.location, this.velocity);

    this.location.x = wrapDimension(this.location.x, this.p.width);
    this.location.y = wrapDimension(this.location.y, this.p.height);
  }

  display() {
    this.p.stroke(0);
    this.p.fill(175);
    const diameter = this.radius * 2;
    this.p.ellipse(this.location.x, this.location.y, diameter, diameter);
  }
}

function wrapDimension(loc: number, size: number) {
  return ((loc % size) + size) % size;
}
