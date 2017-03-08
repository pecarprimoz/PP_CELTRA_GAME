var canvas, ctx, width,height,player;
var fps=60;
window.onload=init;
function init(){
    initCanvas();
    initPlayer();
    draw()
}

function update() {  }
function draw() {
    canvas.clearRect(0, 0, width, height);
    player.draw();
}
setInterval(function () {
    update();
    draw();
},1000/fps)

function update(){
    player.x+=1
}
function draw(){
    ctx.clearRect(0, 0, width, height);
    player.draw();
}

function initCanvas() {
    canvas=document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    width=canvas.width;
    height=canvas.height;
}

function initPlayer() {
    player = {
        color: "#000",
        x : width/2,
        y : width/2,
        width : width/6,
        height : height/6,
        draw: function(){
            ctx.fillStyle=this.color;
            ctx.fillRect(this.x,this.y,this.width,this.height)
        }
    }
}
