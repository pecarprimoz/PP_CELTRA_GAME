let canvas, ctx, width, height, player,
    worldOffsetX = 0,
    tileOffsetX = 0,
    worldOffsetY = 0,
    tileOffsetY = 0,
    tileSide = 0,
    gravity = 0.2,
    player_hp=3,
    num_of_platforms=5,
    player_coins=0;
let onphone=false;
function checkIfRunningOnPhone(){
    window.mobilecheck = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };
    return window.mobilecheck();
}

const keys = [];
const map = [];
let powerJumps=5;
const tiles = [];
let widthCols = -1;
let heightCols = -1;
let nextJumpPossible = false;
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

function restartCurrentlevel(){
    initPlayer();
    setHudParams();
}
const initGame = function(){
    onphone=checkIfRunningOnPhone();
    initCanvas();
    initPlayer();
    initTiles();
    initMobileControls()
    createTileMap();
    setHudParams();
    makeMapDynamic();
    generateRandomPowerUps();
    generateEnemy();


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

    function createTileMap(){
        for(let i=0; i<100; i++){
            if(i===heightCols){
                map.push(Array.apply(null, Array(100)).map(Number.prototype.valueOf,1))
            }
            else{
                map.push(Array.apply(null, Array(100)).map(Number.prototype.valueOf,0))
            }
        }
        map[7][10]=1;
        map[8][10]=1;
        map[9][10]=1;
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
        for(let h=0; h<100000; h++){
                map[1][h]=1;
        }
        for(let f=0; f<20; f++){
            map[f][0]=1;
        }

        /*
        for(let i=0; i<7; i++){
            map[10][5+i]=1
        }
        for(let i=0; i<7; i++){
            map[10][15+i]=0
        }*/
        //console.log(map)
    }
    return {
        initCanvas
    };

    function initTiles(){

        let sky = new Image();
        sky.src="./imgs/sky-temp.png"
        tiles.push(sky)
        let ground = new Image();
        ground.src="./imgs/ground-tile.png"
        tiles.push(ground)
        let walk1 = new Image();
        walk1.src="./imgs/walk1.png"
        tiles.push(walk1)
        let walk2 = new Image();
        walk2.src="./imgs/walk2.png"
        tiles.push(walk2)
        let walk3 = new Image();
        walk3.src="./imgs/walk3.png"
        tiles.push(walk3)
        let walk4 = new Image();
        walk4.src="./imgs/walk4.png"
        tiles.push(walk4)
        let moon = new Image();
        moon.src="./imgs/moon-temp.png"
        tiles.push(moon)
        let sun = new Image();
        sun.src="./imgs/sun.png"
        tiles.push(sun)
        let plpic = new Image();
        plpic.src="./imgs/abomination.png"
        tiles.push(plpic)

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
            distanceBetweenWalls+=70+calculateRandomIntervalForPlatforms();
        }

        let numberofRandomPlatforms=100;
        let distanceBetweenPlatforms=40;
        for(let x=0; x<numberofRandomPlatforms; x++){
            let width = calculatRandomWidth();
            for(let y=0; y<width; y++){
                map[heightCols][distanceBetweenPlatforms+y]=1;
            }
            distanceBetweenPlatforms+=60+calculateRandomIntervalForPlatforms();
        }
        let numberOfFloatingPlatforms=100;
        let distanceBetweenFloatingPlatforms=25;
        for(let j=0; j<numberOfFloatingPlatforms; j++){
            let Rwidth = calculatRandomWidth();
            let Rheight = calculateRandomHeight();
            for(let h=0; h<Rwidth; h++){
                map[Rheight][distanceBetweenFloatingPlatforms+h]=1
            }
            distanceBetweenFloatingPlatforms+=30+calculateRandomIntervalForPlatforms();
        }
        let numberOfSquares=500;
        let distanceBetweenSquares=25;
        for(let j=0; j<numberOfSquares; j++){
            let Rheight = calculateRandomHeight();
            map[Rheight][distanceBetweenSquares]=1
            map[Rheight][distanceBetweenSquares+1]=1
            map[Rheight+1][distanceBetweenSquares]=1
            map[Rheight+1][distanceBetweenSquares+1]=1
            distanceBetweenSquares+=distanceBetweenSquares+calculateRandomIntervalForPlatforms();
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
        return Math.floor((Math.random() * 5)+1);
    }
    function calculateRandomHeight() {
        return Math.floor((Math.random() * (heightCols-7))+4);
    }
    function calculatRandomWidth(){
        return Math.floor((Math.random()* (widthCols-2))+4);
    }

};
function initPlayer(){
    player = {
        color: "red",
        x : widthCols/4,
        y : heightCols/2,
        width : 1,
        height : 1,
        speed : 0.15,
        jumping: false,
        numofjumps: powerJumps,
        walkFrame: 0,
        draw: function(){
            ctx.drawImage(tiles[8],Math.floor(this.x*tileSide),Math.floor(this.y*tileSide),Math.floor(this.width*tileSide),
                Math.floor(this.height*tileSide)+6)
        }
    }
}
function checkIfEnemyInRange(){
    for(let i=0; i<widthCols+worldOffsetX; i++){
        if(map[0][i] instanceof Object){
            return map[0][i];
        }
    }
}


/* IZRIS VSEGA */
const draw = function (){
    ctx.clearRect(0,0, width, height);
    drawTileMap();
    let currEnemy=checkIfEnemyInRange();
    if(currEnemy instanceof Object){
        currEnemy.draw();
        currEnemy.movement();
    }
    player.draw();
    //enemy.draw();





    function drawTileMap(){
        //+3, ker izrisujemo en tile prej(levo), ker indeksiramo z 0, in tile za tem
        posX=-Math.floor(tileSide);
        posY=-Math.floor(tileSide);
        for(let i=worldOffsetY; i<heightCols+worldOffsetY+4; i++){
            for(let j=worldOffsetX; j<widthCols+worldOffsetX+4; j++){
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
function generateEnemy(){
    let distanceBetweenEnemy=40;
    let numOfEnemy=100;
    for(let i=0 ;i<numOfEnemy; i++){
        map[0][distanceBetweenEnemy]=initEnemy();
        distanceBetweenEnemy+=65;
    }
}


function initEnemy(){
    enemy = {
        color: "white",
        x : widthCols-widthCols/8,
        y : heightCols/2,
        width : generateSize(),
        height : generateSize(),
        speed : generateSpeed(),
        jumping: false,
        walkFrame: 0,
        downtime: 9,
        bounced:false,
        draw: function(){
            ctx.drawImage(tiles[8],Math.floor(this.x*tileSide),Math.floor(this.y*tileSide),Math.floor(this.width*tileSide),
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
    };
    function generateSpeed(){
        return (Math.random() * 1)+0.1
    }
    function generateSize(){
        return (Math.random() * 4)+1
    }
    return enemy;
}

function initMobileControls(){
    document.getElementById("LEFT").addEventListener("touchstart", function () {
        keys[420]=true
    });
    document.getElementById("LEFT").addEventListener("touchend", function () {
        keys[420]=false
    });
    document.getElementById("RIGHT").addEventListener("touchstart", function () {
        keys[421]=true
    });
    document.getElementById("RIGHT").addEventListener("touchend", function () {
        keys[421]=false
    });
    document.getElementById("JUMP").addEventListener("touchstart", function () {
        keys[422]=true
    });
    document.getElementById("JUMP").addEventListener("touchend", function () {
        keys[422]=false
    });
    document.getElementById("ACTION").addEventListener("touchstart", function () {
        keys[423]=true
    });
    document.getElementById("ACTION").addEventListener("touchend", function () {
        keys[423]=false
    });
}
function setPhoneControlsOff(){
    document.getElementById("LEFT").style.display = "none";
    document.getElementById("RIGHT").style.display = "none";
    document.getElementById("JUMP").style.display = "none";
    document.getElementById("ACTION").style.display = "none";
}

const controls = () =>{
    if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ){
        keyboardControls()
    }
    else if(width>1000){
        setPhoneControlsOff()
        keyboardControls()
    }

    //space/up, jump
    function keyboardControls() {
        /*
        if(keys[38] || keys[32]){
            collisionDetectionSpecificUp();*/

            //preverjamo ali je čez 1/4 ekrana
            /*if(player.y<heightCols/8){

                if(worldOffsetY!==0 && tileOffsetY>=tileSide){
                    tileOffsetY=0;
                    if(worldOffsetY!==0)
                        worldOffsetY--;
                }
                else{
                    tileOffsetY+=player.speed;
                }
            }
            else*/


        //}
        //dol
        /*if(keys[40]){
            collisionDetectionSpecificDown();*/
           /* if(player.y>heightCols-heightCols/8){
                if(tileOffsetY<=-tileSide){
                    tileOffsetY=0;
                    worldOffsetY++;
                }
                else{
                    tileOffsetY-=player.speed;
                }
            }
         /*   else
                player.y+=player.speed;
        }*/
        //desno
        if (keys[39] ||keys[421]) {
            collisionDetectionSpecificRight();
            //console.log(player.x+player.width)
            if(player.x+player.width>(canvas.width/widthCols)-widthCols/4){
                if(Math.abs(tileOffsetX)>=tileSide){

                    tileOffsetX=0;
                    worldOffsetX++;
                }
                else{
                    tileOffsetX-=player.speed*tileSide;

                }

            }
            else
                player.x+=player.speed;
                player.walkFrame++;
        }

        //levo
        if (keys[37] || keys[420]) {
            collisionDetectionSpecificLeft();
            if(player.x<widthCols/4){
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
let canBuild=true;
function update(){
    if(onphone){
        mobileBasedGame()
    }
    else{
        computerBasedGame()
    }
    //preverjamo premikanje
    //console.log(player.y)

    controls();


    //enemy.movement()


    //izris na canvas
    //collisionDetection()
    draw();
    checkifdied();

    //suconsole.log(player.x,player.y)
    requestAnimationFrame(update);

}
function mobileBasedGame(){
    if(collisionDetectionSpecificUp()){
        gravity+=0.3;
        player.y+=player.speed;
    }

    if(collisionDetectionSpecificDown()){
        // console.log("done")
        nextJumpPossible=false;
        canBuild=false;
        player.jumping=false;
        player.numofjumps=powerJumps;
        //kle mas neko foro z + ali - ce bo kej narobe
        gravity=player.speed
    }
    if(!collisionDetectionSpecificDownDontChange() && !player.jumping){
        player.jumping=true;
        canBuild=true
    }
    //console.log(collisionDetectionSpecificDownDontChange())
    if(!collisionDetectionSpecificDownDontChange() && player.numofjumps>0 && !keys[422]){
        nextJumpPossible=true;
        canBuild=true
    }
    if(player.jumping && nextJumpPossible && keys[422] && player.numofjumps>0){
        canBuild=true
        //console.log("test")
        //console.log("?")
        gravity=-0.5;
        //console.log(player.numofjumps)
        player.numofjumps--;
        //console.log("jump")
    }


    if(collisionDetectionSpecificDownDontChange() && !player.jumping){
        player.y=player.y-player.speed;
        if(keys[422]){
            canBuild=true
            //console.log("fist")
            gravity=-0.5;
            player.jumping=true;
            player.numofjumps--;
            // console.log(player.numofjumps)
            //console.log("jump")
        }
    }
    if((keys[423]) && canBuild){
        platformCreator();
        canBuild=false
    }

    if(player.jumping ){
        gravity+=0.03
    }

    player.y+=gravity
}

function computerBasedGame(){
    if(collisionDetectionSpecificUp()){
        gravity+=0.3;
        player.y+=player.speed;
    }

    if(collisionDetectionSpecificDown()){
        // console.log("done")
        nextJumpPossible=false;
        canBuild=false;
        player.jumping=false;
        player.numofjumps=powerJumps;
        //kle mas neko foro z + ali - ce bo kej narobe
        gravity=player.speed
    }
    if(!collisionDetectionSpecificDownDontChange() && !player.jumping){
        player.jumping=true;
        canBuild=true
    }
    //console.log(collisionDetectionSpecificDownDontChange())
    if(!collisionDetectionSpecificDownDontChange() && player.numofjumps>0 && !keys[38]){
        nextJumpPossible=true;
        canBuild=true
    }
    if(player.jumping && nextJumpPossible && keys[38] && player.numofjumps>0){
        canBuild=true
        //console.log("test")
        //console.log("?")
        gravity=-0.5;
        //console.log(player.numofjumps)
        player.numofjumps--;
        //console.log("jump")
    }


    if(collisionDetectionSpecificDownDontChange() && !player.jumping){
        player.y=player.y-player.speed;
        if(keys[38]){
            canBuild=true
            //console.log("fist")
            gravity=-0.5;
            player.jumping=true;
            player.numofjumps--;
            // console.log(player.numofjumps)
            //console.log("jump")
        }
    }
    if((keys[32]) && canBuild){
        platformCreator();
        canBuild=false
    }

    if(player.jumping ){
        gravity+=0.03
    }

    player.y+=gravity
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
    mytiles= document.getElementById("plat")
    mytiles.innerHTML=num_of_platforms;
    hp.innerHTML=player_hp;
    coin.innerHTML=player_coins;
}

function checkIfIsFloor(i,j){
    return map[i][j]===1;
}
function checkIfIsSun(i,j){
    return map[i][j]===3;
}
function checkIfIsMoon(i,j){
    return map[i][j]===2;
}
function collisionDetectionSpecificUp(){
    let tmp = player;

    if(

        checkIfIsFloor(Math.floor(player.y + player.height+worldOffsetY-0.15  + tileOffsetY/tileSide), Math.ceil(player.x + Math.abs(tileOffsetX/tileSide)+player.width)+worldOffsetX) ||
        checkIfIsFloor(Math.floor(player.y + player.height+worldOffsetY-0.15 + tileOffsetY/tileSide), Math.ceil(player.x + Math.abs(tileOffsetX/tileSide)+worldOffsetX))){
        //console.log(Math.floor(player.y + player.height+worldOffsetY  + tileOffsetY/tileSide), Math.ceil(player.x + tileOffsetX/tileSide-player.width/2)+worldOffsetX)
        //console.log(2)
        player.y=tmp.y+tmp.speed;


        return true;
    }
    return false;
}

//fixed
function collisionDetectionSpecificDown(){
    let tmp = player;
    if(
        checkIfIsFloor(Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY+0.15),Math.ceil(player.x + Math.abs(tileOffsetX/tileSide))+worldOffsetX) ||
        checkIfIsFloor(Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY+0.15),Math.ceil(player.x + Math.abs(tileOffsetX/tileSide)+player.width)+worldOffsetX)){
        //console.log(Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY),Math.ceil(player.x + tileOffsetX/tileSide+player.width/2)+worldOffsetX)
        //console.log(1)
        player.y=tmp.y-tmp.speed;
        return true;
    }
    if(checkIfIsSun(Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY+0.15),Math.ceil(player.x + Math.abs(tileOffsetX/tileSide))+worldOffsetX)){
        map[Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY+0.15)][Math.ceil(player.x + Math.abs(tileOffsetX/tileSide))+worldOffsetX]=0
        let curval=parseInt(coin.innerHTML)+1
        player_coins++;
        coin.innerHTML=curval
    }
    if(checkIfIsSun(Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY+0.15),Math.ceil(player.x + Math.abs(tileOffsetX/tileSide)+player.width)+worldOffsetX)){
        //console.log(Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY),Math.ceil(player.x + tileOffsetX/tileSide+player.width/2)+worldOffsetX)
        //console.log(1)
        map[Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY+0.15)][Math.ceil(player.x + Math.abs(tileOffsetX/tileSide)+player.width)+worldOffsetX]=0
        let curval=parseInt(coin.innerHTML)+1
        player_coins++;
        coin.innerHTML=curval
    }
    if(checkIfIsMoon(Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY+0.15),Math.ceil(player.x + Math.abs(tileOffsetX/tileSide))+worldOffsetX)){
        map[Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY+0.15)][Math.ceil(player.x + Math.abs(tileOffsetX/tileSide))+worldOffsetX]=0
        mytiles.innerHTML=parseInt(mytiles.innerHTML)+2
        num_of_platforms+=2;
    }
    if(checkIfIsMoon(Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY+0.15),Math.ceil(player.x + Math.abs(tileOffsetX/tileSide)+player.width)+worldOffsetX)){
        //console.log(Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY),Math.ceil(player.x + tileOffsetX/tileSide+player.width/2)+worldOffsetX)
        //console.log(1)
        map[Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY+0.15)][Math.ceil(player.x + Math.abs(tileOffsetX/tileSide)+player.width)+worldOffsetX]=0
        mytiles.innerHTML=parseInt(mytiles.innerHTML)+2
        num_of_platforms+=2;
    }
    return false;
}

function collisionDetectionSpecificDownDontChange(){
    let tmp = player;
    if(
        checkIfIsFloor(Math.ceil(player.y+tmp.speed + player.height + tileOffsetY/tileSide +worldOffsetY+0.15),Math.ceil(player.x + Math.abs(tileOffsetX/tileSide))+worldOffsetX) ||
        checkIfIsFloor(Math.ceil(player.y+tmp.speed + player.height + tileOffsetY/tileSide +worldOffsetY+0.15),Math.ceil(player.x + Math.abs(tileOffsetX/tileSide)+player.width)+worldOffsetX)){
        //console.log(Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY),Math.ceil(player.x + tileOffsetX/tileSide+player.width/2)+worldOffsetX)
        //console.log(1)
        return true;
    }
    if(checkIfIsSun(Math.ceil(player.y+tmp.speed + player.height + tileOffsetY/tileSide +worldOffsetY+0.15),Math.ceil(player.x + Math.abs(tileOffsetX/tileSide))+worldOffsetX)){
        map[Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)][Math.floor(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width-0.15)]=0
        let curval=parseInt(coin.innerHTML)+1
        player_coins++;
        coin.innerHTML=curval
    }
    if(checkIfIsSun(Math.ceil(player.y+tmp.speed + player.height + tileOffsetY/tileSide +worldOffsetY+0.15),Math.ceil(player.x + Math.abs(tileOffsetX/tileSide)+player.width)+worldOffsetX)){
        //console.log(Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY),Math.ceil(player.x + tileOffsetX/tileSide+player.width/2)+worldOffsetX)
        //console.log(1)
        map[Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)+player.height][Math.floor(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width-0.15)]=0
        let curval=parseInt(coin.innerHTML)+1
        player_coins++;
        coin.innerHTML=curval
    }
    if(checkIfIsMoon(Math.ceil(player.y+tmp.speed + player.height + tileOffsetY/tileSide +worldOffsetY+0.15),Math.ceil(player.x + Math.abs(tileOffsetX/tileSide))+worldOffsetX)){
        map[Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)][Math.floor(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width-0.15)]=0
        mytiles.innerHTML=parseInt(mytiles.innerHTML)+2
        num_of_platforms+=2;
    }
    if(checkIfIsMoon(Math.ceil(player.y+tmp.speed + player.height + tileOffsetY/tileSide +worldOffsetY+0.15),Math.ceil(player.x + Math.abs(tileOffsetX/tileSide)+player.width)+worldOffsetX)){
        //console.log(Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY),Math.ceil(player.x + tileOffsetX/tileSide+player.width/2)+worldOffsetX)
        //console.log(1)
        map[Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)+player.height][Math.floor(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width-0.15)]=0
        mytiles.innerHTML=parseInt(mytiles.innerHTML)+2
        num_of_platforms+=2;
    }

    return false;
}

//fixed
function collisionDetectionSpecificLeft(){
    let tmp = player;
    //console.log(tileOffsetX/tileSide)
    //
    if(
        checkIfIsFloor(Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide), Math.floor(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width-0.15))||
        checkIfIsFloor(Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)+player.height, Math.floor(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width-0.15))){
        //console.log(checkIfIsFloor(Math.floor(player.y+worldOffsetY + tileOffsetY/tileSide)+1, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width)))
        //console.log(Math.floor(player.y+worldOffsetY + tileOffsetY/tileSide)+1, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width))
        player.x = tmp.x + tmp.speed;
        return true;
    }
    if(checkIfIsSun(Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide), Math.floor(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width-0.15))){
        map[Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)][Math.floor(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width-0.15)]=0
        let curval=parseInt(coin.innerHTML)+1
        player_coins++;
        coin.innerHTML=curval
    }
        if(checkIfIsSun(Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)+player.height, Math.floor(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width-0.15))){
        //console.log(checkIfIsFloor(Math.floor(player.y+worldOffsetY + tileOffsetY/tileSide)+1, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width)))
        //console.log(Math.floor(player.y+worldOffsetY + tileOffsetY/tileSide)+1, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width))
        map[Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)+player.height][Math.floor(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width-0.15)]=0
        let curval=parseInt(coin.innerHTML)+1
            player_coins++;
        coin.innerHTML=curval
    }
    if(checkIfIsMoon(Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide), Math.floor(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width-0.15))){
        map[Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)][Math.floor(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width-0.15)]=0
        mytiles.innerHTML=parseInt(mytiles.innerHTML)+2
        num_of_platforms+=2;
    }
    if(checkIfIsMoon(Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)+player.height, Math.floor(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width-0.15))){
        //console.log(checkIfIsFloor(Math.floor(player.y+worldOffsetY + tileOffsetY/tileSide)+1, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width)))
        //console.log(Math.floor(player.y+worldOffsetY + tileOffsetY/tileSide)+1, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width))
        map[Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)+player.height][Math.floor(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width-0.15)]=0
        mytiles.innerHTML=parseInt(mytiles.innerHTML)+2
        num_of_platforms+=2;
    }
    return false;
}

//fixed
function collisionDetectionSpecificRight(){
    //console.log(tileOffsetX/tileSide)

    let tmp = player;
    if(
        checkIfIsFloor(Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide), Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width+0.15))||
        checkIfIsFloor(Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)+player.height, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width+0.15))){
        //console.log(checkIfIsFloor(Math.floor(player.y+worldOffsetY + tileOffsetY/tileSide)+1, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width)))
        //console.log(Math.floor(player.y+worldOffsetY + tileOffsetY/tileSide)+1, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width))
        player.x = tmp.x - tmp.speed;
        return true;
    }
    if(checkIfIsSun(Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide), Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width+0.15))){
        map[Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)][Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width+0.15)]=0
        let curval=parseInt(coin.innerHTML)+1
        player_coins++;
        coin.innerHTML=curval
    }
    if(checkIfIsSun(Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)+player.height, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width+0.15))){
        //console.log(checkIfIsFloor(Math.floor(player.y+worldOffsetY + tileOffsetY/tileSide)+1, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width)))
        //console.log(Math.floor(player.y+worldOffsetY + tileOffsetY/tileSide)+1, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width))

        map[Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)+player.height][Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width+0.15)]=0
        let curval=parseInt(coin.innerHTML)+1
        player_coins++;
        coin.innerHTML=curval
    }

    if(checkIfIsMoon(Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide), Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width+0.15))){
        map[Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)][Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width+0.15)]=0
        mytiles.innerHTML=parseInt(mytiles.innerHTML)+2
        num_of_platforms+=2;
    }
    if(checkIfIsMoon(Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)+player.height, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width+0.15))){
        //console.log(checkIfIsFloor(Math.floor(player.y+worldOffsetY + tileOffsetY/tileSide)+1, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width)))
        //console.log(Math.floor(player.y+worldOffsetY + tileOffsetY/tileSide)+1, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width))

        map[Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)+player.height][Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width+0.15)]=0

        mytiles.innerHTML=parseInt(mytiles.innerHTML)+2
        num_of_platforms+=2;
    }
    return false;
}





function checkifdied(){
    if(Math.floor(player.y)>heightCols){

        player_hp--;
        hp.innerHTML=player_hp;
        restartCurrentlevel();
        map[Math.ceil(player.y+worldOffsetY)+2][Math.ceil(player.x+worldOffsetX)]=1
        map[Math.ceil(player.y+worldOffsetY)+2][Math.ceil(player.x+worldOffsetX)+1]=1
        map[Math.ceil(player.y+worldOffsetY)+2][Math.ceil(player.x+worldOffsetX)+2]=1
        map[Math.ceil(player.y+worldOffsetY)+2][Math.ceil(player.x+worldOffsetX)+1]=1
        map[Math.ceil(player.y+worldOffsetY)+2][Math.ceil(player.x+worldOffsetX)-1]=1

    }
    if(player_hp===0){
        endGameLose()
    }
}
function endGameLose(){
    var end = document.getElementById("end");
    end.innerHTML="YOU LOST<br> your score was "+player_coins;
    ctx=null
    return;
}



function platformCreator(){
    if(num_of_platforms>0){
        map[Math.ceil(player.y+worldOffsetY)+2][Math.ceil(player.x+worldOffsetX)]=1
        map[Math.ceil(player.y+worldOffsetY)+2][Math.ceil(player.x+worldOffsetX)+1]=1
        map[Math.ceil(player.y+worldOffsetY)+2][Math.ceil(player.x+worldOffsetX)+2]=1
        map[Math.ceil(player.y+worldOffsetY)+2][Math.ceil(player.x+worldOffsetX)+1]=1
        map[Math.ceil(player.y+worldOffsetY)+2][Math.ceil(player.x+worldOffsetX)-1]=1
        num_of_platforms--;
        mytiles.innerHTML=parseInt(mytiles.innerHTML)-1;
        //console.log(num_of_platforms)
        return;
    }

}

/*
function collisionDetectionSpecific(){
    let tmp = player;
    //console.log(tileOffsetY)

    /*            checkIfIsFloor(Math.floor(player.y+worldOffsetY + Math.abs(tileOffsetY/tileSide)), Math.floor(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width-0.2)))

 3 primeri
    |         |
    |         |
    |         |
    |         |
    *----*----*
    ceil si v spodnjem kotu



     */
        /*
    if(
        checkIfIsFloor(Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY),Math.ceil(player.x + Math.abs(tileOffsetX/tileSide))+worldOffsetX) ||
        checkIfIsFloor(Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY),Math.ceil(player.x + Math.abs(tileOffsetX/tileSide)+player.width)+worldOffsetX)){
        //console.log(Math.ceil(player.y + player.height + tileOffsetY/tileSide +worldOffsetY),Math.ceil(player.x + tileOffsetX/tileSide+player.width/2)+worldOffsetX)
        console.log(1)
        player.y=tmp.y-tmp.speed;
        return true;
    }

    if(
        checkIfIsFloor(Math.floor(player.y + player.height+worldOffsetY  + tileOffsetY/tileSide), Math.ceil(player.x + Math.abs(tileOffsetX/tileSide)+player.width)+worldOffsetX) ||
        checkIfIsFloor(Math.floor(player.y + player.height+worldOffsetY  + tileOffsetY/tileSide), Math.ceil(player.x + Math.abs(tileOffsetX/tileSide)+worldOffsetX))){
        //console.log(Math.floor(player.y + player.height+worldOffsetY  + tileOffsetY/tileSide), Math.ceil(player.x + tileOffsetX/tileSide-player.width/2)+worldOffsetX)
        console.log(2)
        player.y=tmp.y+tmp.speed;

        return true;
    }




    if(
            checkIfIsFloor(Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide+1), Math.floor(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width-0.2) ||
            checkIfIsFloor(Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide), Math.floor(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide)) +player.width-0.2)))
    ){
        console.log(3)
            player.x = tmp.x + tmp.speed;
            return true;
    }
     checkIfIsFloor(Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide), Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide)) +player.width))

    if(
        checkIfIsFloor(Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide), Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width+0.2))||
        checkIfIsFloor(Math.ceil(player.y+worldOffsetY + tileOffsetY/tileSide)+1, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width+0.2))){
        console.log(checkIfIsFloor(Math.floor(player.y+worldOffsetY + tileOffsetY/tileSide)+1, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width)))
        console.log(Math.floor(player.y+worldOffsetY + tileOffsetY/tileSide)+1, Math.ceil(player.x+(worldOffsetX+Math.abs(tileOffsetX/tileSide))+player.width))
        player.x = tmp.x - tmp.speed;
        return true;
    }

    return false;

}*/


