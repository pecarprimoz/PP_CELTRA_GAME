let canvas, ctx, width, height, player,
    worldOffsetX = 0,
    tileOffsetX = 0,
    worldOffsetY = 0,
    tileOffsetY = 0,
    tileSide = 0;


const keys = [];
const map = [];
const army = [];
const tiles = [];
let widthCols = -1;
let heightCols = -1;
window.onload=init;
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

function makeEnemy() {
    initEnemy();
}
const initGame = function(){
    initCanvas();
    initPlayer();
    initTiles();
    createTileMap();
    setHudParams();
    makeMapDynamic();
    //makeEnemy();
    generateRandomPowerUps();


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
            walkFrame: 0,
            draw: function(){
                ctx.fillStyle = this.color;
                ctx.fillRect(Math.floor(this.x*tileSide),Math.floor(this.y*tileSide),Math.floor(this.width*tileSide),
                Math.floor(this.height*tileSide))
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
        const preSet = [
            [0,0,1,0,0],
            [0,1,1,1,0],
            [1,1,1,1,1]];
        for(let x=0; x<20; x++){
            let putWhereX= 16;
            for(let i=0; i<preSet.length; i++){
                for(let j=0; j<preSet[i].length;j++){
                    if(preSet[i][j]==1){
                        //console.log(putWhereX)
                        map[11+i][putWhereX+j]=1
                    }
                }
            }
            putWhereX+=20
        }


        for(let i=0; i<7; i++){
            map[10][5+i]=1
        }
        for(let i=0; i<7; i++){
            map[10][15+i]=0
        }
        //console.log(map)
    }
    return {
        initCanvas
    };

    function initTiles(){

        let sky = new Image();
        sky.src="../CELTRA/imgs/sky-temp.png"
        tiles.push(sky)
        let ground = new Image();
        ground.src="../CELTRA/imgs/ground-tile.png"
        tiles.push(ground)
        let walk1 = new Image();
        walk1.src="../CELTRA/imgs/walk1.png"
        tiles.push(walk1)
        let walk2 = new Image();
        walk2.src="../CELTRA/imgs/walk2.png"
        tiles.push(walk2)
        let walk3 = new Image();
        walk3.src="../CELTRA/imgs/walk3.png"
        tiles.push(walk3)
        let walk4 = new Image();
        walk4.src="../CELTRA/imgs/walk4.png"
        tiles.push(walk4)
        let moon = new Image();
        moon.src="../CELTRA/imgs/moon-temp.png"
        tiles.push(moon)
        let sun = new Image();
        sun.src="../CELTRA/imgs/sun.png"
        tiles.push(sun)

    }
    //player size, player speed, player jump
    function makeMapDynamic(){
        //bottom line heightCols-6
        //powerup a vsake 30+10 blockov
        let numberOfRandomWalls=100;
        let distanceBetweenWalls=30;
        for(let i=0 ;i<numberOfRandomWalls; i++){
            let height = calculateRandomHeight();
            for(let j=0; j<6; j++){
                map[height+j][distanceBetweenWalls]=1
            }
            distanceBetweenWalls+=30+calculateRandomIntervalForPlatforms();
        }

        let numberofRandomPlatforms=100;
        let distanceBetweenPlatforms=40;
        for(let x=0; x<numberofRandomPlatforms; x++){
            let width = calculatRandomWidth();
            for(let y=0; y<width; y++){
                map[heightCols][distanceBetweenPlatforms+y]=1;
            }
            distanceBetweenPlatforms+=40+calculateRandomIntervalForPlatforms();
        }
        let numberOfFloatingPlatforms=100;
        let distanceBetweenFloatingPlatforms=30;
        for(let j=0; j<numberOfFloatingPlatforms; j++){
            let Rwidth = calculatRandomWidth();
            let Rheight = calculateRandomHeight();
            for(let h=0; h<Rwidth; h++){
                map[Rheight][distanceBetweenFloatingPlatforms+h]=1
            }
            distanceBetweenFloatingPlatforms+=30+calculateRandomIntervalForPlatforms();
        }
    }
    function generateRandomPowerUps() {
        let numOfPowerUps=100;
        let distBetwPowerUps=30;
        for(let i=0; i<numOfPowerUps; i++){
            let rHeight=calculateRandomHeight();
            if(!checkIfIsFloor(rHeight,distBetwPowerUps))
                map[rHeight][distBetwPowerUps]=2;
            distBetwPowerUps+=30;
        }
        let numOfCoins=420;
        let distBetwCoin=15;
        for(let j=0; j<numOfCoins; j++){
            let rHeight=calculateRandomHeight();
            if(!checkIfIsFloor(rHeight,distBetwCoin))
                map[rHeight][distBetwCoin]=3;
            distBetwCoin+=30;
        }
    }


    function calculateRandomIntervalForPlatforms(){
        return Math.floor((Math.random() * 15)+1);
    }
    function calculateRandomHeight() {
        return Math.floor((Math.random() * (heightCols-8))+4);
    }
    function calculatRandomWidth(){
        return Math.floor((Math.random()* (widthCols-2))+4);
    }

};



/* IZRIS VSEGA */
const draw = function (){
    ctx.clearRect(0,0, width, height);
    drawTileMap();
    player.draw();
    //enemy.draw();
    if(map[5][Math.floor(player.x+worldOffsetX)] instanceof Object){
        console.log(worldOffsetX)
    }




    function drawTileMap(){
        //+3, ker izrisujemo en tile prej(levo), ker indeksiramo z 0, in tile za tem
        posX=-Math.floor(tileSide);
        posY=-Math.floor(tileSide);
        for(let i=worldOffsetY; i<heightCols+worldOffsetY+3; i++){
            for(let j=worldOffsetX; j<widthCols+worldOffsetX+3; j++){
                if(map[i][j]===1){
                    ctx.drawImage(tiles[1],posX+tileOffsetX,posY+tileOffsetY,tileSide,tileSide);
                }
                else if(map[i][j]===2){
                    ctx.drawImage(tiles[6],posX+tileOffsetX,posY+tileOffsetY,tileSide,tileSide);
                }
                else if(map[i][j]===3){
                    ctx.drawImage(tiles[7],posX+tileOffsetX,posY+tileOffsetY,tileSide,tileSide);
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



function initEnemy(){
    enemy = {
        color: "white",
        x : widthCols/3,
        y : heightCols/3,
        width : generateSize(),
        height : generateSize(),
        speed : generateSpeed(),
        jumping: false,
        walkFrame: 0,
        downtime: 9,
        bounced:false,
        draw: function(){
            ctx.fillStyle = this.color;
            ctx.fillRect(Math.floor(this.x*tileSide),Math.floor(this.y*tileSide),Math.floor(this.width*tileSide),
                Math.floor(this.height*tileSide))
        },
        movement: function () {

            if(this.bounced){
                this.y-=this.speed;
                this.downtime+=this.speed;
            }
            if(this.downtime>15){
                this.bounced=false;
            }
            if(this.downtime>0 && !this.bounced){
                this.y+=this.speed;
                this.downtime-=this.speed;
               // console.log("no")
            }
            else if(this.downtime<=0){
                this.bounced=true;
            }
        }
    }
    function generateSpeed(){
        return (Math.random() * 1)+0.1
    }
    function generateSize(){
        return (Math.random() * 4)+1
    }
    return enemy;
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
                if(tileOffsetX<=tileSide){
                    //console.log("test")
                    tileOffsetX=0;
                    worldOffsetX++;
                }
                else{
                    tileOffsetX-=player.speed;
                }
            }
            else
                player.x+=player.speed;
                player.walkFrame++;
        }
        //levo
        if (keys[37]) {
            if(player.x<widthCols/8){
                if(tileOffsetX>=tileSide){
                    tileOffsetX=0;
                    worldOffsetX--;
                }
                else{
                    tileOffsetX+=player.speed*tileSide;
                }
            }
            else
                player.x-=player.speed;
                player.walkFrame++;
        }
    }
};
function update(){
    //preverjamo premikanje
    controls();
    //enemy.movement()
    allColisions();


    //izris na canvas
    //collisionDetection()
    draw();

    //suconsole.log(player.x,player.y)
    requestAnimationFrame(update);
}

function handleWindowResize() {
    //V primeru da uporabnik spreminja dimenzije okna, se parametri spreminjajo
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    init.initCanvas;
    draw();
}


//HUD ELEMENTS

function setHudParams(){
    hp = document.getElementById("hp");
    coin = document.getElementById("coin");
    hp.innerHTML=3;
    coin.innerHTML=0;
}

function checkIfIsFloor(i,j){
    return map[i][j]===1;
}
function allColisions(){
    for(let i=0; i<heightCols; i++){
        for(let j=0; j<widthCols; j++){

            if(collisionDetectionSpecific(i,j)){
                console.log("works?")
            }
        }
    }
}
function collisionDetectionSpecific(h,w){
    if(!checkIfIsFloor(h,w)){
        return;
    }
    let a = {
        left:player.x,
        top:player.y,
        right:player.x+tileSide,
        bottom:player.y+tileSide
    };

    let b= {
        left: w*tileSide,
        top:  h*tileSide,
        right: w*tileSide+tileSide,
        bottom: h*tileSide+tileSide
    }
    x_overlaps = (a.left < b.right) && (a.right > b.left)
    y_overlaps = (a.top < b.bottom) && (a.bottom > b.top)
    
    return x_overlaps && y_overlaps;
}

