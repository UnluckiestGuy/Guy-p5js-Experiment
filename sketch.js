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
let speed;
let ultSpeed;
let egg;

function setup() {
  createCanvas(400, 400);
  frameRate(60);
  
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
  // the start screen
  if (playing == false) {
    push();
    textAlign(CENTER);
    textFont("impact",40);
    fill(255);
    text("PRESS NUM TO START",width/2,height/2-50);
    textSize(35);
    text("1: Slow",width/5,height/4*3-65);
    text("2: Medium",width/2,height/9*8-65);
    text("3: Fast",width/5*4,height/4*3-65);
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
  
    // the movement
    if (kb.pressing("A")) {
      playerX -= 5 + speed;
    }
    if (kb.pressing("D")) {
      playerX += 5 + speed;
    }
    
    // this stop the player from going off the screen
    if (playerX < 0+10) {
      playerX = 12.5;
    }
    if (playerX > width-10) {
      playerX = width-12.5;
    }
    
    // draws the player
    circle(playerX, height - 30, 25);
  
    // draws all the lasers
    for (let laser of lasers) {
      laser.y -= 5 + speed;
      circle(laser.x, laser.y, 10);
    }
  
    // draws all the aliens
    for (let alien of aliens) {
      alien.y = alien.y + 3 + speed;
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

    // if the laser goes past the top of the screen, delete it
    for (let laser of lasers) {
      if (laser.y<-10) {
        lasers.splice(lasers.indexOf(laser), 1);
      }
    }

    // displays the score
    push();
    textAlign(RIGHT);
    textFont("impact",30);
    fill(255);
    text(str(score),width-7.5,32.25)
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
      if (speed != 10) {
        push();
        textAlign(CENTER);
        textFont("impact",40);
        fill(255);
        text("GAME OVER",width/2,height/2);
        pop();
      }
      if (speed == 10) {
        push();
        textAlign(CENTER);
        textFont("impact",40);
        fill(255);
        text("GAME OVER",width/2,height/2);
        textFont("Arial");
        textStyle(BOLD);
        text(">:D",width/2,height/2+50);
        pop();
      }
    }

    // the ult
    if (ulting) {
      if (speed != 10) {
        ultSpeed = 6 - speed
      }
      else {
        ultSpeed = 1;
      }
      if (cooldown == ultSpeed) {
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
      if (speed != 10) {
        ultCharge+=2;
      }
      else {
        ultCharge+=5;
      }
    }
    if (ultCharge == 300) {
      ulting = false;
    }
  }
  easterEggText();
}

function keyPressed() {
  // the starting options
  if (playing == false) {
    if (keyCode == 49) { // keycode 49 is 1
      speed = 1;
      playing = true;
    }
    else if (keyCode == 50) { // keycode 50 is 2
      speed = 2;
      playing = true;
    }
    else if (keyCode == 51) { // keycode 51 is 3
      speed = 3;
      playing = true;
    }
    else if (keyCode == 52) { // keycode 52 is 4
      speed = 10;
      egg = true;
      setTimeout(() => {
        egg = false;
        playing = true; 
      }, 2000);
    }
  }
  // keycode 16 = shift; activates ult
  if (keyCode == 16) {
    if (ultCharge == 0) {
      if (gameOverBool == false) {
        ulting = true;
      }
    }
  }
  // keycode 32 = space; fires a laser
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


// self-explanatory; called when strikes reaches 3
function gameOver() {
  gameOverBool = true;
  aliens.splice(0,aliens.length);
}

function easterEggText() {
  if (egg == true) {
    push();
    background(50);
    fill(255);
    textAlign(CENTER);
    textFont("Impact",50);
    text("You found an",width/2,height/2-50)
    text("easter egg!",width/2,height/2);
    fill(255,50,50);
    text("TURBO MODE!!!!!",width/2,height/2+50);
    pop();
  }
}
