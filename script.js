var currentHue = 0;
var ballInfo = {
    x: 0,
    y: 0,
    dx: 20,
    dy: 0
}
var ballLines = [0,90,180,270];

function renderFrame() {
    currentHue += 0.5;
    if (currentHue > 360) {
        currentHue = 0;
    }

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;

    //clear the canvas
    ctx.clearRect(0, 0, width, height);

    //draw the circle
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, height / 2 - 5, 0, 2 * Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'hsl(' + currentHue + ', 100%, 50%)';
    ctx.stroke();

    //draw the ball
    ctx.beginPath();
    ctx.arc(ballInfo.x, ballInfo.y, 30, 0, 2 * Math.PI);
    ctx.fillStyle = 'hsl(' + currentHue + ', 100%, 50%)';
    ctx.fill();

    // ball physics, gravity and collision with circle
    ballInfo.x += ballInfo.dx;
    ballInfo.y += ballInfo.dy;
    ballInfo.dy += 0.3;
    var dx = ballInfo.x - width / 2;
    var dy = ballInfo.y - height / 2;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > height / 2 - 30) {
        var normalX = dx / distance;
        var normalY = dy / distance;
        var dot = ballInfo.dx * normalX + ballInfo.dy * normalY;
        ballInfo.dx -= 2 * dot * normalX;
        ballInfo.dy -= 2 * dot * normalY;
    }
}

function init() {
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ballInfo.x = canvas.width / 2;
    ballInfo.y = canvas.height / 2;

    setInterval(renderFrame, 1000 / 60);
}

setTimeout(init, 100);