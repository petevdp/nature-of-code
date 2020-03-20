type sketch = (p: p5) => any
interface Sketches {
    [key: string]: sketch
}

const Sketches: Sketches = {};

Sketches.randomBarGraph = p => {
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

Sketches.randomWalk = p => {
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
    p: p5
    x: number
    y: number

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

Sketches.bouncingBall = p => {
    let location = p.createVector(100, 100)
    const speed = p.createVector(5.5, 3.3)
    const ballRadius = 20

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight)
        p.background(255)
    }

    p.draw = function () {
        p.background(255)
        location = p5.Vector.add(location, speed)

        if (location.x > (p.width - ballRadius) || location.x < (0 + ballRadius)) {
            speed.x *= -1
        }
        if (location.y > (p.height - ballRadius) || location.y < (0 + ballRadius)) {
            speed.y *= -1
        }
        p.stroke(0)
        p.fill(175)
        p.ellipse(location.x, location.y, ballRadius * 2, ballRadius * 2)
    }
}


Sketches.mouseFromCenter = p => {
    let center: p5.Vector
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight)
        p.background(255)
        center = p.createVector(p.width / 2, p.height / 2)
    }


    p.draw = function () {
        p.background(255)
        const mouse = p.createVector(p.mouseX, p.mouseY)
        const diff = p5.Vector.sub(mouse, center)

        p.translate(p.width / 2, p.height / 2)
        p.line(0, 0, diff.x, diff.y)
    }
}
