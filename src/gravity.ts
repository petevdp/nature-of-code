import p5 from "p5";

interface gravitySource {
  point: p5.Vector;
  magnitude: number;
}

export class GravityMover {
  private velocity: p5.Vector;
  constructor(
    private p: p5,
    public readonly location: p5.Vector,
    private radius = 16
  ) {
    this.velocity = p.createVector(0, 0);
  }

  update(sources: Array<gravitySource>) {
    const acceleration = sources.reduce(
      (d, s) => p5.Vector.add(d, this.getGravityAccelerationFromPoint(s)),
      this.p.createVector(0, 0)
    );
    this.velocity.add(acceleration.x, acceleration.y);
    this.location.add(this.velocity.x, this.velocity.y);
  }

  draw() {
    this.p.stroke(0);
    this.p.fill(175);

    const diameter = this.radius * 2;
    this.p.ellipse(this.location.x, this.location.y, diameter, diameter);
  }

  protected getGravityAccelerationFromPoint(source: gravitySource) {
    const diff = p5.Vector.sub(source.point, this.location);
    const direction = diff.normalize();
    const distance = diff.mag();

    const acceleration = source.magnitude * (1 / distance ** 2);

    return p5.Vector.mult(direction, acceleration);
  }
}
