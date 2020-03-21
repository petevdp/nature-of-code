import _ from "lodash";

import { simpleSketch } from "./sketch";
import { GravityMover } from "./gravity";

const nBodyGravityMovers: simpleSketch = p => {
  let movers: Array<GravityMover>;
  const gravity = 2.0;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);

    movers = _.times(3).map(() => {
      const location = p.createVector(p.random(p.width), p.random(p.height));
      return new GravityMover(p, location, gravity);
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
