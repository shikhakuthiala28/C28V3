const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon,boat;
var balls = [];
var boats = [];

var boatAnimation=[];
var boatSprite, boatJson;

var brokenboatAnimation=[];
var brokenboatSprite, brokenboatJson;

var splashAnimation = [];
var splashSpritedata, splashSpritesheet;

var laugh,splash,explosion,bgsound;

var isGameOver=false,isLaughing=false,score=0;

function preload() {
  backgroundImg = loadImage("assets/background.gif");
  towerImage = loadImage("assets/tower.png");

  boatJson=loadJSON("assets/boat/boat.json");
  boatSprite=loadImage("assets/boat/boat.png");

  brokenboatJson=loadJSON("assets/boat/brokenboat.json");
  brokenboatSprite=loadImage("assets/boat/brokenboat.png");

  splashSpritedata=loadJSON("assets/water_splash/water_splash.json");
  splashSpritesheet=loadImage("assets/water_splash/water_splash.png");

  bgsound=loadSound("assets/background_music.wav");
  splash=loadSound("assets/cannon_water.wav");
  explosion=loadSound("assets/cannon_explosion.wav");
  laugh=loadSound("assets/pirare_laugh.mp3");
  
}

function setup() {

  createCanvas(1200,600);

  engine = Engine.create();
  world = engine.world;

  angle = -PI / 4;

  ground = new Ground(0, height - 1, width * 2, 1);

  tower = new Tower(150, 350, 160, 310);

  cannon = new Cannon(180, 110, 100, 50, angle);

  cannonBall = new CannonBall(cannon.x, cannon.y);

  var boatFrames=boatJson.frames;

  for(var i=0;i<boatFrames.length;i++){
    var pos=boatFrames[i].position;
    var img= boatSprite.get(pos.x,pos.y,pos.w,pos.h);
    boatAnimation.push(img);
  }

  var brokenboatFrames=brokenboatJson.frames;

  for(var i=0;i<brokenboatFrames.length;i++){
    var brokenpos=brokenboatFrames[i].position;
    var brokenimg= brokenboatSprite.get(brokenpos.x,brokenpos.y,brokenpos.w,brokenpos.h);
    brokenboatAnimation.push(brokenimg);
  }

  var splashFrames = splashSpritedata.frames;

  for (var i = 0; i < splashFrames.length; i++) {
    var pos = splashFrames[i].position;
    var img = splashSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    splashAnimation.push(img);
  }
  

  
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  if(!bgsound.isPlaying()){
    bgsound.play();
    bgsound.setVolume(0.1);
  }

 

  Engine.update(engine);
  ground.display();
  cannon.display();
  tower.display();

  showBoats();
 

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);

    for( var j=0; j<boats.length; j++){

      if(balls[i]!== undefined && boats[j]!== undefined){
        var collision=Matter.SAT.collides(balls[i].body,boats[j].body);
        if(collision.collided){
          if(!boats[i].isBroken && !balls[i].isSink){
            score=score+1;
            boats[j].remove(j);
          j--;
          }

          Matter.World.remove(world,balls[i]);
          balls.splice(i,1);
          i--;
        }
      }
    }

    textSize(20);
    fill("red");
    text("Score : "+score, 1050,50);
    

  }

 

   
}
function showBoats() {
  if (boats.length > 0) {
    if (
      boats.length < 4 &&
      boats[boats.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40,-60,-70,-20 ];
      var position = random(positions);
      var boat = new Boat(1200,590, 200,200, position,boatAnimation);
      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) {
      Matter.Body.setVelocity(boats[i].body, {
        x: -0.9,
        y: 0
      });

      boats[i].display();
      boats[i].animate();

      var collision=Matter.SAT.collides(tower.body,boats[i].body);
      if(collision.collided && !boats[i].isBroken){
        if(!isLaughing && !laugh.isPlaying()){
          laugh.play();
          isLaughing=true;
        }
        isGameOver=true;
        gameOver();
      }
    }
  } else {
    var boat = new Boat(1200,550, 150, 150, -100,boatAnimation);
    boats.push(boat);
  }
}
function gameOver(){
  swal({
    title: `GAME OVER!`,
    text: "Thank you for Playing.",
    imageUrl: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
    imageSize: "100x100",
    confirmButtonText: "Play Again"
  },
  function(isConfirm){
    if(isConfirm){
      location.reload();
    }
  }
  );
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    balls.push(cannonBall);
  }
}

//function to show the ball
function showCannonBalls(ball, index) {
  ball.display();
  ball.animate();
  if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
    if(!ball.isSink){
      splash.play();
      ball.remove(index);
    }
  }
}



function keyReleased() {
  if (keyCode === DOWN_ARROW) { 
    explosion.play();
    balls[balls.length - 1].shoot();
  }
}