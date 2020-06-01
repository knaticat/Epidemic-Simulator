
class Ball{
  constructor(r) {
    this.location = createVector(random(r,width-r), random(r,height-r));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.mass = 1;
    this.maxForce = 0.3;
    this.maxSpeed = 1.5;
    this.radius = r;
  }
  applyForce(force) {
    var f = p5.Vector.div(force,this.mass);
    this.acceleration.add(f);
  }
  edges(){
    if (this.location.x > width){
      this.location.x = width;
      this.velocity.x *= -1;
    }else if (this.location.x < 0) {
      this.location.x = 0;
      this.velocity.x *= -1;
    }
    else if (this.location.y < 0) {
      this.location.y = 0;
      this.velocity.y *= -1;
    } else if (this.location.y > height) {
      this.location.y = height;
      this.velocity.y *= -1;
    }
  }
  update() {
    this.location.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }
}
