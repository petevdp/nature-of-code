import { sketchFunction } from "./sketch";
import p5 from "p5";
import { times } from "lodash-es";
import { Mover } from "./mover";

export { manyForces };

const manyForces: sketchFunction = p => {
  let wind: p5.Vector;
  let gravityAcceleration: p5.Vector;

  let movers: Array<Mover>;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);

    wind = p.createVector(0.1, 0);
    gravityAcceleration = p.createVector(0, 0.1);

    movers = times(12).map(() => {
      const position = p.createVector(p.random(p.width), p.random(p.height));
      const velocity = p.createVector(0, 0);
      const mass = p.random(1, 5);
      return new Mover(p, position, velocity, mass, {
        edgeInteraction: "bounce"
      });
    });
  };

  p.draw = function() {
    p.background(255);
    movers.forEach((mover, index) => {
      const gravityForce = p5.Vector.mult(gravityAcceleration, mover.mass);
      const netForce = [wind, gravityForce].reduce(
        (acc, f) => p5.Vector.add(acc, f),
        p.createVector(0, 0)
      );

      mover.update(netForce);
      mover.draw();
    });
  };
};

class WallBouncingMover extends Mover {
  update(force: p5.Vector) {
    const acceleration = Mover.calcAcceleration(force, this.mass);
    const velocity = p5.Vector.add(this._velocity, acceleration);

    const projectedPosition = p5.Vector.add(this._position, this._velocity);
    if (
      projectedPosition.x > this.p.width - this.radius ||
      projectedPosition.x < 0 + this.radius
    ) {
      velocity.x *= -1;
    } else if (
      projectedPosition.y > this.p.height - this.radius ||
      projectedPosition.y < 0 + this.radius
    ) {
      velocity.y *= -1;
    }

    this._velocity = velocity;
    this._position = p5.Vector.add(this._position, this._velocity);
  }
}
