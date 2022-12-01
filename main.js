//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width = 600;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let score = 0;

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src = "images/우주.jpg";
    spaceshipImage = new Image();
    spaceshipImage.src = "images/본체.png";
    bulletImage = new Image();
    bulletImage.src = "images/총알.png";
    enemyImage = new Image();
    enemyImage.src = "images/적.png";
} 

let keysDown = {};
function keyboardListener(){
    document.addEventListener('keydown', (event)=>{
        keysDown[event.keyCode] = true;
        // console.log('키다운객체에 들어간 값은?', keysDown)
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
        spaceshipX += -4;
    } else if(39 in keysDown && spaceshipX < canvas.width-60){
        spaceshipX += 4;
    } else if(38 in keysDown && spaceshipY > 0){
        spaceshipY += -4;
    } else if(40 in keysDown && spaceshipY < canvas.height-60){
        spaceshipY += 4;
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
    this.attack = function(){
        enemyList.map((enemy, i)=>{
            if(
                this.y <= enemy.y &&
                this.x >= enemy.x &&
                this.x <= enemy.x + 30
            )   {
                    enemyList.splice(i,1);
                    this.alive = false; // 죽은 총알
                    score += 1;
                }
        })
    }
}

//총알 발사
function shootBullet(){
    let bullet = new designBullet();
    console.log('bullet: ', bullet);
    
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

//적 생성
// 1. 자바스크립트 객체 생성기 사용
let enemyList = [];

function designEnemy(){
    this.create = function(){
        this.x = Math.floor(Math.random()*570);
        this.y = 0;

        enemyList.push(this);
    }
}

function createEnemy(){
    let enemy = new designEnemy();
    enemy.create();
}
setInterval(() => 
    createEnemy()
, 2000)

//적 이동
const moveEnemy = () => {
    enemyList.map((v,i)=>{
        if(v.y >= 690) {
            enemyList.splice(i,1)
        } else {
            v.y += 3
        }
    })
}


function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY, 60, 60);
    for (let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            bulletList[i].attack();
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y, 10, 10)
        }
    };
    for (let i=0; i<enemyList.length; i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y, 30, 30)
    }

    ctx.fillText('score: '+ score, 20, 20);
    ctx.fillStyle = 'white';
    ctx.font = "20px Arial"
}

function main(){
    render() // 랜더 => 그려준다
    spaceshipMove();
    bulletMove();
    moveEnemy();
    requestAnimationFrame(main);
}

loadImage();
keyboardListener();
main();