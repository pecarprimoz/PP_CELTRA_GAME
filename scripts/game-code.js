
var canvas, ctx, width,height,player, keys;
var offsetX=0,
    offsetY=0;
window.onload=init;
friction = 0.8,
gravity = 0.2;
keys=[];

window.addEventListener("load",function(){
    update();
});

document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});

function init(){
    initCanvas();
    initPlayer();
    draw()
}

function keyboardControls(){
    //key controls for debugging

}

var thingsOnMap = [
    [50,50],
    [55,70],
    [15,22],
    [150,20],
    [120,80],
    [100,10],
    [170,40],
    [130,70],
    [230,10],
    [330,45],
    [1400,65]
];
//template for sidescrolling tests

function update(){
    // check keys
    if (keys[38] || keys[32]) {
        // up arrow or space
        if(!player.jumping){
            player.jumping = true;
            player.velY = -player.speed*2;
        }
    }
    if (keys[39]) {
        // right arrow
        if (player.velX < player.speed) {
            player.velX++;
            offsetX-=3;
        }
    }
    if (keys[37]) {
        // left arrow
        if (player.velX > -player.speed) {
            player.velX--;
            offsetX+=3;
        }
    }

    player.velX *= friction;

    player.velY += gravity;

    player.x += player.velX;
    player.y += player.velY;

    if (player.x >= width-player.width) {
        player.x = width-player.width;
    } else if (player.x <= 0) {
        player.x = 0;
    }

    if(player.y >= height-player.height){
        player.y = height - player.height;
        player.jumping = false;
    }

    ctx.clearRect(0,0,width,height);
    player.draw()
    draw()
    requestAnimationFrame(update);
}
function draw(){
    ctx.save();
    ctx.translate(offsetX,offsetY);
    ctx.clearRect(-offsetX, -offsetY, width, height);
    player.draw();

    var l = thingsOnMap.length;
    for (var i = 0; i < l; i++) {
        // we should really only draw the things that intersect the viewport!
        // but I am lazy so we are drawing everything here
        var x = thingsOnMap[i][0];
        var y = thingsOnMap[i][1];
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(x, y, 8, 8);
        ctx.fillStyle = 'black';
        ctx.fillText(x + ', ' + y, x, y) // just to show where we are drawing these things
    }

    ctx.restore();
}

function initCanvas() {
    canvas=document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    width=canvas.width;
    height=canvas.height;
    canvas.tabIndex=1
}

function initPlayer() {
    player = {
        color: "red",
        x : 20,
        y : 20,
        width : 15,
        height : 15,
        speed : 3,
        velX : 0,
        velY : 0,
        jump: false,
        draw: function(){
            ctx.fillStyle=this.color;
            ctx.fillRect(this.x-offsetX,this.y-offsetY,this.width,this.height)
        }
    }
}
