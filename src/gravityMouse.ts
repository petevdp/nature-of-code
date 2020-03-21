import { LifecycleSketch } from "./sketch";
import p5 from "p5";
import _ from "lodash";

class GravityMouse implements LifecycleSketch {
  private gravityPoint: p5.Vector;
  private onBlur: EventListener;

  run(p: p5) {
    let movers: Array<GravityMover>;

    p.setup = function() {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(255);
      movers = _.times(100).map(() => {
        const location = p.createVector(p.random(p.width), p.random(p.height));
        const gravity = 0.2;
        return new GravityMover(p, location, gravity);
      });
    };

    p.mouseMoved = () => {
      this.gravityPoint = p.createVector(p.mouseX, p.mouseY);
    };

    p.draw = () => {
      p.background(255);
      movers.forEach(m => {
        m.update(this.gravityPoint);
        m.draw();
      });
    };
    this.onBlur = () => {
      this.gravityPoint = p.createVector(p.width / 2, p.height / 2);
    };

    window.addEventListener("blur", this.onBlur);
  }

  teardown() {
    window.removeEventListener("blur", this.onBlur);
  }
}

class GravityMover {
  private velocity: p5.Vector;
  constructor(
    private p: p5,
    private location: p5.Vector,
    private gravity: number,
    private radius = 8
  ) {
    this.velocity = p.createVector(0, 0);
  }

  update(point: p5.Vector) {
    const diff = p5.Vector.sub(point, this.location);
    const direction = diff.normalize();
    const distance = diff.mag();

    const acceleration = this.gravity * (1 / distance ** 2);

    this.velocity.add(p5.Vector.mult(direction, acceleration));
    this.location = p5.Vector.add(this.velocity, this.location);
  }

  draw() {
    this.p.stroke(0);
    this.p.fill(175);

    const diameter = this.radius * 2;
    this.p.ellipse(this.location.x, this.location.y, diameter, diameter);
  }
}

const gravityMouse = new GravityMouse();
export { gravityMouse };
