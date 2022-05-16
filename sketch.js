let qt;
let qtEnemies;
let bound
let allObjects = [];
let enemies = []
let player;

let blocks;
let mario

let x;

let debug = false;
let gap;

let gravity

function preload() {


    blocks = [
        loadImage('sprites/block.png'),
        loadImage('sprites/brick.png'),
        loadImage('sprites/ground.png'),
        loadImage('sprites/question.png'),
        loadImage('sprites/pipe1.png'),
        loadImage('sprites/pipe2.png'),
        loadImage('sprites/pipe3.png'),
        loadImage('sprites/pipe4.png'),
        loadImage('sprites/mountain.png'),
        loadImage('sprites/mountain2.png'),
        loadImage('sprites/bush.png'),
        loadImage('sprites/bush2.png'),
        loadImage('sprites/bush3.png'),
        loadImage('sprites/clouds.png'),
        loadImage('sprites/clouds2.png'),
        loadImage('sprites/clouds3.png'),
        loadImage('sprites/castle.png'),
        loadImage('sprites/pole.png'),
        loadImage('sprites/goomba.png')

    ]
    mario = loadImage('sprites/marioSheet.png')
}


function setup() {


    gravity = createVector(0, 0.1);
    let renderer = createCanvas(320, 240);
    renderer.parent("p5js");
    adjust()

    frameRate(60)

    document.oncontextmenu = function () {
        return false;
    }

    gap = 0
    x = 0

    bound = new Rect((width - (gap / 2)) / 2, (height - 16 + (gap / 2)) / 2, (width + 100 + gap) / 2, (height + gap) / 2);
    player = new Player(width / 2, height / 2);


    load11()

}
let start = false;

let mPoint
let mPoint2
let range
function draw() {


    translate(floor(-player.x - 8 + width / 2), 8)

    // document.getElementById('fps').innerText = floor(frameRate())
    bound.x = player.x
    fall = false;

    background(92, 148, 252);

    qt = new QuadTree(bound, 4, null);
    qtEnemies = new QuadTree(bound, 4, null);
    qtEnemies.batchInsert(enemies)
    qt.batchInsert(allObjects)

    rectMode(CORNER);
    range = new Rect(player.x, player.y, 32, 32);
    
    let pnt = new Sprite(x, (int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, blocks[x].width, blocks[x].height)
    let pnt2 = new Rect((int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, 16, 16)
    if (x == 18)
        pnt = new Sprite(x, (int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, blocks[x].width, blocks[x].height)
    qt.draw()
    stroke("green");

    mPoint = new Point(player.x, player.y) //player
    mPoint2 = new Point(player.x, player.y - 1) // player jump collider

    strokeWeight(1);


    pnt.draw()
    pnt2.draw("green")


    // player.checkCollisions(qt)
    // player.checkCollisions(qtEnemies)

    // if (start) {
    //     if (player.move_d) player.applyForce(gravity);
    // }

    qtEnemies.draw()
    player.draw()
    player.update()

    if (mouseIsPressed === true) {
        // console.log(mouseY,)
        if (mouseY <= height) {
            if (mouseButton === RIGHT) {

                let result = qt.query(new Rect((int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, 7, 7))
                if (result != null) {
                    index = allObjects.indexOf(result[0]);
                    if (index > -1) {
                        allObjects.splice(index, 1);
                    }
                }

                result = qtEnemies.query(new Rect((int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, 7, 7))
                if (result != null) {
                    index = enemies.indexOf(result[0]);
                    if (index > -1) {
                        enemies.splice(index, 1);
                    }
                }
            }
        } else {
            start = true
            if (mouseX < width / 3) {
                touchControl.left = true
                touchControl.right = false
                touchControl.up = false
            } else if (mouseX > 2 * width / 3) {
                touchControl.left = false
                touchControl.right = true
                touchControl.up = false
            } else {
                touchControl.up = true
            }
        }
    } else {
        touchControl.left = false
        touchControl.right = false
        touchControl.up = false

    }
}


function keyPressed() {
    start = true;
}

function mouseClicked(event) {
    if (mouseY < height) {
        if (x == 18) {
            print('enemy')
            pnt = new Enemy(x, (int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, 16, 16)
            enemies.push(pnt)
            return false
        } else if (x > 7) {
            print("background")
            pnt = new BackgroundSprite(x, (int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, blocks[x].width, blocks[x].height)
        } else
            pnt = new Sprite(x, (int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, blocks[x].width, blocks[x].height)

        allObjects.push(pnt);
    }
    return false;
}

function saveLevel() {
    out = []
    allObjects.forEach(function (e) {
        // console.log(e.x,e.y)
        out.push([e.x, e.y, e.sprite])
    })

    enemies.forEach(function (e) {
        // console.log(e.x,e.y)
        out.push([e.x, e.y, e.sprite])
    })
    // console.log(JSON.stringify(out))
    return JSON.stringify(out);
}

function loadLevel(level) {
    allObjects = []
    enemies = []
    arr = JSON.parse(level)

    arr.forEach(function (e) {
        if (e[2] == 18) {
            pnt = new Enemy(e[2], (int)(e[0] / 16) * 16, (int)(e[1] / 16) * 16, 16,16)
            enemies.push(pnt)
            return
        } else if (e[2] > 7)
            pnt = new BackgroundSprite(e[2], (int)(e[0] / 16) * 16, (int)(e[1] / 16) * 16, blocks[e[2]].width, blocks[e[2]].height)
        else
            pnt = new Sprite(e[2], (int)(e[0] / 16) * 16, (int)(e[1] / 16) * 16, blocks[e[2]].width, blocks[e[2]].height)
        allObjects.push(pnt)
    })

}

function mouseWheel(event) {
    if (event.delta > 0)
        x = (x + 1) % blocks.length
    else
        x = (x - 1) % blocks.length
    x = x < 0 ? blocks.length - 1 : x
}

let touchControl = {
    left: false,
    right: false,
    up: false
}
