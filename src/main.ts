import { startCase } from "lodash-es";
import p5 from "p5";

import { SketchManager, ControlPanelManager } from "./managers";
import { sketches } from "./sketches";

function main() {
  const elements = {
    sketchContainer: document.getElementById("sketchContainer"),
    controlPanel: {
      container: document.getElementById("controlPanel"),
      select: document.getElementById("sketchSelect") as HTMLSelectElement,
      reset: document.getElementById("sketchReset") as HTMLButtonElement
    }
  };

  const sketchManager = new SketchManager(sketches, elements.sketchContainer);
  const controlPanelManager = new ControlPanelManager(
    sketchManager,
    elements.controlPanel
  );

  Object.assign(window, {
    sketchManager,
    controlPanelManager,
    p5
  });
}

window.onload = () => main();
