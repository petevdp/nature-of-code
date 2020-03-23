import p5 from "p5";
export type sketchFunction = (p: p5) => void;

export interface RunningSketch {
  p5Instance: p5 | null;
  teardown: () => void;
}

export abstract class Sketch {
  run(container: HTMLElement): RunningSketch {
    const p = new p5(p => this._run(p), container);
    return { p5Instance: p, teardown: () => this.teardown };
  }
  teardown() {}
  protected _run(p: p5) {}
}

export type sketchFactory = () => sketchFunction;
