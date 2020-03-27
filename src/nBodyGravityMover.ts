import { times } from "lodash-es";

import { sketchFunction } from "./sketch";
import { GravityMover, gravitySource, MovingGravitySource } from "./gravity";
import p5 from "p5";

const nBodyGravityMovers: sketchFunction = p => {
  const gravity = 0.5;
  let moverSources: Array<MovingGravitySource>;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);

    moverSources = times(3).map(() => {
      const location = p.createVector(p.random(p.width), p.random(p.height));
      return new MovingGravitySource(gravity, p, location);
    });
  };

  p.draw = () => {
    p.background(255);
    const sources = moverSources.map(m => m.source);
    moverSources.forEach((mover, index) => {
      mover.update(sources.filter((_, i) => i !== index));
    });

    const posSum = moverSources.reduce(
      (sum, m) => sum.add(m.location),
      p.createVector(0, 0)
    );

    const averagePosition = posSum.div(moverSources.length);
    const middle = p.createVector(p.width / 2, p.height / 2);
    const offset = p5.Vector.sub(middle, averagePosition);
    p.stroke(124);
    p.fill(124);
    p.ellipse(middle.x, middle.y, 14, 14);

    moverSources.forEach(m => {
      m.draw(offset);
    });

    console.log(moverSources.reduce((s, m) => s + m.energy(middle), 0));
  };
};

export { nBodyGravityMovers };
