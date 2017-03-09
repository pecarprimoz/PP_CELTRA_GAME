var canvas, ctx, width,height,player;
var offsetX=0,
    offsetY=0;
window.onload=init;
var friction = 0.8;
var gravity = 0.2;
var keys=[];
var map=[];
var widthCols=-1;
var heightCols=-1;



window.addEventListener("load",function(){
    update();
});
window.addEventListener('resize', handleWindowResize,false);

document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});

function handleWindowResize() {
    //V primeru da uporabnik spreminja dimenzije okna, se parametri spreminjajo
    height = window.innerHeight;
    width = window.innerWidth;
    //ctx.canvas.width =window.innerWidth;
    //ctx.canvas.height=3*window.innerWidth/4;
    initCanvas()
    draw()
}

function init(){
    initCanvas();
    initPlayer();
    createTileMap();
    draw()
}

function handleWindowResize() {
    //V primeru da uporabnik spreminja dimenzije okna, se parametri spreminjajo
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    initCanvas()
    draw()
}
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
    draw()

    requestAnimationFrame(update);
}
function draw(){
    ctx.save();
    ctx.translate(offsetX,offsetY);
    ctx.clearRect(-offsetX, -offsetY, width, height);
    player.draw();
    player.draw()
    drawTileMap()
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
    widthCols=Math.round(width/32)
    heightCols=Math.round(height/32)
}

function initPlayer() {
    player = {
        color: "red",
        x : width/2,
        y : height/2,
        width : 15,
        height : 15,
        speed : 3,
        velX : 0,
        velY : 0,
        jumping: false,
        draw: function(){
            ctx.fillStyle=this.color;
            ctx.fillRect(this.x-offsetX,this.y-offsetY,this.width,this.height)
        }
    }
}

function createTileMap(){
    console.log(widthCols)
    console.log(heightCols)
    for(var i=0; i<heightCols; i++){
        if(i===0 || i===heightCols-1){
            map.push(Array.apply(null, Array(widthCols+1)).map(Number.prototype.valueOf,1))
        }
        else{
        map.push(Array.apply(null, Array(widthCols)).map(Number.prototype.valueOf,0))
        }
    }
    for(var i=0; i<map.length;i++){
        map[i][0]=1
        map[i][map[0].length-1]=1
    }
    console.log(map)
}

function drawTileMap(){
    posX=0;
    posY=0;
    for(var i=0; i<map.length; i++){
        for(var j=0; j<map[i].length; j++){
            if(map[i][j]===1){
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.rect(posX,posY,32,32)
                ctx.fill();
            }
            posX+=32
        }
        posX=0
        posY+=32
    }
}
