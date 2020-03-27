import p5 from "p5";

type edgeInteraction = "wrap" | "bounce" | undefined;

export interface moverOptions {
  edgeInteraction?: edgeInteraction;
}

export class Mover {
  constructor(
    public p: p5,
    protected _position: p5.Vector,
    protected _velocity: p5.Vector,
    protected _mass = 1,
    private options: moverOptions = {}
  ) {}

  update(force: p5.Vector) {
    const acceleration = Mover.calcAcceleration(force, this._mass);

    this._velocity = Mover.calcVelocity(
      this.p,
      acceleration,
      this.velocity,
      this.position,
      this.radius,
      this.options.edgeInteraction
    );

    this._position = Mover.calcPosition(
      this.p,
      this.velocity,
      this.position,
      this.options.edgeInteraction
    );
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

  static calcVelocity(
    p: p5,
    acceleration: p5.Vector,
    prevVelocity: p5.Vector,
    position: p5.Vector,
    radius: number,
    edgeInteraction: edgeInteraction
  ) {
    const velocity = p5.Vector.add(acceleration, prevVelocity);
    if (edgeInteraction == "bounce") {
      const projectedPosition = p5.Vector.add(position, velocity);
      if (
        projectedPosition.x > p.width - radius ||
        projectedPosition.x < 0 + radius
      ) {
        velocity.x *= -1;
      } else if (
        projectedPosition.y > p.height - radius ||
        projectedPosition.y < 0 + radius
      ) {
        velocity.y *= -1;
      }
    }

    return velocity;
  }

  static calcAcceleration(force: p5.Vector, mass: number) {
    return p5.Vector.div(force, mass);
  }

  static calcPosition(
    p: p5,
    velocity: p5.Vector,
    prevPosition: p5.Vector,
    edgeInteraction: edgeInteraction
  ) {
    const position = p5.Vector.add(prevPosition, velocity);
    if (edgeInteraction == "wrap") {
      position.x = Mover.wrapDimension(position.x, p.width);
      position.y = Mover.wrapDimension(position.y, p.height);
    }
    return position;
  }

  static wrapDimension(position: number, dimensionSize: number) {
    return ((position % dimensionSize) + dimensionSize) % dimensionSize;
  }
}
