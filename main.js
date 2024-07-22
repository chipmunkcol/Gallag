//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage,
  spaceshipImage,
  bulletImage,
  enemyImage,
  enemyImage2,
  enemyBulletImage,
  enemyBoomImage,
  lifeImage,
  gameOverImage,
  gameClear;
let gameOver = false;
let score = 0;
let life = 0;

function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "images/우주.jpg";
  spaceshipImage = new Image();
  spaceshipImage.src = "images/본체.png";
  bulletImage = new Image();
  bulletImage.src = "images/총알.png";
  enemyImage = new Image();
  enemyImage.src = "images/적.png";
  enemyImage2 = new Image();
  enemyImage2.src = "images/적2.png";
  enemyBoomImage = new Image();
  enemyBoomImage.src = "images/적폭발.png";
  enemyBulletImage = new Image();
  enemyBulletImage.src = "images/적총알.png";
  lifeImage = new Image();
  lifeImage.src = "images/본체.png";
  gameOverImage = new Image();
  gameOverImage.src = "images/게임오버.gif";
  gameClear = new Image();
  gameClear.src = "images/클리어.jpg";
}

// 키보드 이벤트 리스너
let keysDown = {};
function keyboardListener() {
  document.addEventListener("keydown", (event) => {
    keysDown[event.keyCode] = true; // 키를 누르면 해당 키의 코드를 keysDown 객체에 저장
    if (event.keyCode === 82) {
      location.reload(); // R 키를 누르면 게임을 다시 시작
    }
  });
  document.addEventListener("keyup", (event) => {
    delete keysDown[event.keyCode]; // 키를 뗄 때 해당 키의 코드를 keysDown 객체에서 삭제
    if (event.keyCode === 32) {
      shootBullet(); // 스페이스바를 누르면 총알 발사
    }
  });
}
// 우주선 좌표
let spaceshipX = 270;
let spaceshipY = canvas.height - 60;

//우주선 이동
const spaceshipMove = () => {
  if (37 in keysDown && spaceshipX > 0) {
    // 왼쪽 화살표 키
    spaceshipX += -8;
  } else if (39 in keysDown && spaceshipX < canvas.width - 60) {
    // 오른쪽 화살표 키
    spaceshipX += 8;
  } else if (38 in keysDown && spaceshipY > 0) {
    // 위쪽 화살표 키
    spaceshipY += -8;
  } else if (40 in keysDown && spaceshipY < canvas.height - 60) {
    // 아래쪽 화살표
    spaceshipY += 8;
  }
};

//총알 생성
let bulletList = [];

class designBullet {
  constructor() {
    this.create = function () {
      this.x = spaceshipX + 25;
      this.y = spaceshipY - 10;
      this.alive = true;

      bulletList.push(this);
    };
    this.attack = function (lifeUp) {
      // 적 우주선과 충돌 체크
      enemyList.map((enemy, i) => {
        if (
          this.y - 20 <= enemy.y &&
          enemy.y <= this.y &&
          this.x - 20 <= enemy.x &&
          enemy.x <= this.x
        ) {
          this.alive = false; // 적 우주선과 충돌한 총알 제거
          enemyList.splice(i, 1); // 적 우주선 제거
          score++;
          lifeUp(); // 적우주선 격추 후 콜백 함수로 lifeUp함수를 실행시켜준다
        }
      });
      // 적2 우주선과 충돌 체크
      enemyList2.map((enemy2, i) => {
        if (
          this.y - 40 <= enemy2.y &&
          enemy2.y <= this.y &&
          this.x - 40 <= enemy2.x &&
          enemy2.x <= this.x
        ) {
          this.alive = false; // 적 우주선2와 충돌한 총알 제거
          enemyList2.splice(i, 1); // 적 우주선2 제거
          score++;
          lifeUp();
        }
      });
    };
  }
}

//총알 발사
function shootBullet() {
  let bullet = new designBullet();
  // console.log('bullet: ', bullet);

  bullet.create();
}

//총알 움직임
const bulletMove = () => {
  bulletList.map((v, i) => {
    if (v.y === 0) {
      bulletList.splice(i, 1); // 총알이 화면 밖으로 나가면 배열에서 제거
    } else {
      v.y += -15; // 총알이 위로 이동
    }
  });
};

let enemyList = [];

class designEnemy {
  constructor() {
    this.x = Math.floor(Math.random() * 570); // 랜덤한 x 좌표
    this.y = 0; // 화면 상단에서 시작
    this.alive = true;
    this.create = function () {
      enemyList.push(this); // 생성된 적 우주선을 enemyList에 추가
    };
  }
}

function createEnemy() {
  let enemy = new designEnemy();
  enemy.create();
}
setInterval(() => createEnemy(), 100); // 100ms 마다 새로운 적 우주선 생성

//적2 생성
let enemyList2 = [];
let enemyBulletList = [];

class designEnemy2 {
  constructor() {
    this.x = Math.floor(Math.random() * 550); // 랜덤한 x 좌표
    this.y = Math.floor(Math.random() * 100); // 랜덤한 y 좌표
    this.speed = 3; // 이동 속도
    this.radius = 25; // 크기
    this.alive = true;

    this.create = function () {
      enemyList2.push(this); // 생성된 강화된 적 우주선을 enemyList2에 추가
    };
  }
}

class designEnemyBullet {
  constructor() {
    this.create = function (enemyX, enemyY) {
      this.x = enemyX; // 적 우주선2 총알의 x 좌표
      this.y = enemyY; // 적 우주선2 총알의 y 좌표
      this.alive = true;

      enemyBulletList.push(this);
    };
  }
}

//적2 총알 발사
function createEnemyBullet(enemyX, enemyY) {
  let enemyBullet = new designEnemyBullet();
  enemyBullet.create(enemyX, enemyY);
}

function createEnemyBullet2() {
  for (let i = 0; i < enemyList2.length; i++) {
    if (enemyList2[i].alive) {
      createEnemyBullet(enemyList2[i].x + 15, enemyList2[i].y + 25);
    }
  }
}

setInterval(() => {
  createEnemyBullet2(); // 500ms 마다 우주선2가 총알 발사
}, 500);

//적 총알 움직임
const enemyBulletMove = () => {
  enemyBulletList.map((v, i) => {
    if (v.y > canvas.height) {
      enemyBulletList.splice(i, 1); // 화면 밖으로 나간 적 총알 제거
    } else {
      v.y += 5; // 적 총알 아래로 이동
    }
  });
};

function createEnemy2() {
  let enemy2 = new designEnemy2();
  enemy2.create();
}
setInterval(() => createEnemy2(), 5000); // 5초마다 새로운 적 우주선2 생성

//적 이동
const moveEnemy = () => {
  enemyList.map((enemy, i) => {
    if (enemy.y >= 690) {
      enemyList.splice(i, 1); // 화면 밖으로 나간 적 우주선 제거
    } else {
      enemy.y += 5; // 적 우주선 아래로 이동
    }
  });
};

const moveEnemy2 = () => {
  enemyList2.map((enemy) => {
    if (enemy.x <= 0 || enemy.x >= canvas.width - 50) {
      enemy.speed *= -1; // 방향 전환
      enemy.x += enemy.speed; // 적 우주선2 좌우로 이동
    } else {
      enemy.x += enemy.speed;
    }
  });
};

//life 증감 (적우주선이랑 부딛히면 -1 score 높아지면 + 1)
const lifeDown = (GameOver) => {
  enemyList.map((enemy, i) => {
    // 적 우주선과 충돌 체크
    if (
      enemy.y - 30 <= spaceshipY &&
      spaceshipY <= enemy.y &&
      enemy.x - 45 <= spaceshipX &&
      spaceshipX <= enemy.x + 15
    ) {
      life += -1;
      enemyList.splice(i, 1);

      if (life < 0) {
        GameOver();
      }
    }
  });
  enemyBulletList.map((Ebullet, i) => {
    // 적 총알과 충돌 체크
    if (
      Ebullet.y - 40 <= spaceshipY &&
      spaceshipY <= Ebullet.y &&
      Ebullet.x - 40 <= spaceshipX &&
      spaceshipX <= Ebullet.x
    ) {
      life += -1;
      enemyBulletList.splice(i, 1);

      if (life < 0) {
        GameOver();
      }
    }
  });
};
const lifeUp = () => {
  // 최적화를 위해 bullet 객체 attack()함수 콜백함수로 실행
  for (let i = 0; i < 5; i++) {
    if (score === 20 * i && life === 0 && score !== 0) {
      life += 1; // 점수 20점 단위로 생명력 1 증가
    }
  }
};

//gameOver
const GameOver = () => {
  gameOver = true;

  ctx.drawImage(gameOverImage, 0, 0, canvas.width, canvas.height);
  ctx.fillText("<Press R key>", canvas.width / 4, 95);
  ctx.fillStyle = "orange";
  ctx.font = "50px Arial";
};
// 게임 화면 렌더링
function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY, 60, 60);

  // 플레이어 총알 그리기
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].attack(lifeUp);
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y, 10, 10);
    }
  }

  // 적 우주선 그리기
  for (let i = 0; i < enemyList.length; i++) {
    if (enemyList[i].alive) {
      ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y, 30, 30);
    }
  }

  // 강화된 적 우주선 그리기
  for (let i = 0; i < enemyList2.length; i++) {
    if (enemyList2[i].alive) {
      ctx.drawImage(enemyImage2, enemyList2[i].x, enemyList2[i].y, 50, 50);
    }
  }

  // 적 총알 그리기
  for (let i = 0; i < enemyBulletList.length; i++) {
    if (enemyBulletList[i].alive) {
      ctx.drawImage(
        enemyBulletImage,
        enemyBulletList[i].x,
        enemyBulletList[i].y,
        20,
        20
      );
    }
  }

  // 점수 및 생명력 표시
  ctx.fillText("score: " + score, 20, 25);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  if (life === 1) {
    ctx.drawImage(lifeImage, 120, 5, 30, 30);
  }
}

// 메인 게임 루프
function main() {
  if (!gameOver && score < 200) {
    render(); // 화면 렌더링
    spaceshipMove();
    bulletMove();
    enemyBulletMove();
    moveEnemy();
    moveEnemy2();
    lifeDown(GameOver); // 생명력 감소 및 게임 오버 처리
    requestAnimationFrame(main);
  } else if (!gameOver && score >= 200) {
    // 게임 클리어
    ctx.drawImage(gameClear, 0, 0, canvas.width, canvas.height);
  } else {
    GameOver();
  }
}

loadImage();
keyboardListener();
main();
