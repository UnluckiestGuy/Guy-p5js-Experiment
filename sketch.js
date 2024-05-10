// if you're reading this, press 4 at the start for funny

let lasers = []; // having it set to just [] makes it an empty array (aka a group or list) that things can be added to
let aliens = [];
let pFrameCount = 0;
let ultCharge = 300;
let ulting = false;
let cooldown = 0;
let gameOverBool = false;
let strikes = 0;
let score = 0;
let playing = false;
let digitSpacing; // if not set to anything, it will stay as a special value called undefined
let speed;
let ultSpeed;
let egg;
let lasered = false;
let kaboomFrames = [];
let restartButton;
let restartButtonExists;

function preload() {
  // the sound effect of the laser
  laserSound = new Tone.Player("Sounds/laserSound.wav").toDestination();
  laserSound.volume.value = -10;

  alienDeathSound = new Tone.Player("Sounds/alienDeath.wav").toDestination();
  alienDeathSound.playbackRate = 3;
  alienDeathSound.volume.value = -10;

  playerDeathSound = new Tone.Player("Sounds/kaboom.mp3").toDestination();
  playerDeathSound.playbackRate = 1.3;
  playerDeathSound.pitch = 2;

  // the frames for the explosion animation
  for (let i = 0; i <= 16; i++) {
    kaboomFrames[i] = loadImage("Images/kaboomFrames/boomFrame" + i + ".png");
  }
}

function setup() {
  createCanvas(400, 400);

  // creates the ship
  spaceshipSprite = new Sprite(width / 2, height - 30);
  spaceshipSprite.img = loadImage("Images/Spaceship.png");
  spaceshipSprite.visible = false;
  
  idleAni = spaceshipSprite.addAni("idle",spaceshipSprite.img)
  
  spaceshipSprite.changeAnimation("idle");

  // spawn 5 aliens
  for (let i = 0; i < 5; i++) {
    alienSprite = new Sprite();
    alienSprite.img = loadImage("Images/ufo.png");
    alienSprite.x = random(100, width - 50);
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
    textFont("impact", 40);
    fill(255);
    text("PRESS NUM TO START", width / 2, height / 2 - 50);
    textSize(35);
    fill(0,255,0);
    text("1: Slow", width / 5, (height / 4) * 3 - 65);
    fill(255,255,0);
    text("2: Medium", width / 2, (height / 9) * 8 - 65);
    fill(255,50,50);
    text("3: Fast", (width / 5) * 4, (height / 4) * 3 - 65);
    pop();
  }

  if (playing == true) {
    if (gameOverBool == false) {
      spaceshipSprite.visible = true;
    }
    spaceshipSprite.rotation = 0;

    // The ultimate bar
    push();
    fill(255, 100, 100);
    rectMode(CENTER);
    rect(width / 16, height / 2, 25, 300);
    rectMode(CORNER);
    fill(255);
    rect(width / 16 - 12.5, height / 2 - 150, 25, ultCharge);
    pop();

    // the movement
    if (gameOverBool == false) {
      if (kb.pressing("A")) {
        spaceshipSprite.x -= 5 + speed;
      }
      if (kb.pressing("D")) {
        spaceshipSprite.x += 5 + speed;
      }
    }
    
    // this stops the player from going off the screen
    if (spaceshipSprite.x < 0 + 12.5 + 50) {
      spaceshipSprite.x = 0 + 12.5 + 50;
    }
    if (spaceshipSprite.x > width - 10) {
      spaceshipSprite.x = width - 12.5;
    }

    // draws all the lasers
    for (let laser of lasers) {
      laser.y -= 5 + speed;
      push();
      fill(255, 50, 50);
      ellipse(laser.x, laser.y, 10, 15);
      pop();
    }

    // for all the aliens, move them downward, keep them rotated straight, and make them invisible if the game is overed
    for (let alien of aliens) {
      alien.y = alien.y + 3 + speed;
      alien.rotation = 0;
    }

    // deals with killing aliens and adding score
    for (let alien of aliens) {
      // do this once for every thing in the "aliens" array
      for (let laser of lasers) {
        // do this once for every thing in the "lasers" array
        if (dist(alien.x, alien.y, laser.x, laser.y) < 30) {
          // if the laser and the alien in question are overlapping
          alien.life = 0; // alien begone
          alienDeathSound.start();
          // take the alien and laser out of their respective arrays
          aliens.splice(aliens.indexOf(alien), 1);
          lasers.splice(lasers.indexOf(laser), 1);

          // make a new alien to replace the old one
          newAlienSprite = new Sprite();
          newAlienSprite.img = loadImage("Images/ufo.png");
          newAlienSprite.x = random(100, width - 50);
          newAlienSprite.y = random(-1000, -35);
          newAlienSprite.overlaps(spaceshipSprite);
          newAlienSprite.layer = 2;
          aliens.push(newAlienSprite); // put the new alien in the "aliens" array
          score++; // increase the score by 1
          // increase the ult charge if it isn't full and if it isn't being used
          if (ultCharge > 0 && ulting == false) {
            ultCharge -= 20;
          }
        }
      }
    }

    // every 10 seconds, add one alien to the total
    if (gameOverBool == false) {
      // if the game isn't gameovered
      if (frameCount - pFrameCount >= 600) {
        alienSprite = new Sprite();
        alienSprite.img = loadImage("Images/ufo.png");
        alienSprite.x = random(100, width - 50);
        alienSprite.y = random(-1000, -35);
        alienSprite.overlaps(spaceshipSprite);
        alienSprite.layer = 2;
        aliens.push(alienSprite);
        pFrameCount = frameCount;
      }
    }

    // if an alien goes past the bottom of the screen, send it back to the top and add a strike
    for (let alien of aliens) {
      if (alien.y > height + 50) {
        alien.y = random(-500, -35);
        strikes++;
      }
    }

    // if the laser goes past the top of the screen, delete it
    for (let laser of lasers) {
      if (laser.y < -10) {
        lasers.splice(lasers.indexOf(laser), 1);
      }
    }

    // displays the score
    push();
    textAlign(RIGHT);
    textFont("impact", 30);
    fill(255);
    text(str(score), width - 7.5, 32.25);
    pop();

    // displays the strikes
    push();
    stroke(255, 0, 0);
    strokeWeight(5);
    for (let i = 0; i < strikes; i++) {
      // do this as many times as there are strikes
      line(16, 16, 36, 36);
      line(16, 36, 36, 16);
      translate(30, 0);
    }
    pop();

    // if there are 3 strikes, game over
    if (strikes >= 3) {
      if (gameOverBool == false) {
        gameOver();
      }
    }

    // the gameover text
    if (gameOverBool == true) {
      if (speed != 10) {
        push();
        textAlign(CENTER);
        textFont("impact", 40);
        fill(255);
        text("GAME OVER", width / 2, height / 2);
        pop();
      }
      if (speed == 10) {
        push();
        textAlign(CENTER);
        textFont("impact", 40);
        fill(255);
        text("GAME OVER", width / 2, height / 2);
        textFont("Arial");
        textStyle(BOLD);
        text(">:D", width / 2, height / 2 + 50);
        pop();
      }
    }

    if (kb.presses("space")) {
      if (gameOverBool == false) {
        if (ulting == false) {
          let laser = {
            x: spaceshipSprite.x,
            y: height - 40,
          };
          lasers.push(laser);
          // prevents the laser sound from being called twice in the same frame (breaks the game)
          if (lasered == false) {
            laserSound.start();
            lasered = true;
          }
        }
      }
    }

    // the ult
    if (ulting) {
      if (gameOverBool == false) {
        if (speed != 10) {
          ultSpeed = 8 - speed;
        } else {
        ultSpeed = 1;
        }
        if (cooldown == ultSpeed) {
          // fire the lasers at a specific rate instead of every frame
          let lLaser = {
            x: spaceshipSprite.x - 10,
            y: height - 40,
          };
          let rLaser = {
            x: spaceshipSprite.x + 10,
            y: height - 40,
          };
          // prevents the laser sound from being called twice in the same frame (breaks the game)
          if (lasered == false) {
            laserSound.start();
            lasered = true;
          }
          lasers.push(lLaser, rLaser); // add these lasers to the "lasers" array
          cooldown = 0;
        }
        cooldown++;
        if (speed != 10) {
          ultCharge += 2;
        } else {
          ultCharge += 5;
        }
      }
    }
    if (ultCharge == 300) {
      ulting = false;
    }
  }
  easterEggText();
  lasered = false;
} // ------------------------- draw end -------------------------

function keyPressed() {
  if (keyCode == 71) {
    // keycode 71 is g
    // I use this for debugging sounds
  }
  // the starting options
  if (playing == false) {
    if (keyCode == 49) {
      // keycode 49 is 1
      speed = 2;
      playing = true;
    } else if (keyCode == 50) {
      // keycode 50 is 2
      speed = 3;
      playing = true;
    } else if (keyCode == 51) {
      // keycode 51 is 3
      speed = 4;
      playing = true;
    } else if (keyCode == 52) {
      // keycode 52 is 4
      speed = 10;
      egg = true;
      // setTimeout lets you do something after a delay, which in this case is 2000 milliseconds, or 2 seconds
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
}

// self-explanatory; called when strikes reaches 3
function gameOver() {  
  gameOverBool = true;
  
  restartButton = createButton("RESTART?")
  restartButton.position(width/1.363,height/4*3);
  restartButton.mousePressed(restart);
  
  // kill all aliens
  for (let alien of aliens) {
    alien.visible = false;
    alien.life = 0;
  }
  // take the aliens out of the array
  aliens.splice(0, aliens.length);

  // play the death sound and replace the player's image with the explosion animation
  playerDeathSound.start();
  kaboom(spaceshipSprite);
  // stops the death sound early
  setTimeout(() => {
    playerDeathSound.stop();
  }, 1400);
}

function easterEggText() {
  if (egg == true) {
    push();
    background(50);
    fill(255);
    textAlign(CENTER);
    textFont("Impact", 50);
    text("You found an", width / 2, height / 2 - 50);
    text("easter egg!", width / 2, height / 2);
    fill(255, 50, 50);
    text("TURBO MODE!!!!!", width / 2, height / 2 + 50);
    pop();
  }
}

function kaboom(sprite) {
  kaboomAni = sprite.addAni(
      "kaboom",
      kaboomFrames[0],
      kaboomFrames[1],
      kaboomFrames[2],
      kaboomFrames[3],
      kaboomFrames[4],
      kaboomFrames[5],
      kaboomFrames[6],
      kaboomFrames[7],
      kaboomFrames[8],
      kaboomFrames[9],
      kaboomFrames[10],
      kaboomFrames[11],
      kaboomFrames[12],
      kaboomFrames[13],
      kaboomFrames[14],
      kaboomFrames[15],
      kaboomFrames[16]);
  kaboomAni.frameDelay = 2;
  setTimeout(() => {
    spaceshipSprite.visible = false;
  }, 466.666666667);
}

function restart() {
  allSprites.remove();
  restartButton.remove();
  // resetting almost all the variables (some shouldn't be reset)
  lasers = [];
  aliens = [];
  pFrameCount = 0;
  ultCharge = 300;
  ulting = false;
  cooldown = 0;
  gameOverBool = false;
  strikes = 0;
  score = 0;
  playing = false;
  digitSpacing = undefined;
  speed = undefined;
  ultSpeed = undefined;
  egg = undefined;
  lasered = false;
  // calling setup again
  setup();
}
