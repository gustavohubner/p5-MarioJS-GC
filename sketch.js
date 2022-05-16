let qt;
let bound
let allObjects = [];
let player;

let blocks;
let mario

let x;

let debug = false;
let gap;

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
        loadImage('sprites/pole.png')

    ]
    mario = loadImage('sprites/marioSheet.png')
}


function setup() {

    createCanvas(320, 240);
    // scale()


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

function draw() {
    // document.getElementById('fps').innerText = floor(frameRate())
    bound.x = player.x
    translate(-player.x - 8 + width / 2, 8)
    fall = false;

    background(92, 148, 252);

    qt = new QuadTree(bound, 4, null);
    qt.batchInsert(allObjects)


    rectMode(CORNER);
    let range = new Rect(player.x, player.y, 32, 32);
    // let range2 = new Rect(player.x, player.y, 2, 2);
    // let pnt = new Rect((int)((mouseX + 8) / 16) * 16, (int)((mouseY + 8) / 16) * 16, 16, 16)
    let pnt = new Sprite(x, (int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, blocks[x].width, blocks[x].height)
    // pnt.opacity = 127;

    let pnt2 = new Rect((int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, 16, 16)

    qt.draw()
    stroke("green");

    let mPoint = new Point(player.x, player.y) //player
    let mPoint2 = new Point(player.x, player.y - 1) // player jump collider

    strokeWeight(1);

    let objects = qt.query(range);
    pnt.draw()
    pnt2.draw("green")


    player.move_u = true;
    player.move_d = true;
    player.move_l = true;
    player.move_r = true;

    if (objects != null) {
        // console.log(objects.length)
        for (let p of objects) {
            if (p instanceof Sprite) {
                if (p.intersects(range))
                    stroke("green");
                if (p.contains(mPoint)) {
                    stroke("red");
                    if (p.contains(mPoint2)) {
                        // console.log(abs(p.x - player.x),abs(p.y - player.y))


                        if (p.y < player.y && abs(p.x - player.x) < 10 && ((player.y - p.y) < 15) && (player.y - p.y) > 0) {
                            player.move_u = false
                            player.vel.y = 0
                            player.y += (16 - abs(player.y - p.y));
                            player.y++;
                            // stroke("orange");
                            // strokeWeight(5)
                            // point(p.x, p.y)
                            // console.log("up")
                            continue

                        }


                    }

                    if ((p.y >= player.y) && (abs(p.x - player.x) < 15) && (abs(p.y - player.y) <= 16) && (abs(p.y - player.y) > 8)) {
                        player.move_d = false;
                        player.jumpLock = false
                        player.vel.y = 0
                        player.y -= abs(16 - (p.y - player.y))
                        // player.y--
                        // console.log("down")
                        continue
                    }

                    if ((p.x < player.x) && (abs(player.x - p.x) <= 16) && (abs(p.y - player.y) < 15)) {
                        player.move_l = false;
                        player.vel.x = 0
                        player.x += (16 - abs(player.x - p.x))

                        // console.log("l")
                        continue
                        // player.x++;
                    }
                    if ((p.x > player.x) && (abs(player.x - p.x) <= 16) && (abs(p.y - player.y) < 15)) {
                        player.move_r = false;
                        player.vel.x = 0
                        player.x -= (16 - abs(player.x - p.x))

                        // console.log("r")

                        continue
                        // player.x--;
                    }

                    // strokeWeight(5)
                    // point(p.x, p.y)
                }


                // strokeWeight(1)
                // rectMode(CENTER);
                // rect(p.x, p.y, p.w, p.h)
            }
        }
    }

    if (start) {
        let gravity = createVector(0, 0.1);
        if (player.move_d) player.applyForce(gravity);
    }


    // console.log(player.move_l, player.move_r)
    player.update()
    player.draw()



    if (mouseIsPressed === true) {
        if (mouseButton === RIGHT) {
            let result = qt.query(new Rect((int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, 7, 7))
            if (result != null) {
                index = allObjects.indexOf(result[0]);
                if (index > -1) {
                    allObjects.splice(index, 1); // 2nd parameter means remove one item only
                }
            }
        }
    }
}


function keyPressed() {
    start = true;
}
function mouseClicked(event) {


    if (x > 7) {
        print("background")
        pnt = new BackgroundSprite(x, (int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, blocks[x].width, blocks[x].height)
    } else
        pnt = new Sprite(x, (int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, blocks[x].width, blocks[x].height)

    allObjects.push(pnt);

    return false;
}

function saveLevel() {
    out = []
    allObjects.forEach(function (e) {
        // console.log(e.x,e.y)
        out.push([e.x, e.y, e.sprite])
    })
    // console.log(JSON.stringify(out))
    return JSON.stringify(out);
}

function loadLevel(level) {
    allObjects = []
    arr = JSON.parse(level)

    arr.forEach(function (e) {
        if (e[2] > 7)
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
    print(x)

}

