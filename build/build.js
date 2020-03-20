class ColorHelper {
    static getColorVector(c) {
        return createVector(red(c), green(c), blue(c));
    }
    static rainbowColorBase() {
        return [
            color('red'),
            color('orange'),
            color('yellow'),
            color('green'),
            color(38, 58, 150),
            color('indigo'),
            color('violet')
        ];
    }
    static getColorsArray(total, baseColorArray = null) {
        if (baseColorArray == null) {
            baseColorArray = ColorHelper.rainbowColorBase();
        }
        var rainbowColors = baseColorArray.map(x => this.getColorVector(x));
        ;
        let colours = new Array();
        for (var i = 0; i < total; i++) {
            var colorPosition = i / total;
            var scaledColorPosition = colorPosition * (rainbowColors.length - 1);
            var colorIndex = Math.floor(scaledColorPosition);
            var colorPercentage = scaledColorPosition - colorIndex;
            var nameColor = this.getColorByPercentage(rainbowColors[colorIndex], rainbowColors[colorIndex + 1], colorPercentage);
            colours.push(color(nameColor.x, nameColor.y, nameColor.z));
        }
        return colours;
    }
    static getColorByPercentage(firstColor, secondColor, percentage) {
        var firstColorCopy = firstColor.copy();
        var secondColorCopy = secondColor.copy();
        var deltaColor = secondColorCopy.sub(firstColorCopy);
        var scaledDeltaColor = deltaColor.mult(percentage);
        return firstColorCopy.add(scaledDeltaColor);
    }
}
class Shapes {
    static star(x, y, radius1, radius2, npoints) {
        var angle = TWO_PI / npoints;
        var halfAngle = angle / 2.0;
        const points = new Array();
        for (var a = 0; a < TWO_PI; a += angle) {
            var sx = x + cos(a) * radius2;
            var sy = y + sin(a) * radius2;
            points.push(createVector(sx, sy));
            sx = x + cos(a + halfAngle) * radius1;
            sy = y + sin(a + halfAngle) * radius1;
            points.push(createVector(sx, sy));
        }
        return points;
    }
}
const Sketches = {};
Sketches.randomBarGraph = p => {
    let randomCounts;
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        randomCounts = _.times(20).map(() => 0);
        p.background(255);
        p.stroke(0);
        p.fill(200);
    };
    p.draw = function () {
        const index = p.int(p.random(randomCounts.length));
        randomCounts[index]++;
        const w = p.width / randomCounts.length;
        randomCounts.forEach((c, i) => {
            p.rect(i * w, p.height - c, w - 1, c);
        });
    };
};
Sketches.randomWalk = p => {
    let walker;
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        walker = new Walker(p);
    };
    p.draw = function () {
        walker.step();
        walker.display();
    };
};
class Walker {
    constructor(p) {
        this.p = p;
        this.x = p.width / 2;
        this.y = p.height / 2;
    }
    display() {
        this.p.stroke(0);
        this.p.point(this.x, this.y);
    }
    step() {
        const stepX = this.p.random(-1, 1);
        const stepY = this.p.random(-1, 1);
        this.x += stepX;
        this.y += stepY;
    }
}
Sketches.bouncingBall = p => {
    let location = [100, 100];
    const speed = [5.5, 3.3];
    const ballRadius = 20;
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(255);
    };
    p.draw = function () {
        p.background(255);
        location = _.zip(location, speed).map(([l, s], i) => l + s);
        const [x, y] = location;
        if (x > (p.width - ballRadius) || x < (0 + ballRadius)) {
            speed[0] *= -1;
        }
        if (y > (p.height - ballRadius) || y < (0 + ballRadius)) {
            speed[1] *= -1;
        }
        p.stroke(0);
        p.fill(175);
        p.ellipse(x, y, ballRadius * 2, ballRadius * 2);
    };
};
const CHOSEN_SKETCH_KEY = "chosenSketch";
let p;
window.onload = function () {
    const sketchSelect = document.getElementById('sketchSelect');
    for (let sketchKey in Sketches) {
        const option = document.createElement("option");
        option.value = sketchKey;
        option.innerText = _.startCase(sketchKey);
        sketchSelect.appendChild(option);
    }
    sketchSelect.onchange = function (event) {
        const selected = sketchSelect.selectedOptions[0].value;
        localStorage.setItem(CHOSEN_SKETCH_KEY, selected);
        renderSketch(Sketches[selected]);
    };
    let selectedSketchKey;
    if (localStorage.getItem(CHOSEN_SKETCH_KEY)) {
        selectedSketchKey = localStorage.getItem(CHOSEN_SKETCH_KEY);
        sketchSelect.value = selectedSketchKey;
    }
    else {
        selectedSketchKey = sketchSelect.value;
    }
    const sketchToRender = Sketches[selectedSketchKey];
    const sketchContainer = document.getElementById('sketchContainer');
    renderSketch(sketchToRender);
    function renderSketch(sketch) {
        clearChildren(sketchContainer);
        p = new p5(sketch, sketchContainer);
    }
};
function clearChildren(element) {
    while (element.lastChild) {
        element.removeChild(element.lastChild);
    }
}
//# sourceMappingURL=build.js.map