import p5 from "p5";
import { times } from "lodash-es";

import { Sketch } from "./sketch";
import { GravityMover } from "./gravity";
import { Mover } from "./mover";

class GravityMouse extends Sketch {
  private gravityPoint: p5.Vector;
  private onBlur: EventListener;

  protected _run(p: p5) {
    let movers: Array<GravityMover>;
    const gravity = 0.5;
    this.gravityPoint = p.createVector(p.width / 2, p.height / 2);

    p.setup = function() {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(255);

      movers = times(10).map(() => {
        const location = p.createVector(p.width / 4, p.height / 4);
        const velocity = p.createVector(p.random(0, 5), p.random(0, 5));
        const mass = 1;
        const mover = new Mover(p, location, velocity, mass, {
          displayMode: "pointTowardsMovement"
        });
        return new GravityMover(mover);
      });
    };

    p.mouseMoved = () => {
      this.gravityPoint = p.createVector(p.mouseX, p.mouseY);
    };

    p.draw = () => {
      p.background(255);
      movers.forEach(m => {
        m.update([{ point: this.gravityPoint, magnitude: gravity }]);
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

const gravityMouse = new GravityMouse();
export { gravityMouse };
