var topleft = null;
var topmid = null;
var topright = null;
var centerleft = null;
var centermid = null;
var centerright = null;
var bottomleft = null;
var bottommid = null;
var bottomright = null;
var turncount = 0;
var turn;
var icon;
var status;
var firstturn;
var pl1_score = 0;
var pl2_score = 0;
var pl1_icon = "circlewhite.png";
var pl2_icon = "crosswhite.png";
var boxes_status = [
    [["topleft", null], ["centerleft", null], ["bottomleft", null]],
    [["topmid", null], ["centermid", null], ["bottommid", null]],
    [["topright", null], ["centerright", null], ["bottomright", null]],
    [["topleft", null], ["topmid", null], ["topright", null]],
    [["centerleft", null], ["centermid", null], ["centerright", null]],
    [["bottomleft", null], ["bottommid", null], ["bottomright", null]],
    [["topleft", null], ["centermid", null], ["bottomright", null]],
    [["topright", null], ["centermid", null], ["bottomleft", null]]
]



function hidestartbutton() {
    document.getElementById('startbutton').style.display = 'none';
    document.getElementById('inputnames').style.display = 'block';
}

function toss() {
    var x = Math.floor((Math.random() * 100) + 1);
    if (x % 2 == 0) {
        turn = "1turn";
        icon = pl1_icon;
        firstturn = sessionStorage.getItem("player1name");
    }
    else {
        turn = "2turn";
        icon = pl2_icon;
        $("#line").animate({
            marginLeft: "+=1060px"
        });
        firstturn = sessionStorage.getItem("player2name");
    }

}

function updatearray(boxname, boxvalue) {

    for (let i = 0; i < boxes_status.length; i++) {
        for (let m = 0; m < boxes_status[i].length; m++) {
            if (boxes_status[i][m][0] == boxname) {
                boxes_status[i][m][1] = boxvalue;
            }
        }
    }
}

function resetarray() {

    for (let i = 0; i < boxes_status.length; i++) {
        for (let m = 0; m < boxes_status[i].length; m++) {
            boxes_status[i][m][1] = null;
        }
    }
}

function playaudio(src) {
    var sound = new Audio();
    sound.src = src;
    sound.play();
        
}

function draw(box, boxid) {
    var r = document.createElement("img");
    r.setAttribute("src", icon);
    box.appendChild(r);
    playaudio("button.mp3")

    if (boxid.includes("top")) {
        if (boxid.includes("left")) {
            topleft = icon;
            updatearray("topleft", icon);
        }
        else if (boxid.includes("mid")) {
            topmid = icon;
            updatearray("topmid", icon);
        }
        else if (boxid.includes("right")) {
            topright = icon;
            updatearray("topright", icon);
        }
    }
    else if (boxid.includes("center")) {
        if (boxid.includes("left")) {
            centerleft = icon;
            updatearray("centerleft", icon);
        }
        else if (boxid.includes("mid")) {
            centermid = icon;
            updatearray("centermid", icon);
        }
        else if (boxid.includes("right")) {
            centerright = icon;
            updatearray("centerright", icon);
        }
    }
    else if (boxid.includes("bottom")) {
        if (boxid.includes("left")) {
            bottomleft = icon;
            updatearray("bottomleft", icon);
        }
        else if (boxid.includes("mid")) {
            bottommid = icon;
            updatearray("bottommid", icon);
        }
        else if (boxid.includes("right")) {
            bottomright = icon;
            updatearray("bottomright", icon);
        }
    }

    if (turn == "1turn") {
        turnLine();
        turn = "2turn";
        icon = pl2_icon;
        turncount = turncount + 1;
    }
    else {
        turnLine();
        turn = "1turn";
        icon = pl1_icon;
        turncount = turncount + 1;
    }

    document.getElementById(boxid).removeAttribute("onclick");
    if (turncount >= 5) {
        conditioncheck()
    }
}

function conditioncheck() {
    for (let index = 0; index < boxes_status.length; index++) {
        status = boxcheck(boxes_status[index][0][1], boxes_status[index][1][1], boxes_status[index][2][1]);
        if (status == "disallowed") {
            if (turncount == 9 && index == 7) {
                popup("You Both tied:(", "hide", "clear_board(); hidethem('msgbox'); ", "Play Again");
                playaudio("tie.mp3");
                pl1_score++;
                pl2_score++;

                document.getElementById('leftscorenum').innerHTML = pl1_score.toString();
                document.getElementById('rightscorenum').innerHTML = pl2_score.toString();
                break;
            }
        }
        else if (status == "circlewhite.png" || status == "crosswhite.png") {
            if (pl1_icon == status) {
                document.getElementById('canvas').style.display = 'block';
                loop();
                var r = sessionStorage.getItem("player1name").toUpperCase();
                popup(r + " WON!", "hide", "clear_board(); hidethem('msgbox'); ", "Play Again");
                playaudio("tada.mp3");
                pl1_score = pl1_score + 2;
                document.getElementById('leftscorenum').innerHTML = pl1_score.toString();
                break;
            }
            else {
                document.getElementById('canvas').style.display = 'block';
                loop();
                var r = sessionStorage.getItem("player2name").toUpperCase();
                popup(r + " WON!", "hide", "clear_board(); hidethem('msgbox'); ", "Play Again");
                playaudio("tada.mp3");
                pl2_score = pl2_score + 2;
                document.getElementById('rightscorenum').innerHTML = pl2_score.toString();
                break;
            }
        }
    }
}

function popup(msg, X_btn, multibtn, multibtnmsg) {
    document.getElementById('wonpopup').style.display = 'block';
    document.getElementById('msgbox').style.display = 'block';
    document.getElementById('msgcontent').innerHTML = msg;
    if (X_btn == "hide") {
        document.getElementById('closebtn').style.display = 'none';
    } else {
        document.getElementById('closebtn').setAttribute('onclick', X_btn);
    }
    document.getElementById('multipurposebtn').setAttribute('onclick', multibtn);
    document.getElementById('multipurposebtn').innerHTML = multibtnmsg;
}

function clear_board() {
    document.getElementById('canvas').style.display = 'none';
    $(".boxes").empty();
    $("td").removeAttr("onclick");
    $("td").attr("onclick", "draw(this,this.id);");
    resetarray();
    turncount = 0;
    if (firstturn == sessionStorage.getItem("player1name")) {
        if (turn == "1turn") {
            turnLine();
        }
        turn = "2turn";
        firstturn = sessionStorage.getItem("player2name");
    }
    else if (firstturn == sessionStorage.getItem("player2name")) {
        if (turn == "2turn") {
            turnLine();
        }
        turn = "1turn";
        firstturn = sessionStorage.getItem("player1name");

    }
}


function hidethem(divname) {
    document.getElementById('wonpopup').style.display = 'none';
    document.getElementById(divname).style.display = 'none';
}

function boxcheck(box1, box2, box3) {
    var fillcount = 0;
    if (box1 != null) {
        fillcount = fillcount + 1;
    }
    if (box2 != null) {
        fillcount = fillcount + 1;
    }
    if (box3 != null) {
        fillcount = fillcount + 1;
    }

    if (fillcount >= 2) {
        if ((box1 != box2) || (box1 != box3)) {
            return ("disallowed");
        }
        else if ((box1 == box2) && (box2 == box3)) {
            return (box1);
        }
    }
}

$(function playernameupdate() {
    var p1name = sessionStorage.getItem("player1name");
    var p2name = sessionStorage.getItem("player2name");
    document.getElementById("name1").innerHTML = p1name.toUpperCase();
    document.getElementById("name2").innerHTML = p2name.toUpperCase();
    popup("PRESS THE BUTTON TO TOSS", "hide", "toss(); choosesymbol()", "toss");

});



function choosesymbol() {
    document.getElementById('symbolmsg').innerHTML = firstturn.toUpperCase();
    document.getElementById('msgbox').style.display = 'none';
    document.getElementById('choose_symbol_box').style.display = 'block';

}

function startinggame() {

    var player1 = document.getElementById('inputone').value;
    var player2 = document.getElementById('inputtwo').value;
    sessionStorage.setItem("player1name", player1);
    sessionStorage.setItem("player2name", player2);
    window.open("game.html", "_top");
}

$(".animate").ready(function () {
    var p = $("#name1");
    var x = p.innerWidth();
    $("#line").width(x);
});

$(".animate").click(function () {
    $("#line").animate({
        marginLeft: "+=1060px"
    });
}
);

function symbolsetter(source) {
    var x;
    var y;
    if (source.includes("circle")) {
        x = "circlewhite.png";
        y = "crosswhite.png";
    }
    else {
        x = "crosswhite.png";
        y = "circlewhite.png";
    }
    if (turn.includes("1")) {
        pl1_icon = x;
        pl2_icon = y;
        icon = x;
        document.getElementById('symbols').style.display = 'block';
        document.getElementById('pl1symbol').src = x;
        document.getElementById('pl2symbol').src = y;

    }
    else {
        pl2_icon = x;
        pl1_icon = y;
        icon = x;
        document.getElementById('symbols').style.display = 'block';
        document.getElementById('pl1symbol').src = y;
        document.getElementById('pl2symbol').src = x;
    }
}


function symbolsetterchild(turn, source) {

}

function turnLine() {
    if (turn == "1turn") {
        $("#line").animate({
            marginLeft: "+=1060px"
        });
    }
    else if (turn == "2turn") {
        $("#line").animate({
            marginLeft: "-=1060px"
        });
    }
}



//________________________________________________FIREWORKS_____________________________________________________________________

// when animating on canvas, it is best to use requestAnimationFrame instead of setTimeout or setInterval
// not supported in all browsers though and sometimes needs a prefix, so we need a shim
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// now we will setup our basic variables for the demo
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    // full screen dimensions
    cw = window.innerWidth,
    ch = window.innerHeight,
    // firework collection
    fireworks = [],
    // particle collection
    particles = [],
    // starting hue
    hue = 120,
    // when launching fireworks with a click, too many get launched at once without a limiter, one launch per 5 loop ticks
    limiterTotal = 5,
    limiterTick = 0,
    // this will time the auto launches of fireworks, one launch per 80 loop ticks
    timerTotal = 80,
    timerTick = 0,
    mousedown = false,
    // mouse x coordinate,
    mx,
    // mouse y coordinate
    my;

// set canvas dimensions
canvas.width = cw;
canvas.height = ch;

// now we are going to setup our function placeholders for the entire demo

// get a random number within a range
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// calculate the distance between two points
function calculateDistance(p1x, p1y, p2x, p2y) {
    var xDistance = p1x - p2x,
        yDistance = p1y - p2y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// create firework
function Firework(sx, sy, tx, ty) {
    // actual coordinates
    this.x = sx;
    this.y = sy;
    // starting coordinates
    this.sx = sx;
    this.sy = sy;
    // target coordinates
    this.tx = tx;
    this.ty = ty;
    // distance from starting point to target
    this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    // track the past coordinates of each firework to create a trail effect, increase the coordinate count to create more prominent trails
    this.coordinates = [];
    this.coordinateCount = 3;
    // populate initial coordinate collection with the current coordinates
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = random(50, 70);
    // circle target indicator radius
    this.targetRadius = 1;
}

// update firework
Firework.prototype.update = function (index) {
    // remove last item in coordinates array
    this.coordinates.pop();
    // add current coordinates to the start of the array
    this.coordinates.unshift([this.x, this.y]);

    // cycle the circle target indicator radius
    if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }

    // speed up the firework
    this.speed *= this.acceleration;

    // get the current velocities based on angle and speed
    var vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;
    // how far will the firework have traveled with velocities applied?
    this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

    // if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
    if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);
        // remove the firework, use the index passed into the update function to determine which to remove
        fireworks.splice(index, 1);
    } else {
        // target not reached, keep traveling
        this.x += vx;
        this.y += vy;
    }
}

// draw firework
Firework.prototype.draw = function () {
    ctx.beginPath();
    // move to the last tracked coordinate in the set, then draw a line to the current x and y
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
    ctx.stroke();

    ctx.beginPath();
    // draw the target for this firework with a pulsing circle
    ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
    ctx.stroke();
}

// create particle
function Particle(x, y) {
    this.x = x;
    this.y = y;
    // track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    // set a random angle in all possible directions, in radians
    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 10);
    // friction will slow the particle down
    this.friction = 0.95;
    // gravity will be applied and pull the particle down
    this.gravity = 1;
    // set the hue to a random number +-50 of the overall hue variable
    this.hue = random(hue - 50, hue + 50);
    this.brightness = random(50, 80);
    this.alpha = 1;
    // set how fast the particle fades out
    this.decay = random(0.015, 0.03);
}

// update particle
Particle.prototype.update = function (index) {
    // remove last item in coordinates array
    this.coordinates.pop();
    // add current coordinates to the start of the array
    this.coordinates.unshift([this.x, this.y]);
    // slow down the particle
    this.speed *= this.friction;
    // apply velocity
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    // fade out the particle
    this.alpha -= this.decay;

    // remove the particle once the alpha is low enough, based on the passed in index
    if (this.alpha <= this.decay) {
        particles.splice(index, 1);
    }
}

// draw particle
Particle.prototype.draw = function () {
    ctx.beginPath();
    // move to the last tracked coordinates in the set, then draw a line to the current x and y
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
    ctx.stroke();
}

// create particle group/explosion
function createParticles(x, y) {
    // increase the particle count for a bigger explosion, beware of the canvas performance hit with the increased particles though
    var particleCount = 30;
    while (particleCount--) {
        particles.push(new Particle(x, y));
    }
}

// main demo loop
function loop() {
    // this function will run endlessly with requestAnimationFrame
    requestAnimFrame(loop);

    // increase the hue to get different colored fireworks over time
    //hue += 0.5;

    // create random color
    hue = random(0, 360);

    // normally, clearRect() would be used to clear the canvas
    // we want to create a trailing effect though
    // setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
    ctx.globalCompositeOperation = 'destination-out';
    // decrease the alpha property to create more prominent trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, cw, ch);
    // change the composite operation back to our main mode
    // lighter creates bright highlight points as the fireworks and particles overlap each other
    ctx.globalCompositeOperation = 'lighter';

    // loop over each firework, draw it, update it
    var i = fireworks.length;
    while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }

    // loop over each particle, draw it, update it
    var i = particles.length;
    while (i--) {
        particles[i].draw();
        particles[i].update(i);
    }

    // launch fireworks automatically to random coordinates, when the mouse isn't down
    if (timerTick >= timerTotal) {
        if (!mousedown) {
            // start the firework at the bottom middle of the screen, then set the random target coordinates, the random y coordinates will be set within the range of the top half of the screen
            fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2)));
            timerTick = 0;
        }
    } else {
        timerTick++;
    }

    // limit the rate at which fireworks get launched when mouse is down
    if (limiterTick >= limiterTotal) {
        if (mousedown) {
            // start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
            fireworks.push(new Firework(cw / 2, ch, mx, my));
            limiterTick = 0;
        }
    } else {
        limiterTick++;
    }
}

// mouse event bindings
// update the mouse coordinates on mousemove
canvas.addEventListener('mousemove', function (e) {
    mx = e.pageX - canvas.offsetLeft;
    my = e.pageY - canvas.offsetTop;
});

// toggle mousedown state and prevent canvas from being selected
canvas.addEventListener('mousedown', function (e) {
    e.preventDefault();
    mousedown = true;
});

canvas.addEventListener('mouseup', function (e) {
    e.preventDefault();
    mousedown = false;
});

