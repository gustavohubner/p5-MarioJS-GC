let qt;
let debug = true

function setup() {
    let renderer = createCanvas(windowWidth-50, windowHeight-50);
    renderer.parent("p5js");

    frameRate(1)

    document.oncontextmenu = function () {
        return false;
    }

    bound = new Rect(width / 2, height / 2, width / 2, height / 2,);
    qt = new QuadTree(bound, 4,debug);


    noLoop()
    qt.draw()
}


function draw() {



}



function mouseClicked(event) {
    if (mouseY < height) {
        // if (x == 19) {
            background(0)
            let pnt = new Point(mouseX, mouseY)
            qt.insert(pnt)
            qt.draw()
        // }
        return false
    }
    
}