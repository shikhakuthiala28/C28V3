class Boat {
  constructor(x, y,width,height,boatpos, boatAnimation) {
    var options = {
      restitution: 0.8,
      friction: 1.0,
      density: 1.0,
    };

    this.animation=boatAnimation;
    this.speed=0.05;
    
    this.body = Bodies.rectangle(x, y, width,height, options);
    this.w=width;
    this.h=height;
    this.boatposition=boatpos;

    this.image = loadImage("assets/boat.png");
    
    World.add(world, this.body);
  }

  animate(){

    this.speed=this.speed+0.05%1.1;

  }

  remove(index){
    this.animation=brokenboatAnimation;
    this.speed=0.05;
    this.w=300;
    this.h=300;
    this.broken=true;
    setTimeout(()=>{
    Matter.World.remove(world,boats[index].body);
    boats.splice(index,1);
    },2000);
  }
  
  display() {
      var angle = this.body.angle;
      var pos = this.body.position;
      var index= floor(this.speed%this.animation.length);
      push();
      translate(pos.x, pos.y);
      rotate(angle);
      imageMode(CENTER);
      image(this.animation[index], 0, this.boatposition, this.w,this.h);
      noTint();
      pop();

  }
}