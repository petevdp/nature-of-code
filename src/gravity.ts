import p5 from "p5";
import { Mover } from "./mover";

export interface gravitySource {
  point: p5.Vector;
  magnitude: number;
}

export class GravityMover {
  constructor(protected mover: Mover) {}

  get p() {
    return this.mover.p;
  }

  energy(middle: p5.Vector) {
    return p5.Vector.add(middle, this.mover.position).mag();
  }

  update(sources: Array<gravitySource>) {
    const netForce = sources.reduce((acc, s) => {
      const force = GravityMover.calcForceOfGravityOnMover(s, this.mover);
      return p5.Vector.add(acc, force);
    }, this.p.createVector(0, 0));
    this.mover.update(netForce);
  }

  draw(offset: p5.Vector | null = null) {
    this.mover.draw(offset);
  }

  get position() {
    return this.mover.position;
  }

  static calcForceOfGravityOnMover(source: gravitySource, mover: Mover) {
    const acceleration = GravityMover.calcGravityAcceleration(
      source,
      mover.position
    );
    return p5.Vector.mult(acceleration, mover.mass);
  }

  static calcGravityAcceleration(source: gravitySource, position: p5.Vector) {
    const diff = p5.Vector.sub(source.point, position);
    const direction = diff.normalize();
    const distance = diff.mag();

    const acceleration = source.magnitude * (1 / distance ** 2);

    return acceleration !== 0 && isFinite(acceleration)
      ? p5.Vector.mult(direction, acceleration)
      : direction;
  }
}

export class MovingGravitySource extends GravityMover {
  constructor(mover: Mover, private gravity: number) {
    super(mover);
  }

  get source(): gravitySource {
    return {
      point: this.mover.position,
      magnitude: this.gravity * this.mover.mass
    };
  }
}
