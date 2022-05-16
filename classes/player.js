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

        this.speed = 2.5

        this.sprite = new AnimSprite(mario, this.x, this.y, 16, 16)
        // this.sprite.color = "pink"
    }

    draw() {
        this.sprite.x = floor(this.x)
        this.sprite.y = floor(this.y)
        this.sprite.draw(this.vel,this.acc)
    }

    applyForce(force) {
        this.acc.add(force)
    }

    update() {
        if (this.vel.x < 0.03 && this.vel.x > -0.03) this.vel.x = 0

        this.vel.add(this.acc)
        this.acc.set(0, 0)

        // console.log(this.vel.x)
        if (keyIsDown(UP_ARROW) || touchControl.up) {
            this.jump()
        }

        if ((keyIsDown(LEFT_ARROW)|| touchControl.left) && this.move_l) {
            if (this.vel.x > 0.1) this.vel.x *= this.breaking / 1.1
            else this.applyForce(createVector(-this.accel, 0))
        } else if ((keyIsDown(RIGHT_ARROW) || touchControl.right )&& this.move_r) {
            if (this.vel.x < -0.1) this.vel.x *= this.breaking / 1.1
            else this.applyForce(createVector(this.accel, 0))
        } else {
            this.vel.x *= this.breaking
        }
        if (this.vel.x != 0) {
            if (this.vel.x > this.speed) this.vel.x = this.speed
            if (this.vel.x < -this.speed) this.vel.x = -this.speed
        }

        // if (this.vel.y != 0 && this.vel.y > 5) this.vel.y = 5

        // if (!this.move_d && this.vel.y > 0) this.vel.y = 0

        this.x += this.vel.x
        this.y += this.vel.y


        if (this.y > height) {
            this.x = width / 2
            this.y = height / 2

            this.vel = createVector(0, 0)
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
}


