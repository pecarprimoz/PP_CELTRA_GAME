var canvas, ctx, width,height,player,
    worldOffsetX=0,
    tileOffsetX=0,
    worldOffsetY=0,
    tileOffsetY=0;
window.onload=init;
var keys=[];
var map=[];
var widthCols=-1;
var heightCols=-1;
//

/* EVENT LISTENERJI ZA SCREEN ROTATE IN KEY KONTROLE */
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

function init(){
    initCanvas();
    initPlayer();
    createTileMap();
    draw()
}

function update(){
    //preverjamo premikanje
    handleControls();

    //izris na canvas
    draw();

    //rabm se collision detection
    requestAnimationFrame(update);
}

function handleWindowResize() {
    //V primeru da uporabnik spreminja dimenzije okna, se parametri spreminjajo
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    initCanvas();
    draw();
}

function handleControls(){
    //space/up, jump
    if(keys[38] || keys[32]){
        //preverjamo ali je čez 1/4 ekrana
        if(player.y<height/8){

            if(worldOffsetY!==0 && tileOffsetY>=32){
                tileOffsetY=0;
                if(worldOffsetY!==0)
                    worldOffsetY--;
            }
            else{
                tileOffsetY+=player.speed;
            }
        }
        else
            player.y-=player.speed;
    }

    if(keys[40]){
        if(player.y>height-height/8){
            if(tileOffsetY<=-32){
                tileOffsetY=0;
                worldOffsetY++;
            }
            else{
                tileOffsetY-=player.speed;
            }
        }
        else
            player.y+=player.speed;
    }
    //desno
    if (keys[39]) {
        //console.log(player.x+player.width)
        if(player.x+player.width>width-width/4){
            if(tileOffsetX<=-32){
                tileOffsetX=0;
                worldOffsetX++;
            }
            else{
                tileOffsetX-=player.speed;
            }
        }
        else
            player.x+=player.speed;
    }
    //levo
    if (keys[37]) {
        if(player.x<width/4){
            if(tileOffsetX>=32){
                tileOffsetX=0
                worldOffsetX--;
            }
            else{
                tileOffsetX+=player.speed;
            }
        }
        else
            player.x-=player.speed;
    }
}

function initCanvas() {
    canvas=document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    width=canvas.width;
    height=canvas.height;
    canvas.tabIndex=1
    widthCols=Math.floor(width/32)
    heightCols=Math.floor(height/32)
}

function initPlayer(){
    player = {
        color: "red",
        x : width/2,
        y : height/2,
        width : 15,
        height : 15,
        speed : 4,
        jumping: false,
        draw: function(){
            ctx.fillStyle=this.color;
            ctx.fillRect(this.x,this.y,this.width,this.height)
        }
    }
}

/* IZRIS VSEGA */

function draw(){
    ctx.clearRect(0,0, width, height);
    player.draw()
    drawTileMap()

}

function createTileMap(){
    for(var i=0; i<100; i++){
        if(i===heightCols){
            map.push(Array.apply(null, Array(100)).map(Number.prototype.valueOf,1))
        }
        else{
            map.push(Array.apply(null, Array(100)).map(Number.prototype.valueOf,0))
        }
    }
    map[3][5]=1
    for(var i=0; i<7; i++){
        map[10][5+i]=0
    }


    for(var i=0; i<7; i++){
        map[10][15+i]=0
    }
    console.log(map)
}

function drawTileMap(){
    //+3, ker izrisujemo en tile prej(levo), ker indeksiramo z 0, in tile za tem

    posX=-32;
    posY=-32;
    for(var i=worldOffsetY; i<heightCols+worldOffsetY+3; i++){
        for(var j=worldOffsetX; j<widthCols+worldOffsetX+3; j++){

            if(map[i][j]===1){
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.rect(posX+tileOffsetX,posY+tileOffsetY,32,32)
                ctx.fill();
            }
            posX+=32
        }
        posX=-32;
        posY+=32
    }
}
console.log(Math.floor(document.getElementById("canvas").offsetWidth))