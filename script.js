var currentHue = 0;
var ballInfo = {
    x: 0,
    y: 0,
    dx: 5,
    dy: 0,
    radius: 30
}
var ballLines = [];
var notes = [];

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
    ctx.arc(ballInfo.x, ballInfo.y, ballInfo.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'hsl(' + currentHue + ', 100%, 50%)';
    ctx.fill();

    // ball physics, gravity and collision with circle
    ballInfo.x += ballInfo.dx;
    ballInfo.y += ballInfo.dy;
    ballInfo.dy += 0.1;
    var dx = ballInfo.x - width / 2;
    var dy = ballInfo.y - height / 2;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > height / 2 - ballInfo.radius) {
        var normalX = dx / distance;
        var normalY = dy / distance;
        var dot = ballInfo.dx * normalX + ballInfo.dy * normalY;
        ballInfo.dx -= 2 * dot * normalX;
        ballInfo.dy -= 2 * dot * normalY;

        var angle = Math.atan2(dy, dx) * 180 / Math.PI;
        ballLines.push(angle);
    }

    // draw the ball lines
    for (var i = 0; i < ballLines.length; i++) {
        var angle = ballLines[i];
        var radians = angle * Math.PI / 180;
        var x = width / 2 + (height / 2 - 5) * Math.cos(radians);
        var y = height / 2 + (height / 2 - 5) * Math.sin(radians);
        ctx.beginPath();
        ctx.moveTo(ballInfo.x, ballInfo.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'hsl(' + currentHue + ', 100%, 50%)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function init() {
    var text = document.getElementById('text');
    text.parentNode.removeChild(text);

    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ballInfo.x = canvas.width / 2;
    ballInfo.y = canvas.height / 2;

    setInterval(renderFrame, 1000/60);

    initMidi();
}

var synthPool = [];

async function initMidi(){
    const midi = await Midi.fromUrl("hells-greatest-dad.mid");
    midi.tracks.forEach(track => {
        track.notes.forEach(note => {
            notes.push({ freq: note.name, duration: note.duration, time: note.time, velocity: note.velocity});
        });
    });

    notes.forEach(note => {
        setTimeout(() => {
            var synth;
            if (synthPool.length > 10) {
                synth = synthPool.shift();
            } else {
                synth = new Tone.Synth().toDestination();
            }
            synth.triggerAttackRelease(note.freq, note.duration*1, undefined, note.velocity);
            synthPool.push(synth);
        }, note.time * 1000);
    });
}