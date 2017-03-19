let canvas, ctx, width, height, player,
    worldOffsetX = 0,
    tileOffsetX = 0,
    worldOffsetY = 0,
    tileOffsetY = 0,
    tileSide = 0;

window.onload=init;
const keys = [];
const map = [];
const tiles = [];
let widthCols = -1;
let heightCols = -1;

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

const initGame = function(){
    initCanvas();
    initPlayer();
    initTiles();
    createTileMap();

    function initCanvas() {
        canvas=document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        width=canvas.width;
        height=canvas.height;
        canvas.tabIndex=1;

        if(height>width){
            tileSide=Math.round(height/25);
        }
        else{
            tileSide=Math.round(width/25);
        }

        widthCols=tileSide;
        heightCols=Math.ceil(height/tileSide);
    }
    function initPlayer(){
        player = {
            color: "red",
            x : widthCols/2,
            y : heightCols/2,
            width : 1,
            height : 1,
            speed : 0.2,
            jumping: false,
            draw: function(){
                ctx.fillStyle=this.color;
                ctx.fillRect(Math.floor(this.x*tileSide),Math.floor(this.y*tileSide),Math.floor(this.width*tileSide),Math.floor(this.height*tileSide))
            }
        }
    }

    function createTileMap(){
        for(let i=0; i<100; i++){
            if(i===heightCols){
                map.push(Array.apply(null, Array(100)).map(Number.prototype.valueOf,1))
            }
            else{
                map.push(Array.apply(null, Array(100)).map(Number.prototype.valueOf,0))
            }
        }
        map[3][5]=1;
        for(let i=0; i<7; i++){
            map[10][5+i]=0
        }
        for(let i=0; i<7; i++){
            map[10][15+i]=0
        }
        console.log(map)
    }
    return {
        initCanvas
    };
    function initTiles(){
        let sky = new Image();
        sky.src="http://localhost:63342/st/CELTRA/imgs/sky-temp.png"
        tiles.push(sky)
        let ground = new Image();
        ground.src="http://localhost:63342/st/CELTRA/imgs/ground-tile.png"
        tiles.push(ground)
    }
};

/* IZRIS VSEGA */
const draw = function (){
    ctx.clearRect(0,0, width, height);
    drawTileMap();
    player.draw();

    function drawTileMap(){
        //+3, ker izrisujemo en tile prej(levo), ker indeksiramo z 0, in tile za tem
        posX=-Math.floor(tileSide);
        posY=-Math.floor(tileSide);
        for(let i=worldOffsetY; i<heightCols+worldOffsetY+3; i++){
            for(let j=worldOffsetX; j<widthCols+worldOffsetX+3; j++){
                if(map[i][j]===1){
                    ctx.drawImage(tiles[1],posX+tileOffsetX,posY+tileOffsetY,tileSide,tileSide);
                }
                else{
                    ctx.drawImage(tiles[0],posX+tileOffsetX,posY+tileOffsetY,tileSide,tileSide);
                }
                posX+=tileSide
            }
            posX=-tileSide;
            posY+=tileSide;
        }
    }
};
function init(){
    initGame();
    draw();
}

const controls = () =>{
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        keyboardControls()
    }
    else if(width>1000){
        keyboardControls()
    }

    //space/up, jump
    function keyboardControls() {
        if(keys[38] || keys[32]){
            //preverjamo ali je čez 1/4 ekrana
            if(player.y<heightCols/8){

                if(worldOffsetY!==0 && tileOffsetY>=tileSide){
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
        //dol
        if(keys[40]){
            if(player.y>heightCols-heightCols/8){
                if(tileOffsetY<=-tileSide){
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
            if(player.x+player.width>widthCols-(widthCols)/8){
                if(tileOffsetX<=-tileSide){
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
            if(player.x<widthCols/8){
                if(tileOffsetX>=tileSide){
                    tileOffsetX=0;
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
};
function update(){
    //preverjamo premikanje
    controls();

    //izris na canvas
    draw();

    console.log(player.x,player.y)
    requestAnimationFrame(update);
}

function handleWindowResize() {
    //V primeru da uporabnik spreminja dimenzije okna, se parametri spreminjajo
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    init.initCanvas;
    draw();
}





console.log(Math.floor(document.getElementById("canvas").offsetWidth))