let lasers = [];
let aliens = [];
let pFrameCount = 0;
let ultCharge = 300;
let ulting = false;
let cooldown = 0;
let gameOverBool = false;
let strikes = 0;
let score = 0;
let playerX = 200;
let playing = false;
let digitSpacing;

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
  if (playing == false) {
    push();
    textAlign(CENTER);
    textFont("impact",40);
    fill(255);
    text("START?",width/2,height/2);
    pop();
  }
  if (playing == true) {
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
      playerX = 12.5;
    }
    if (playerX > width-10) {
      playerX = width-12.5;
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
    if (score >= 100) {
      digitSpacing = width-25;
    }
    else {
      digitSpacing = width-20;
    }
    push();
    textAlign(CENTER);
    textFont("impact",30);
    fill(255);
    text(str(score),digitSpacing,30)
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

function mousePressed() {
  if (playing == false) {
    playing = true;
  }
}

function gameOver() {
  gameOverBool = true;
  aliens.splice(0,aliens.length);
}
