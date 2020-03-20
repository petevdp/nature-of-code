const CHOSEN_SKETCH_KEY = "chosenSketch"
let p: p5

window.onload = function () {
    const sketchSelect = document.getElementById('sketchSelect') as HTMLSelectElement;

    for (let sketchKey in Sketches) {
        const option = document.createElement("option")
        option.value = sketchKey
        option.innerText = _.startCase(sketchKey)
        sketchSelect.appendChild(option)
    }

    sketchSelect.onchange = function (event) {
        const selected = sketchSelect.selectedOptions[0].value
        localStorage.setItem(CHOSEN_SKETCH_KEY, selected);
        renderSketch(Sketches[selected])
    }

    let selectedSketchKey;
    if (localStorage.getItem(CHOSEN_SKETCH_KEY)) {
        selectedSketchKey = localStorage.getItem(CHOSEN_SKETCH_KEY)
        sketchSelect.value = selectedSketchKey
    } else {
        selectedSketchKey = sketchSelect.value
    }

    const sketchToRender = Sketches[selectedSketchKey]

    const sketchContainer = document.getElementById('sketchContainer')
    renderSketch(sketchToRender)

    function renderSketch(sketch: sketch) {
        clearChildren(sketchContainer)
        p = new p5(sketch, sketchContainer)
    }
}

function clearChildren(element: HTMLElement) {
    while (element.lastChild) {
        element.removeChild(element.lastChild)
    }
}