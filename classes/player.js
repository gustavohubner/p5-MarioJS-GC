class Player {
    constructor(x, y) {
        // velocity
        this.vel = createVector(0, 0)
        this.acc = createVector(0, 0)
        // position
        this.x = x;
        this.y = y;
        // movement
        this.move_l = true;
        this.move_r = true;
        this.move_u = true;
        this.move_d = true;

        this.breaking = 0.9
        this.accel = 0.05

        this.jumpLock = true
        this.lock = false
        this.dead = false
        this.speed = 2.5
        this.sprite = new AnimSprite(mario, this.x, this.y, 16, 16)

        this.range = new Rect(x, y, 32, 32);
        this.mPoint = new Point(x, y) //player
        this.mPoint2 = new Point(x, y - 1) // player jump collider
        // this.sprite.color = "pink"
    }

    draw() {
        this.sprite.x = floor(this.x)
        this.sprite.y = floor(this.y)
        this.sprite.draw(this.vel, this.dead)
    }

    applyForce(force) {
        this.acc.add(force)
    }

    update() {

        if (this.move_d) this.applyForce(gravity)

        this.move_l = true;
        this.move_r = true;
        this.move_u = true;
        this.move_d = true;


        if (this.vel.x < 0.03 && this.vel.x > -0.03) this.vel.x = 0

        this.range.x = this.x
        this.range.y = this.y
        this.mPoint.x = this.x
        this.mPoint.y = this.y
        this.mPoint2.x = this.x
        this.mPoint2.y = this.y - 1

        this.checkCollisions(qt)
        this.checkCollisions(qtEnemies)

        // console.log(gravity)
        this.vel.add(this.acc)
        this.acc.set(0, 0)

        if (!this.dead) {
            // console.log(this.vel.x)
            if (keyIsDown(UP_ARROW) || touchControl.up) {
                this.jump()
            }

            if ((keyIsDown(LEFT_ARROW) || touchControl.left) && this.move_l) {
                if (this.vel.x > 0.1) this.vel.x *= this.breaking / 1.1
                else this.applyForce(createVector(-this.accel, 0))
            } else if ((keyIsDown(RIGHT_ARROW) || touchControl.right) && this.move_r) {
                if (this.vel.x < -0.1) this.vel.x *= this.breaking / 1.1
                else this.applyForce(createVector(this.accel, 0))
            } else {
                this.vel.x *= this.breaking
            }
            if (this.vel.x != 0) {
                if (this.vel.x > this.speed) this.vel.x = this.speed
                if (this.vel.x < -this.speed) this.vel.x = -this.speed
            }
        }
        // if (this.vel.y != 0 && this.vel.y > 5) this.vel.y = 5

        // if (!this.move_d && this.vel.y > 0) this.vel.y = 0

        this.x += this.vel.x
        this.y += this.vel.y


        if (this.y > height) {
            if (!this.lock) {
                this.lock = true
                this.die()
                // setTimeout(
                //     function () {
                //         noLoop()
                //         background(0)
                //     }, 2000);

                setTimeout(
                    function () {
                        loop()
                        load11()
                        player.x = width / 2
                        player.y = height / 2
                        player.dead = false
                        player.vel = createVector(0, 0)
                        sounds[5].play()
                        player.lock = false

                    }, 4000);
            }
        }


        this.jumpLock = false;
    }

    checkCollisions(qtree) {
        // console.log(qtree)
        if (!this.dead) {
            let objects = qtree.query(this.range, []);
            if (objects != null) {
                for (let p of objects) {
                    if (p instanceof Enemy || p instanceof Sprite) {
                        player.collide(p)
                    }
                }
            }
        }
    }

    collide(p) {
        let isEnemy = p instanceof Enemy
        if (p.intersects(this.range))
            // stroke("green");
            if (p.contains(this.mPoint)) {
                // stroke("red");
                if (p.contains(this.mPoint2)) {
                    if (p.y < this.y && abs(p.x - this.x) < 10 && ((this.y - p.y) < 15) && (this.y - p.y) > 0) {
                        if (isEnemy) {
                            this.die()
                            return
                        } else {
                            if (p.sprite == 3) {
                                p.sprite = 8
                                setTimeout(function () { sounds[6].play() }, 100);
                            }
                            this.move_u = false
                            this.vel.y = 0
                            this.y += (16 - abs(this.y - p.y));
                            this.y++;
                            setTimeout(function () { sounds[0].stop() }, 110);
                            setTimeout(function () { sounds[3].play() }, 100);
                            return
                        }
                    }
                }
                if ((p.y >= this.y) && (abs(p.x - this.x) < 16) && (abs(p.y - this.y) <= 16) && (abs(p.y - this.y) > 8)) {

                    if (isEnemy) {
                        this.vel.y = 0
                        p.kill(p)
                        this.smallJump()
                        return
                    } else {
                        this.move_d = false;
                        this.jumpLock = false
                        this.vel.y = 0
                        this.y -= abs(16 - (p.y - this.y))
                        return
                    }
                }
                if ((p.x < this.x) && (abs(this.x - p.x) <= 16) && (abs(p.y - this.y) < 15)) {

                    if (isEnemy) {
                        this.vel.y = 0
                        this.die()
                        this.jump()
                        return
                    } else {
                        this.move_l = false;
                        this.vel.x = 0
                        this.x += (16 - abs(this.x - p.x))
                        return
                    }
                }
                if ((p.x > this.x) && (abs(this.x - p.x) <= 16) && (abs(p.y - this.y) < 15)) {
                    if (isEnemy) {
                        this.vel.y = 0
                        this.die()
                        this.jump()
                        return
                    } else {

                        this.move_r = false;
                        this.vel.x = 0
                        this.x -= (16 - abs(this.x - p.x))
                        return

                    }
                }
            }
    }

    jump() {
        if (!this.jumpLock && this.vel.y == 0) {
            this.y--;
            var jump = createVector(0, -5)
            this.applyForce(jump)
            // console.log('jump')
            this.jumpLock = true;
            if (!this.dead) setTimeout(function () { sounds[0].play() }, 100);
        }
    }

    smallJump() {
        // if (!this.jumpLock && this.vel.y == 0) {
        this.y--;
        var jump = createVector(0, -2)
        this.applyForce(jump)
        // console.log('jump')
        this.jumpLock = true;
        // }
    }

    die() {
        if (!this.dead) {
            this.acc = createVector(0, 0)
            this.vel.x = 0
            this.dead = true
            sounds[5].stop()
            sounds[2].play()
        }

    }
}


