import { sketchFunction } from "./sketch";
import p5 from "p5";
import { times } from "lodash-es";
import { Mover } from "./mover";

export { manyForces };

const manyForces: sketchFunction = p => {
  const wind = p.createVector(0.8, 0);
  const startingPosition = p.createVector(16 * 5, 16 * 5);

  let gravityAcceleration: p5.Vector;
  let movers: Array<Mover>;
  let liquid: Liquid;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);

    gravityAcceleration = p.createVector(0, 1);

    {
      const size = p.createVector(400, 400);
      const position = p.createVector(
        p.width / 2 - size.x / 2,
        p.height / 2 - size.x / 2
      );
      liquid = new Liquid(p, position, size, 0.01);
    }

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
    liquid.draw();
    movers.forEach((mover, index) => {
      const gravityForce = p5.Vector.mult(gravityAcceleration, mover.mass);
      let liquidFrictionForce = liquid.isInLiquid(mover)
        ? liquid.frictionForMover(mover)
        : p.createVector(0, 0);

      const netForce = [wind, gravityForce, liquidFrictionForce].reduce(
        (acc, f) => p5.Vector.add(acc, f),
        p.createVector(0, 0)
      );
      mover.update(netForce);

      mover.draw();
    });
  };
};

class Liquid {
  constructor(
    private p: p5,
    private position: p5.Vector,
    private dimensions: p5.Vector,
    private frictionCoefficient: number
  ) {}

  draw() {
    this.p.noStroke();
    this.p.fill(175);
    this.p.rect(
      this.position.x,
      this.position.y,
      this.dimensions.x,
      this.dimensions.y
    );
  }

  isInLiquid(mover: Mover) {
    return (
      mover.position.x > this.position.x &&
      mover.position.y > this.position.y &&
      mover.position.x < this.position.x + this.dimensions.x &&
      mover.position.y < this.position.y + this.dimensions.y
    );
  }

  frictionForMover(mover: Mover) {
    const dragMagnitude = this.frictionCoefficient * mover.velocity.mag() ** 2;

    return mover.velocity
      .copy()
      .mult(-1)
      .normalize()
      .mult(dragMagnitude);
  }
}
