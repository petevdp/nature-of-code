type sketch = (p: p5) => any
interface Sketches {
    [key: string]: sketch
}

const Sketches: Sketches = {};

Sketches.someOtherThing = (p: p5) => {
}

Sketches.randomBarGraph = (p: p5) => {
    let randomCounts: Array<number>;
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight)
        randomCounts = _.times(20).map(() => 0)
        p.background(255)
        p.stroke(0)
        p.fill(200)
    }

    p.draw = function () {
        const index = p.int(p.random(randomCounts.length));
        randomCounts[index]++;

        const w = p.width / randomCounts.length;

        randomCounts.forEach((c, i) => {
            p.rect(i * w, p.height - c, w - 1, c)
        })
    }
}

Sketches.randomWalk = (p) => {
    let walker: Walker;
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight)
        walker = new Walker(p)
    }

    p.draw = function () {
        walker.step();
        walker.display()
    }
}
class Walker {
    p: p5;
    x: number;
    y: number;

    constructor(p: p5) {
        this.p = p;
        this.x = p.width / 2
        this.y = p.height / 2
    }

    display() {
        this.p.stroke(0);
        this.p.point(this.x, this.y)
    }

    step() {
        const stepX = this.p.random(-1, 1)
        const stepY = this.p.random(-1, 1)
        this.x += stepX
        this.y += stepY
    }

}