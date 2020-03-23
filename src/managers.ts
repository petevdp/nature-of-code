import p5 from "p5";
import { sketches, Sketches } from "./sketches";
import { Sketch, sketchFunction, RunningSketch } from "./sketch";

export class SketchManager {
  sketchKeys: Set<string>;
  activeSketchEntry: {
    runningSketch: RunningSketch;
    key: string;
  } | null = null;
  private localStorageSketchKey = "currentSketch";
  constructor(private sketches: Sketches, private container: HTMLElement) {
    let firstSketchKey: string;
    if (this.persistSketchKey) {
      firstSketchKey = this.persistSketchKey;
    } else {
      firstSketchKey = Object.keys(sketches)[0];
      this.persistSketchKey = firstSketchKey;
    }

    this.sketchKeys = new Set(Object.keys(sketches));
    this.loadSketch(firstSketchKey);
  }

  loadSketch(key: string) {
    if (this.activeSketchEntry) {
      this.activeSketchEntry.runningSketch.teardown();
      this.activeSketchEntry.runningSketch.p5Instance.remove();
    }

    let runningSketch: RunningSketch;
    if (!(sketches[key] instanceof Sketch)) {
      const sketchFunction = sketches[key] as sketchFunction;
      runningSketch = {
        p5Instance: new p5(sketchFunction, this.container),
        teardown: () => {}
      };
    } else {
      const sketch = sketches[key] as Sketch;
      runningSketch = sketch.run(this.container);
    }

    this.persistSketchKey = key;
    this.activeSketchEntry = { runningSketch, key };
    window.p = runningSketch.p5Instance;
  }

  reloadSketch() {
    this.loadSketch(this.activeSketchEntry.key);
  }

  private set persistSketchKey(key) {
    localStorage[this.localStorageSketchKey] = key;
  }
  private get persistSketchKey() {
    return localStorage[this.localStorageSketchKey];
  }
}

export interface ControlPanelElements {
  select: HTMLSelectElement;
  reset: HTMLButtonElement;
}

export class ControlPanelManager {
  constructor(
    private sketchManager: SketchManager,
    private elements: ControlPanelElements
  ) {
    this.initSelect();
    this.initReset();
  }

  private initSelect() {
    const element = this.elements.select;
    [...this.sketchManager.sketchKeys.entries()].forEach(([key]) => {
      const option = document.createElement("option");
      option.value = key;
      element.appendChild(option);
    });
    element.onchange = () => {
      const selected = element.selectedOptions[0].value;
      this.sketchManager.loadSketch(selected);
    };
  }

  private initReset() {
    this.elements.reset.onclick = () => {
      this.sketchManager.reloadSketch();
    };
  }
}
