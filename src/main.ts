import p5 from "p5";
import _ from "lodash-es";

import { sketch, LifecycleSketch, simpleSketch } from "./sketch";
import { Sketches } from "./sketches";

const CHOSEN_SKETCH_KEY = "chosenSketch";

window.onload = function() {
  const sketchSelect = document.getElementById(
    "sketchSelect"
  ) as HTMLSelectElement;
  let currentSketch: sketch;
  let currentSketchKey: string;

  for (let sketchKey in Sketches) {
    const option = document.createElement("option");
    option.value = sketchKey;
    option.innerText = _.startCase(sketchKey);
    sketchSelect.appendChild(option);
  }

  sketchSelect.onchange = function(event) {
    console.log("change!");
    const selected = sketchSelect.selectedOptions[0].value;
    console.log("selected: ", selected);
    localStorage.setItem(CHOSEN_SKETCH_KEY, selected);
    currentSketchKey = selected;
    renderSketch(Sketches[selected]);
  };

  let selectedSketchKey;
  if (localStorage.getItem(CHOSEN_SKETCH_KEY)) {
    selectedSketchKey = localStorage.getItem(CHOSEN_SKETCH_KEY);
    sketchSelect.value = selectedSketchKey;
  } else {
    selectedSketchKey = sketchSelect.value;
  }

  const sketchToRender = Sketches[selectedSketchKey];
  const sketchContainer = document.getElementById("sketchContainer");

  currentSketchKey = selectedSketchKey;
  renderSketch(sketchToRender);

  function renderSketch(sketch: sketch) {
    if (typeof currentSketch === "object") {
      (currentSketch as LifecycleSketch).teardown();
    }
    currentSketch = sketch;

    clearChildren(sketchContainer);

    let sketchFunc: simpleSketch;
    if (typeof sketch === "function") {
      sketchFunc = sketch;
    } else {
      sketchFunc = p => {
        console.log("p: ", p);
        (sketch as LifecycleSketch).run(p);
      };
    }
    console.log(`rendering ${currentSketchKey}`);

    new p5(sketchFunc, sketchContainer);
  }
};

function clearChildren(element: HTMLElement) {
  while (element.lastChild) {
    element.removeChild(element.lastChild);
  }
}
