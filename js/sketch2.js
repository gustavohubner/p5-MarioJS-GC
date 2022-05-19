let qt;
let debug = { value: true, capacity: 1 }

function setup() {
    let renderer = createCanvas(windowWidth - 50, windowHeight - 50);
    renderer.parent("p5js");

    document.oncontextmenu = function () {
        return false;
    }

    bound = new Rect(width / 2, height / 2, width / 2, height / 2,);
    qt = new QuadTree(bound, debug);

    noLoop()
    qt.draw()
}

function draw() {}

function mouseClicked(event) {
    if (mouseY < height) {
        background(0)
        let pnt = new Point(mouseX, mouseY)
        qt.insert(pnt)
        qt.draw()
        return false
    }

}