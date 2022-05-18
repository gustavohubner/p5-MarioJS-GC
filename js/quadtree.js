class QuadTree {
    constructor(boundary, config) {
        this.boundary = boundary;
        this.points = [];
        this.divided = false;
        this.config = debug
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        let ne = new Rect(x + w / 2, y - h / 2, w / 2, h / 2);
        this.northeast = new QuadTree(ne, this.config);
        let nw = new Rect(x - w / 2, y - h / 2, w / 2, h / 2);
        this.northwest = new QuadTree(nw, this.config);
        let se = new Rect(x + w / 2, y + h / 2, w / 2, h / 2);
        this.southeast = new QuadTree(se, this.config);
        let sw = new Rect(x - w / 2, y + h / 2, w / 2, h / 2);
        this.southwest = new QuadTree(sw, this.config);

        this.divided = true;

        for (let p of this.points) {
            this.insert(p)
        }
        this.points = [];
    }

    insert(point) {
        if (!this.boundary.contains(point)) {
            return false;
        }
        if ((this.points.length < this.config.capacity) && !this.divided) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }
            if (this.northeast.insert(point)) {
                return true;
            } else if (this.northwest.insert(point)) {
                return true;
            } else if (this.southeast.insert(point)) {
                return true;
            } else if (this.southwest.insert(point)) {
                return true;
            }
        }
    }

    query(range, found = []) {
        if ((this.points.length == 0) && !this.divided) return found
        if (!this.boundary.intersects(range)) {
            return;
        } else {
            if (this.divided) {
                this.northwest.query(range, found);
                this.northeast.query(range, found);
                this.southwest.query(range, found);
                this.southeast.query(range, found);
            } else {
                for (let p of this.points) {
                    if (range.contains(p)) {
                        found.push(p);
                    }
                }
            }
        }
        return found;
    }

    batchInsert(points) {
        this.points = [];
        this.divided = false;
        points.forEach(point => {
            this.insert(point);
        });
    }

    // ----------------------
    draw() {
        if (this.config.value) {
            stroke(50);
            noFill();
            strokeWeight(1);
            rectMode(CENTER);
            rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);
        }
        if (this.divided) {
            this.northeast.draw();
            this.northwest.draw();
            this.southeast.draw();
            this.southwest.draw();
        }

        for (let p of this.points) {
            p.draw()
        }
    }

    count() {
        if (this.divided) {
            return this.northeast.count() + this.northwest.count() + this.southeast.count() + this.southwest.count()
        }
        return 1
    }
}


class QuadTreeNodes {
    constructor(boundary, config) {
        this.boundary = boundary;
        this.points = [];
        this.divided = false;
        this.config = debug
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        let ne = new Rect(x + w / 2, y - h / 2, w / 2, h / 2);
        this.northeast = new QuadTreeNodes(ne, this.config);
        let nw = new Rect(x - w / 2, y - h / 2, w / 2, h / 2);
        this.northwest = new QuadTreeNodes(nw, this.config);
        let se = new Rect(x + w / 2, y + h / 2, w / 2, h / 2);
        this.southeast = new QuadTreeNodes(se, this.config);
        let sw = new Rect(x - w / 2, y + h / 2, w / 2, h / 2);
        this.southwest = new QuadTreeNodes(sw, this.config);

        this.divided = true;
    }

    insert(point) {
        if (!this.boundary.contains(point)) {
            return false;
        }
        if ((this.points.length < this.config.capacity)) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }
            if (this.northeast.insert(point)) {
                return true;
            } else if (this.northwest.insert(point)) {
                return true;
            } else if (this.southeast.insert(point)) {
                return true;
            } else if (this.southwest.insert(point)) {
                return true;
            }
        }
    }

    draw() {
        if (this.config.value) {
            stroke(50);
            noFill();
            strokeWeight(1);
            rectMode(CENTER);
            rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);
        }
        if (this.divided) {
            this.northeast.draw();
            this.northwest.draw();
            this.southeast.draw();
            this.southwest.draw();
        }

        for (let p of this.points) {
            p.draw()
        }
    }

    count() {
        if (this.divided) {
            return this.northeast.count() + this.northwest.count() + this.southeast.count() + this.southwest.count()
        }
        return 1
    }
}


