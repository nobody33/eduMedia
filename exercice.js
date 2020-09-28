var mousePosition;
var isMouseDown;

var canvas = document.getElementById("window");

var closer = canvas.getContext("2d");
var center = canvas.getContext("2d");
var context = canvas.getContext("2d");

var red_circle = new Circle(200, 120, 50, "red", "black");
var yellow_circle = new Circle(400, 500, 50, "yellow", "black");
var blue_circle = new Circle(700, 250, 50, "blue", "black");

var circles = [red_circle, yellow_circle, blue_circle];

var focused = {
    key: 0,
    state: false
 }

document.addEventListener('mousemove', move, false);
document.addEventListener('mousedown', setDraggable, false);
document.addEventListener('mouseup', setDraggable, false);

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCircles();
}

function getDistance(circle){

    var distance = Math.sqrt(Math.pow( circle.x - (canvas.width/2), 2) + Math.pow( circle.y - (canvas.height/2), 2));

    return distance;
}

function drawCircles() {
    for (var i = circles.length - 1; i >= 0; i--) {
        circles[i].draw();
    }

    center.beginPath();
    center.arc(canvas.width/2, canvas.height/2, 10, 0, 2 * Math.PI);
    center.fillStyle = "black";
    center.fill();

    if(getDistance(red_circle) < getDistance(yellow_circle) && getDistance(red_circle) < getDistance(blue_circle))
    {
        closer_name = "Red";
    }
    else if(getDistance(yellow_circle) < getDistance(red_circle) && getDistance(yellow_circle) < getDistance(blue_circle))
    {
        closer_name = "Yellow";
    }
    else
    {
        closer_name = "Blue";
    }

    closer.font="30pt Arial";
    closer.textAlign = "center";
    closer.fillText(closer_name, canvas.width/2, 50);
}

function Circle(x, y, r, fill, stroke) {
    this.startingAngle = 0;
    this.endAngle = 2 * Math.PI;
    this.x = x;
    this.y = y;
    this.r = r;

    this.fill = fill;
    this.stroke = stroke;

    this.draw = function () {
        context.beginPath();
        context.arc(this.x, this.y, this.r, this.startingAngle, this.endAngle);
        context.fillStyle = this.fill;
        context.lineWidth = 3;
        context.fill();
        context.strokeStyle = this.stroke;
        context.stroke();
    }
}

function move(e) {
    if (!isMouseDown) {
        return;
    }
    getMousePosition(e);
    if (focused.state) {
        circles[focused.key].x = mousePosition.x;
        circles[focused.key].y = mousePosition.y;
        draw();
        return;
    }
    for (var i = 0; i < circles.length; i++) {
        if (intersects(circles[i])) {
            circles.move(i, 0);
            focused.state = true;
            break;
        }
    }
    draw();
}

function setDraggable(e) {
    var t = e.type;
    if (t === "mousedown") {
        isMouseDown = true;
    } else if (t === "mouseup") {
        isMouseDown = false;
        releaseFocus();
    }
}

function releaseFocus() {
    focused.state = false;
}

function getMousePosition(e) {
    var rect = canvas.getBoundingClientRect();
    mousePosition = {
        x: Math.round(e.x - rect.left),
        y: Math.round(e.y - rect.top)
    }
}

function intersects(circle) {
    var areaX = mousePosition.x - circle.x;
    var areaY = mousePosition.y - circle.y;
    return areaX * areaX + areaY * areaY <= circle.r * circle.r;
}

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
};

draw();