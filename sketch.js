let lasers = [];
let aliens = [];
let pFrameCount = 0;
let ultCharge = 300;
let ulting = false;
let cooldown = 0;
let gameOverBool = false;
let strikes = 0;
let score = 0;
let playing = false;
let digitSpacing;
let speed;
let ultSpeed;
let egg;

function setup() {
  createCanvas(400, 400);
  
  spaceshipSprite = new Sprite(width/2, height-30);
  spaceshipSprite.img = loadImage("Images/Spaceship.png");
  spaceshipSprite.visible = false;
  
  //spawn 5 aliens
  for (let i = 0; i < 5; i++) {
    alienSprite = new Sprite();
    alienSprite.img = loadImage("Images/ufo.png");
    alienSprite.x = random(100,width-50);
    alienSprite.y = random(-1000, -35);
    alienSprite.overlaps(spaceshipSprite);
    alienSprite.layer = 2;
    aliens.push(alienSprite);
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
    spaceshipSprite.visible = true;
    spaceshipSprite.rotation = 0;
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
      spaceshipSprite.x -= 5 + speed;
    }
    if (kb.pressing("D")) {
      spaceshipSprite.x += 5 + speed;
    }
    
    // this stop the player from going off the screen
    if (spaceshipSprite.x < 0+12.5) {
      spaceshipSprite.x = 0+12.5;
    }
    if (spaceshipSprite.x > width-10) {
      spaceshipSprite.x = width-12.5;
    }
  
    // draws all the lasers
    for (let laser of lasers) {
      laser.y -= 5 + speed;
      push();
      fill(255,50,50);
      ellipse(laser.x, laser.y, 10, 15);
      pop();
    }
  
    // for all the aliens, move them downward, keep them rotated straight, and make them invisible if the game is overed
    for (let alien of aliens) {
      alien.y = alien.y + 3 + speed;
      alien.rotation = 0;
    }
  
    // deals with killing aliens
    for (let alien of aliens) {
      for (let laser of lasers) {
        if (dist(alien.x, alien.y, laser.x, laser.y) < 30) {
          alien.life = 0;
          aliens.splice(aliens.indexOf(alien), 1);
          lasers.splice(lasers.indexOf(laser), 1);
          
          newAlienSprite = new Sprite();
          newAlienSprite.img = loadImage("Images/ufo.png");
          newAlienSprite.x = random(100,width-50);
          newAlienSprite.y = random(-1000, -35);
          newAlienSprite.overlaps(spaceshipSprite);
          newAlienSprite.layer = 2;
          aliens.push(newAlienSprite);
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
        alienSprite = new Sprite();
        alienSprite.img = loadImage("Images/ufo.png");
        alienSprite.x = random(100,width-50);
        alienSprite.y = random(-1000, -35);
        alienSprite.overlaps(spaceshipSprite);
        alienSprite.layer = 2;
        aliens.push(alienSprite);
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
        ultSpeed = 8 - speed
      }
      else {
        ultSpeed = 1;
      }
      if (cooldown == ultSpeed) {
       let lLaser = {
        x: spaceshipSprite.x-10,
        y: height-40,
      };
        let rLaser = {
        x: spaceshipSprite.x+10,
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
      speed = 2;
      playing = true;
    }
    else if (keyCode == 50) { // keycode 50 is 2
      speed = 3;
      playing = true;
    }
    else if (keyCode == 51) { // keycode 51 is 3
      speed = 4;
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
        x: spaceshipSprite.x,
        y: height - 40,
      };
      lasers.push(laser);
    }
  }
}


// self-explanatory; called when strikes reaches 3
function gameOver() {
  gameOverBool = true;
  for (let alien of aliens) {
    alien.visible = false;
    alien.life = 0;
  }
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
