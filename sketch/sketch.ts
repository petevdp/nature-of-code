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
    let location = [100, 100]
    const speed = [5.5, 3.3]
    const ballRadius = 20

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight)
        p.background(255)
    }

    p.draw = function () {
        p.background(255)
        location = _.zip(location, speed).map(([l, s], i) => l + s)

        const [x, y] = location

        if (x > (p.width - ballRadius) || x < (0 + ballRadius)) {
            speed[0] *= -1
        }
        if (y > (p.height - ballRadius) || y < (0 + ballRadius)) {
            speed[1] *= -1
        }
        p.stroke(0)
        p.fill(175)
        p.ellipse(x, y, ballRadius * 2, ballRadius * 2)
    }
}