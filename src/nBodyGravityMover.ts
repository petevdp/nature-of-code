import { times } from "lodash-es";

import { sketchFunction } from "./sketch";
import { GravityMover } from "./gravity";

const nBodyGravityMovers: sketchFunction = p => {
  let movers: Array<GravityMover>;
  const gravity = 0.5;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);

    movers = times(15).map(() => {
      const location = p.createVector(p.random(p.width), p.random(p.height));
      return new GravityMover(p, location);
    });
  };

  p.draw = () => {
    p.background(255);
    const sources = movers.map(m => ({
      point: m.location,
      magnitude: gravity
    }));
    movers.forEach(m => {
      m.update(sources);
      m.draw();
    });
  };
};

export { nBodyGravityMovers };
