let qt;
let qtEnemies;

let bound
let allObjects = [];
let enemies = []
let player;

let gravity

let blocks = [];
let sounds = []
let mario, marioSprites, goombaSprites

let x;
let debug = false;
let gap;

let q, question = [], startImg, gui,lives


let start = false;
let pnt, pnt2, xPos

function preload() {
    q = loadImage('sprites/questionAnim.png')
    startImg = loadImage('sprites/menu.png')
    // lives =  loadImage('sprites/start.png')
    gui = loadImage('sprites/gui.png')

    blocks = [
        loadImage('sprites/block.png'),
        loadImage('sprites/brick.png'),
        loadImage('sprites/ground.png'),
        loadImage('sprites/question.png'),
        loadImage('sprites/pipe1.png'),
        loadImage('sprites/pipe2.png'),
        loadImage('sprites/pipe3.png'),
        loadImage('sprites/pipe4.png'),
        loadImage('sprites/used.png'),
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

    sounds = [
        loadSound('sounds/jump.wav'),
        loadSound('sounds/stomp.wav'),
        loadSound('sounds/m_die.wav'),
        loadSound('sounds/bump.wav'),
        loadSound('sounds/pause.wav'),
        loadSound('sounds/theme.wav'),
        loadSound('sounds/coin.wav'),
        loadSound('sounds/kick.wav'),
        loadSound('sounds/stage_clear.wav')
    ]
    mario = loadImage('sprites/marioSheet.png')




}


function setup() {

    question = [
        q.get(0 * 16, 0, 16, 16),
        q.get(1 * 16, 0, 16, 16),
        q.get(2 * 16, 0, 16, 16),
        q.get(1 * 16, 0, 16, 16),
        q.get(0 * 16, 0, 16, 16),
        q.get(0 * 16, 0, 16, 16),
    ]

    marioSprites = [
        mario.get(0 * 16, 0, 16, 16),
        mario.get(1 * 16, 0, 16, 16),
        mario.get(2 * 16, 0, 16, 16),
        mario.get(3 * 16, 0, 16, 16),
        mario.get(4 * 16, 16, 16, 16),
        mario.get(5 * 16, 0, 16, 16),
        mario.get(6 * 16, 0, 16, 16),
        mario.get(0 * 16, 16, 16, 16),
        mario.get(1 * 16, 16, 16, 16),
        mario.get(2 * 16, 16, 16, 16),
        mario.get(3 * 16, 16, 16, 16),
        mario.get(4 * 16, 0, 16, 16),
        mario.get(5 * 16, 16, 16, 16),
        mario.get(6 * 16, 16, 16, 16),
    ]

    goombaSprites = [
        blocks[19].get(0 * 16, 0, 16, 16),
        blocks[19].get(1 * 16, 0, 16, 16),
        blocks[19].get(2 * 16, 0, 16, 16)
    ]

    gravity = createVector(0, 0.2);
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
    player = new Player(width / 2, height - 48);

    pnt = new Sprite(x, (int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, blocks[x].width, blocks[x].height)

    pnt2 = new Rect((int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, 16, 16)

    qt = new QuadTree(bound, 16, debug);
    qtEnemies = new QuadTree(bound, 16, debug);

    load11()
    sounds[5].loop()
    sounds[5].pause()
    noFill()
}


function draw() {
    if (player.x > 3193) {
        sounds[5].stop()
        sounds[8].play()
        noLoop()
        setTimeout(function () {
            start = false; player.x = width / 2;
            player.y = height - 48;
            player.dead = false;
            player.vel = createVector(0, 0); 
            player.acc = createVector(0, 0); 
            player.lives = 3
            load11()
            loop();
        }, 8000);
    }
    background(92, 148, 252);
    if (!start) {
        imageMode(CENTER)
        image(startImg, width / 2, height / 2, startImg.width, startImg.height)
        noLoop()
        return
    }
    blocks[3] = question[floor(frameCount / 8) % 6]

    xPos = floor(Math.min(Math.max((-player.x - 8 + width / 2), -3176), -8));
    translate(xPos, 8)

    bound.x = -xPos + width / 2
    qtEnemies.batchInsert(enemies)
    qt.batchInsert(allObjects)
    qt.draw()
    rectMode(CORNER);
    if (mouseX < width && mouseY < height) {
        pnt = new Sprite(x, (int)((-xPos + mouseX)/ 16) * 16, (int)((mouseY) / 16) * 16, blocks[x].width, blocks[x].height)
        pnt2 = new Rect((int)((-xPos + mouseX) / 16) * 16, (int)((mouseY) / 16) * 16, 16, 16)
        if (x == 19)
            pnt = new Sprite(x, (int)((-xPos + mouseX)/ 16) * 16, (int)((mouseY) / 16) * 16, blocks[x].width, blocks[x].height)

        stroke("green");
        strokeWeight(1);
        pnt.draw()
        pnt2.draw("green")
    }

    qtEnemies.draw()
    player.draw()

    imageMode(CENTER)
    translate(-xPos, -8)
    image(gui, width / 2, height / 2, startImg.width, startImg.height)


    player.update()

    if (mouseIsPressed === true) {
        if (mouseY <= height) {
            if (mouseButton === RIGHT) {

                let result = qt.query(new Rect((int)((-xPos + mouseX) / 16) * 16, (int)((mouseY) / 16) * 16, 7, 7))
                if (result != null) {
                    index = allObjects.indexOf(result[0]);
                    if (index > -1) {
                        allObjects.splice(index, 1);
                    }
                }

                result = qtEnemies.query(new Rect((int)((-xPos + mouseX) / 16) * 16, (int)((mouseY) / 16) * 16, 7, 7))
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
    if (keyCode === ENTER) {
        if (!player.lock) {
            sounds[5].pause()
            sounds[4].play()
            if (isLooping()) noLoop()
            else {
                loop()
                if (!player.dead) setTimeout(function () { sounds[5].play() }, 500);

            }
        }
    }
}

function mouseClicked(event) {
    if (mouseY < height) {
        if (start) {
            if (x == 19) {
                print('enemy')
                pnt = new Enemy(x, (int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, 16, 16)
                enemies.push(pnt)
                return false
            } else if (x > 8) {
                print("background")
                pnt = new BackgroundSprite(x, (int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, blocks[x].width, blocks[x].height)
            } else
                pnt = new Sprite(x, (int)((mouseX + 16 + player.x - width / 2) / 16) * 16, (int)((mouseY) / 16) * 16, blocks[x].width, blocks[x].height)

            allObjects.push(pnt);
        }
    } else {
        if (!start) {
            start = true;
            sounds[5].pause()
            sounds[4].play()
            if (isLooping()) noLoop()
            else {
                loop()
                if (!player.dead) setTimeout(function () { sounds[5].play() }, 500);

            }
        }
    }


    return false;
}

function saveLevel() {
    out = []
    allObjects.forEach(function (e) {
        out.push([e.x, e.y, e.sprite])
    })

    enemies.forEach(function (e) {
        out.push([e.x, e.y, e.sprite])
    })
    return JSON.stringify(out);
}

function loadLevel(level) {
    allObjects = []
    enemies = []
    arr = JSON.parse(level)

    arr.forEach(function (e) {
        if (e[2] == 19) {
            pnt = new Enemy(e[2], (int)(e[0] / 16) * 16, (int)(e[1] / 16) * 16, 16, 16)
            enemies.push(pnt)
            return
        } else if (e[2] > 8)
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

function atualiza() {
    for (p of allObjects) {
        if (p.sprite > 7)
            p.sprite++
    }
}
