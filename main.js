//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width = 600;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, 
    enemyBoomImage, lifeImage, gameOverImage, gameClear;
let gameOver = false;
let score = 0;
let life = 0;


function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src = "images/우주.jpg";
    spaceshipImage = new Image();
    spaceshipImage.src = "images/본체.png";
    bulletImage = new Image();
    bulletImage.src = "images/총알.png";
    enemyImage = new Image();
    enemyImage.src = "images/적.png";
    enemyBoomImage = new Image();
    enemyBoomImage.src = "images/적폭발.png"
    lifeImage = new Image();
    lifeImage.src = "images/본체.png"
    gameOverImage = new Image();
    gameOverImage.src = "images/게임오버.gif"
    gameClear = new Image();
    gameClear.src = "images/클리어.jpg"
} 

let keysDown = {};
function keyboardListener(){
    document.addEventListener('keydown', (event)=>{
        keysDown[event.keyCode] = true;
        // console.log('키다운객체에 들어간 값은?', keysDown)
        if(event.keyCode === 82){
            location.reload()
        }
    })
    document.addEventListener('keyup', (event)=>{
        delete keysDown[event.keyCode];
        // console.log('버튼 때면 없애주세요', keysDown)
        if(event.keyCode === 32){
            shootBullet();
        }
    })
}
// 우주선 좌표
let spaceshipX = 270;
let spaceshipY = canvas.height - 60;

//우주선 이동
const spaceshipMove = () => {
    if(37 in keysDown && spaceshipX > 0){
        spaceshipX += -8;
    } else if(39 in keysDown && spaceshipX < canvas.width-60){
        spaceshipX += 8;
    } else if(38 in keysDown && spaceshipY > 0){
        spaceshipY += -8;
    } else if(40 in keysDown && spaceshipY < canvas.height-60){
        spaceshipY += 8;
    }
}


//총알 생성
let bulletList = [];

function designBullet(){
    this.create = function(){
        this.x = spaceshipX + 25;
        this.y = spaceshipY - 10;
        this.alive = true;

        bulletList.push(this)
    }
    this.attack = function(lifeUp, enemyBoom){
        enemyList.map((enemy, i)=>{
            if(
                this.y -20 <= enemy.y &&
                enemy.y <= this.y  &&
                this.x -20 <= enemy.x &&
                enemy.x <= this.x 
            )   {
                    this.alive = false; // 죽은 총알
                    enemy.alive = false; 
                    score++;
                    enemyBoom(i);
                    lifeUp(); // 적우주선 격추 후 콜백 함수로 lifeUp함수를 실행시켜준다             
                }
        })
    }
}
const enemyBoom = (enemy) => {
    setTimeout(() => {
        enemyList.splice(enemy,1);
    }, 50);
}

//총알 발사
function shootBullet(){
    let bullet = new designBullet();
    // console.log('bullet: ', bullet);
    
    bullet.create();
}

//총알 움직임
const bulletMove = () => {
    bulletList.map((v,i)=>{
        if(v.y === 0 ) {
            bulletList.splice(i,1)
        } else {
            v.y += -15
        }
    })
}

//적 생성 (class 문법 사용해볼것!)
let enemyList = [];

function designEnemy(){
    this.create = function(){
        this.x = Math.floor(Math.random()*570);
        this.y = 0;
        this.alive = true;
        enemyList.push(this);
    }
}

function createEnemy(){
    let enemy = new designEnemy();
    enemy.create();
}
setInterval(() => 
    createEnemy()
, 70)

//적 이동
const moveEnemy = () => {
    enemyList.map((v,i)=>{
        if(v.y >= 690) {
            enemyList.splice(i,1)
        } else {
            v.y += 5
        }
    })
}

//life 증감 (적우주선이랑 부딛히면 -1 score 높아지면 + 1)
const lifeDown = (GameOver) => {
    enemyList.map((enemy, i)=>{
        if (
            enemy.y - 30 <= spaceshipY &&
            spaceshipY <= enemy.y &&
            enemy.x - 45 <= spaceshipX  &&
            spaceshipX <= enemy.x + 15 
        ) {
            life += -1;
            enemyList.splice(i,1)
            
            if(life < 0) {GameOver()}
        }
    })
}
const lifeUp = () => {   // 최적화를 위해 bullet 객체 attack()함수 콜백함수로 실행  
    for(let i=0; i<5; i++){
        if(score === 20*i && life === 0 && score !== 0) {
            life += 1;
            console.log('life: ', life);
        }
    }
}

//gameOver
const GameOver = () => {
    gameOver = true;

    ctx.drawImage(gameOverImage, 0, 0, canvas.width, canvas.height)
    ctx.fillText('<Press R key>', canvas.width/4 , 95)
    ctx.fillStyle = 'orange';
    ctx.font = "50px Arial"
}
const GameClear = () => {

}

function render(){
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY, 60, 60);
        for (let i=0; i<bulletList.length; i++){
            if(bulletList[i].alive){
                bulletList[i].attack(lifeUp, enemyBoom);
                ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y, 10, 10)
            }
        };
        for (let i=0; i<enemyList.length; i++){
            if(enemyList[i].alive){
                ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y, 30, 30)
            } else {
                ctx.drawImage(enemyBoomImage, enemyList[i].x, enemyList[i].y, 30, 30)
            }
        }
        ctx.fillText('score: '+ score, 20, 25);
        ctx.fillStyle = 'white';
        ctx.font = "20px Arial"
        if(life === 1){
            ctx.drawImage(lifeImage, 120, 5, 25, 25)
        }
}

function main(){
    if(!gameOver && score < 200) {
        render() // 랜더 => 그려준다
        spaceshipMove();
        bulletMove();
        moveEnemy();
        lifeDown(GameOver); // 에너지 깎일때 마다 GameOver 콜백으로 부르자
        requestAnimationFrame(main);
    } else if(!gameOver && score >= 200) {
        ctx.drawImage(gameClear, 0, 0, canvas.width, canvas.height)
    } else {
        GameOver();
    }
}

loadImage();
keyboardListener();
main();