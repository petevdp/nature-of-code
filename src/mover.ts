import p5 from "p5";

export class Mover {
  constructor(
    public p: p5,
    protected _position: p5.Vector,
    protected _velocity: p5.Vector,
    protected _mass = 1
  ) {}

  update(force: p5.Vector) {
    const acceleration = Mover.calcAcceleration(force, this._mass);
    this._velocity = p5.Vector.add(this._velocity, acceleration);
    this._position = p5.Vector.add(this._position, this._velocity);
  }

  draw(offset: p5.Vector = this.p.createVector(0, 0)) {
    this.p.stroke(0);
    this.p.fill(175);

    const diameter = this.radius * 2;
    let displayPos: p5.Vector;
    if (offset) {
      displayPos = p5.Vector.add(offset, this._position);
    } else {
      displayPos = this._position;
    }

    this.p.ellipse(displayPos.x, displayPos.y, diameter, diameter);
  }

  get radius() {
    return 16 * this._mass;
  }

  get position() {
    return this._position;
  }

  get velocity() {
    return this._velocity;
  }

  get mass() {
    return this._mass;
  }

  static calcAcceleration(force: p5.Vector, mass: number) {
    return p5.Vector.div(force, mass);
  }
}
