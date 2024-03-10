/*
I added
1. More aliens over time (87-97)
2. An ultimate (38-48 && 148-180)
3. Aliens go back to the top if they fall off the screen, and if a laser goes past the top, delete it (99-105 && 141-146)
4. Strikes and a game over (115-139 && 193-196)
5. A score (107-113)
*/

let lasers = [];
let aliens = [];
let player1;
let pFrameCount = 0;
let ultCharge = 300;
let ulting = false;
let cooldown = 0;
let gameOverBool = false;
let strikes = 0;
let score = 0;
let playerX = 200;

function setup() {
  createCanvas(400, 400);
  
  //spawn 5 aliens
  for (let i = 0; i < 5; i++) {
    let alien = {
      x: random(100,width-50),
      y: random(-1000, -35),
    };
    aliens.push(alien);
  }
}

function draw() {
  background(50);
  rect(width/2,height/2,50,50);
  // The ultimate bar
  // red rectangle
  push();
  fill(255,100,100);
  rectMode(CENTER);
  rect(width/16,height/2,25,300);
  // white rectangle
  rectMode(CORNER);
  fill(255);
  rect(width/16-12.5,height/2-150,25,ultCharge);
  pop();

  if (kb.pressing("A")) {
    playerX -= 5;
  }
  if (kb.pressing("D")) {
    playerX += 5;
  }
  if (playerX < 0+10) {
    playerX = 10;
  }
  if (playerX > width-10) {
    playerX = width-10;
  }
  circle(playerX, height - 30, 25);

  // draws lasers
  for (let laser of lasers) {
    laser.y -= 5;
    circle(laser.x, laser.y, 10);
  }

  // draws aliens
  for (let alien of aliens) {
    alien.y = alien.y + 3;
    square(alien.x, alien.y, 30);
  }

  // deals with killing aliens
  for (let alien of aliens) {
    for (let laser of lasers) {
      if (dist(alien.x, alien.y, laser.x, laser.y) < 30) {
        aliens.splice(aliens.indexOf(alien), 1);
        lasers.splice(lasers.indexOf(laser), 1);
        let newAlien = {
          x: random(50, width-50),
          y: random(-500, -35),
        };
        aliens.push(newAlien);
        score++;
        if (ultCharge > 0 && ulting == false) {
        ultCharge -= 20;
        }
      }
    }
  }
  
  // Every 10 seconds, add one alien to the total
  if (gameOverBool == false) {
    if (frameCount - pFrameCount >= 600) {
      let alien = {
        x: random(100,width-50),
        y: random(-1000, -35),
      };
      aliens.push(alien);
      pFrameCount = frameCount;
    }
  }
  
  // If an alien goes past the bottom of the screen, send it back to the top and add a strike
  for (let alien of aliens) {
    if (alien.y > height+50) {
      alien.y = random(-500, -35);
      strikes++;
    }
  }
  
  // displays the score
  push();
  textAlign(CENTER);
  textFont("impact",30);
  fill(255);
  text(str(score),width-20,30)
  pop();
  
  // displays the strikes
  push();
  stroke(255,0,0);
  strokeWeight(5);
  for (let i = 0; i < strikes; i++) {
    line(16,16,36,36);
    line(16,36,36,16);
    translate(30,0);
  }
  pop();
  
  // if there are 3 strikes, game over
  if (strikes >= 3) {
    gameOver();
  }
  
  // the gameover text
  if (gameOverBool == true) {
    push();
    textAlign(CENTER);
    textFont("impact",40);
    fill(255);
    text("GAME OVER",width/2,height/2);
    pop();
  }
  
  // if the laser goes past the top of the screen, delete it
  for (let laser of lasers) {
    if (laser.y<-10) {
      lasers.splice(lasers.indexOf(laser), 1);
    }
  }
  
  // the ult
  if (ulting) {
    if (cooldown == 5) {
     let lLaser = {
      x: playerX-10,
      y: height-40,
    };
      let rLaser = {
      x: playerX+10,
      y: height-40,
    };
      lasers.push(lLaser,rLaser);
      cooldown = 0;
    }
    cooldown++;
    ultCharge+=2;
  }
  if (ultCharge == 300) {
    ulting = false;
  }
}

//
function keyPressed() {
  // keycode 16 = shift activates ult
  if (keyCode == 16) {
    if (ultCharge == 0) {
      if (gameOverBool == false) {
        ulting = true;
      }
    }
  }
  // space
  if (keyCode == 32) {
    if (gameOverBool == false) {
      let laser = {
        x: playerX,
        y: height - 40,
      };
      lasers.push(laser);
    }
  }
}

//spawn lasers when mouse is clicked
function mousePressed() {
}

function gameOver() {
  gameOverBool = true;
  aliens.splice(0,aliens.length);
}
