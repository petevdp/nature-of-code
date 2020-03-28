import { sketchFunction } from "./sketch";
import p5 from "p5";
import { times } from "lodash-es";
import { Mover } from "./mover";

export { manyForces };

const manyForces: sketchFunction = p => {
  let wind: p5.Vector;
  const coefficientOfFriction = 0.2;
  const normal = 1;
  const frictionMagnitude = coefficientOfFriction * normal;

  let gravityAcceleration: p5.Vector;
  let movers: Array<Mover>;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);

    const startingPosition = p.createVector(16 * 5, 16 * 5);

    wind = p.createVector(0.8, 0);
    gravityAcceleration = p.createVector(0, 1);

    movers = times(100).map(() => {
      const position = startingPosition.copy();
      const velocity = p.createVector(0, 0);
      const mass = p.random(1, 3);
      return new Mover(p, position, velocity, mass, {
        edgeInteraction: "bounce"
      });
    });
  };

  p.draw = function() {
    p.background(255);
    movers.forEach((mover, index) => {
      const gravityForce = p5.Vector.mult(gravityAcceleration, mover.mass);
      const frictionForce = mover.velocity
        .copy()
        .normalize()
        .mult(-1)
        .mult(frictionMagnitude);

      const netForce = [wind, gravityForce, frictionForce].reduce(
        (acc, f) => p5.Vector.add(acc, f),
        p.createVector(0, 0)
      );
      mover.update(netForce);
      mover.draw();
    });
  };
};

class Liquid {
  constructor(private position: p5.Vector, private dimensions: p5.Vector) {}
}
