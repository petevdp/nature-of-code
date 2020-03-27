import p5 from "p5";

export interface gravitySource {
  point: p5.Vector;
  magnitude: number;
}

interface gravityMoverInterface {
  location: p5.Vector;
  velocity: p5.Vector;
  energy: (middle: p5.Vector) => number;
  update: (sources: Array<gravitySource>) => void;
  draw: (offset: null | p5.Vector) => void;
}

export class GravityMover implements gravityMoverInterface {
  private _velocity: p5.Vector;
  constructor(
    private p: p5,
    private _location: p5.Vector,
    private radius = 16
  ) {
    this._velocity = p.createVector(0, 0);
  }

  get location() {
    return this._location;
  }

  get velocity() {
    return this._velocity;
  }

  energy(middle: p5.Vector) {
    return p5.Vector.add(middle, this._location).mag();
  }

  update(sources: Array<gravitySource>) {
    const acceleration = sources.reduce(
      (d, s) => p5.Vector.add(d, this.getGravityAcceleration(s)),
      this.p.createVector(0, 0)
    );
    this._velocity = p5.Vector.add(this._velocity, acceleration);
    this._location = p5.Vector.add(this._location, this._velocity);
  }

  draw(offset: null | p5.Vector = null) {
    this.p.stroke(0);
    this.p.fill(175);

    const diameter = this.radius * 2;
    let displayPos: p5.Vector;
    if (offset) {
      displayPos = p5.Vector.add(offset, this._location);
    } else {
      displayPos = this._location;
    }

    this.p.ellipse(displayPos.x, displayPos.y, diameter, diameter);
  }

  private getGravityAcceleration(source: gravitySource) {
    const diff = p5.Vector.sub(source.point, this._location);
    const direction = diff.normalize();
    const distance = diff.mag();

    const acceleration = source.magnitude * (1 / distance ** 2);

    return acceleration !== 0 && isFinite(acceleration)
      ? p5.Vector.mult(direction, acceleration)
      : direction;
  }
}

export class MovingGravitySource extends GravityMover {
  constructor(
    public readonly gravity: number,
    p: p5,
    location: p5.Vector,
    radius = 16
  ) {
    super(p, location, radius);
  }

  get source(): gravitySource {
    return {
      point: this.location,
      magnitude: this.gravity
    };
  }
}
