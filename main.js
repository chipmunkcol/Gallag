//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src = "images/icons8-space-48.png"
}

function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function main(){
    render()
    requestAnimationFrame(main)
}

loadImage();
main();