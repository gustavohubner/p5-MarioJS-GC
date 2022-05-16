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

                setTimeout(
                    function () {
                        noLoop()
                        background(0)
                    }, 1000);

                setTimeout(
                    function () {
                        loop()
                        load11()
                        player.x = width / 2
                        player.y = height / 2
                        player.dead = false
                        player.vel = createVector(0, 0)

                        player.lock = false

                    }, 3000);
            }
        }


        this.jumpLock = false;
    }

    checkCollisions(qtree) {
        // console.log(qtree)
        if (!this.dead) {
            let objects = qtree.query(range, []);
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
        if (p.intersects(range))
            // stroke("green");
            if (p.contains(mPoint)) {
                // stroke("red");
                if (p.contains(mPoint2)) {
                    if (p.y < this.y && abs(p.x - this.x) < 10 && ((this.y - p.y) < 15) && (this.y - p.y) > 0) {
                        if (isEnemy) {
                            this.die()
                            return
                        } else {
                            this.move_u = false
                            this.vel.y = 0
                            this.y += (16 - abs(this.y - p.y));
                            this.y++;
                            return
                        }
                    }
                }
                if ((p.y >= this.y) && (abs(p.x - this.x) < 15) && (abs(p.y - this.y) <= 16) && (abs(p.y - this.y) > 8)) {

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
                    }
                    return
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
            var jump = createVector(0, -3.7)
            this.applyForce(jump)
            // console.log('jump')
            this.jumpLock = true;
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
        this.acc = createVector(0, 0)
        this.vel.x = 0
        this.dead = true

    }
}


