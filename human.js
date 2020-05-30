//Epidemic Simulation (COVID -19)
//p5.js
//Attraction and Repulsion ideas taken from The Coding Train -Daniel Shiffman
//Author: Shoubhik Banerjee

//Human Class
class Human extends Ball{
  constructor(r) {
    super (r);
    this.id = 'S';
    this.age = true;
    this.colour = color(252, 252, 51);
    this.timer_on = false;
  }
  //Initialize a certain percent of population as old
  per_age(l) {
    var m = random(0,1);
    if (m < (l / 100)) {
      this.age = false;
      this.colour = color(42, 188, 57);
    }
  }
  //Check for intersection
  intersects(other,perception_radius) {
   let d = dist(this.location.x, this.location.y, other.location.x, other.location.y);
    if(d < perception_radius){
      return true;
    }else{return false}
  }
  //Method to simulate infection spread.
  infect(perception_radius,people) {
    for (let other of people) {
      var cond = this.intersects(other,perception_radius);
      if(cond == true){
          if((other!=this) && (other.id == 'S' && this.id == 'I')||(other.id =='I'&& this.id =='S')){
          var m = random(0,1);
          if (m < prob_infection) {
            this.id = 'I';
            other.id = 'I';
            this.colour = color(255,0,0);
            other.colour = color(255, 0, 0);
            this.ring(this.location.x,this.location.y,perception_radius);
          }
        }
      }
    }
  }
  //Method to simulate recovery of human.
  recover(people){
    for(let other of people){
     if(other.id == 'I' && other.timer_on == false){
       setTimeout(function(){other.recovery(other)},13000);
       other.timer_on = true;
     }
    }
  }
  //Ring animation effect
  ring(x,y,rad){
      stroke(255,0,0,150);
      strokeWeight(4);
      noFill();
      ellipse(x,y,rad*2,rad*2);
  }
  //Sub-method of Recover, checks for chances that an individual recovers or dies based on his/her age group.
  //Statistical Data of mortality rates acquired from COVID-19 Age data from Worldometer.
  recovery(ball){
    var chance = random(0,1);
    if(chance <= 0.977 && ball.age == true){
        ball.id = 'R';
        ball.colour = color(33,232,217);
    }else if(chance > 0.977 && ball.age == true){ball.death(ball)}
    else if(chance <= 0.335 && ball.age == false){
        ball.id = 'R';
        ball.colour = color(0,0,255);
    }else if(chance > 0.335 && ball.age == false){ball.death(ball)}
  }
  //Death of Human.
  death(ball){
    ball.id = 'D';
    ball.colour = color(0,0);
  }
  //Implementation of Social Distancing among humans
  socialDistance(people,perception_radius){
    let steering = createVector();
    let counter = 0;
    for(let other of people){
      let d1 =  dist(
        this.location.x,
        this.location.y,
        other.location.x,
        other.location.y
      );
      if(other!= this && d1 < (perception_radius*1.2)){
          let diff  = p5.Vector.sub(this.location,other.location);
          diff.normalize();
          steering.add(diff);
          counter++;
        }
    }
    if(counter>0){
          steering.div(counter);
          steering.setMag(this.maxSpeed);
          steering.sub(this.velocity);
          steering.limit(this.maxForce);
        }
    let separation = steering;
    separation.mult(separationSlider.value());
    this.acceleration.add(separation);
  }
  show() {
  fill(this.colour);
  noStroke()
  ellipse(this.location.x, this.location.y, this.radius, this.radius);
 }
}
//Attractor class used in Central Loaction mode
class Attractor{
  constructor(){
    this.location = createVector(width/2,height/2);
    this.mass = 20;
    this.G = 800;
  }
  CalculateAttraction(m){
    var force = p5.Vector.sub(this.location,m.location);
    var distance = force.mag();
    distance = constrain(distance,2,150);
    force.normalize();
    var strength = (this.G * this.mass * m.mass) / (distance * distance);
    force.mult(strength);
    return force;
  }
}
//Attract infected humans to the quarantine zone.
class InfAttractor{
  constructor(){
    this.location = createVector(width/2,height/2);
    this.mass = 20;
    this.G = 30;
  }
  CalculateInfAttraction(m){
    var force = p5.Vector.sub(this.location,m.location);
    var distance = force.mag();
    distance = constrain(distance,2,150);
    force.normalize();
    var strength = (this.G * this.mass * m.mass) / (distance * distance);
    if(distance < 15){
      force.mult(strength/10);
    }else
    force.mult(strength);
    return force;
  }
}
//Repulsion class to keep non-infected individuals away from quarantine zone.
class Repeller{
  constructor(){
    this.location = createVector(width/2,height/2);
    this.mass = 5;
    this.G = 20;
  }
    CalculateRepulsion(m){
      var force = p5.Vector.sub(this.location,m.location);
      var distance = force.mag();
      distance = constrain(distance,2,400);
      force.normalize();
      var strength = -(this.G * this.mass * m.mass)/(distance*distance);
      force.mult(strength);
      return force;
    }
  }
class Community extends Attractor{
    constructor(x,y){
      super();
      this.location = createVector(x,y);
      this.G = 8;
    }
    CalculateAttraction(m){
      var force = p5.Vector.sub(this.location,m.location);
      var distance = force.mag();
      distance = constrain(distance,40,800);
      force.normalize();
      var strength = (this.G * this.mass * m.mass) / (distance * distance);
      if(distance < 60){
        force.mult(strength/4);
      }else
      force.mult(strength);
      return force;
    }

}
//Quarantine People
function quarantine(people){
  if(q_on == true){
    noFill();
    stroke(255,0,0,150);
    strokeWeight(1.5);
    ellipse(width/2,height/2,80,80);
    ellipseMode(CENTER);
    for(let ball of people){
      var repell = new Repeller();
      var force3 = repell.CalculateRepulsion(ball);
      ball.applyForce(force3);
      transport(ball);
    }
  }
}
//Sub-method of quarantine to capture people.
function transport(ball){
  esc = random(0,1);
  if(ball.id == 'I' && esc < leakyslider.value()){
    var trans = new InfAttractor();
    var shift = trans.CalculateInfAttraction(ball);
    ball.applyForce(shift);
  }
}
//Simulation of Central Location Mode
function central(people){
  if(mark_on == true){
    noFill();
    stroke(255,0,0,150);
    strokeWeight(1.5);
    rect(width/2,height/2,20,20);
    rectMode(CENTER);
    ba = random(people);
    var attract = new Attractor();
    var force2 = attract.CalculateAttraction(ba);
    ba.applyForce(force2);
  }
}
//Update count of the state of each individual.
function updateCount(people){
  var sus_old = 0;
  var sus_young = 0;
  var inf_old = 0;
  var inf_young = 0;
  var dead_old = 0;
  var dead_young = 0;
  var rec_old = 0;
  var rec_young = 0;
  for(let ball of people){
    if(ball.id == 'I'){
      if(ball.age == true){
        inf_young++;
      }else {inf_old++}
    }
    else if(ball.id == 'S'){
      if(ball.age == true){
        sus_young++;
      }else {sus_old++}
    }
    else if(ball.id == 'D'){
      if(ball.age == true){
        dead_young++;
      }else {dead_old++}
    }
    else if(ball.id == 'R'){
      if(ball.age == true){
        rec_young++;
      }else {rec_old++}
    }
  }
      sold = sus_old;
      syoung = sus_young;
      iold = inf_old;
      iyoung = inf_young;
      rold = rec_old;
      ryoung = rec_young;
      dold = dead_old;
      dyoung = dead_young;
      inf = (inf_young + inf_old);
      sus = (sus_young + sus_old);
      rec = (rec_young + rec_old);
      dead = (dead_young + dead_old);

      textAlign(LEFT, CENTER);
      fill(255, 0, 0);
      text("Infected: " + (inf_young + inf_old) , 10, 15);
      textAlign(LEFT, CENTER);
      fill(0, 255, 0);
      text("Susceptible: " + (sus_young + sus_old) , 10, 30);
      textAlign(LEFT, CENTER);
      fill(0, 0, 255);
      text("Recovered: " + (rec_young + rec_old), 10, 45);
      textAlign(LEFT, CENTER);
      fill(255);
      text("Dead: " + (dead_young + dead_old) , 10, 60);
}
var prob_infection = 0.02;
var people = [];
var sold = 0;
var syoung = 0;
var rold = 0;
var ryoung = 0;
var iold = 0;
var iyoung = 0;
var dold = 0;
var dyoung = 0;
var graph = true;
var inf = 0;
var sus = 50 ;
var dead = 0;
var rec = 0;
var mark_on = false;
var q_on = false;
let button_reset;
let separationSlider;
var popslider;
var sizeslider;
var infslider;
var infradslider;
var oldprobslider;
var leakyslider;
function setup() {
  var canvas = createCanvas(450, 450);
  canvas.parent('canv');
  for (let i = 0; i < 50; i++) {
    people.push(new Human(6));
  }
  for (let ball of people) {
    ball.per_age(20);
  }
  const p = random(people);
  p.id = 'I';
  p.colour = color(255,0,0);
  button_reset = createButton("Reset");
  button_reset.parent('canv');
  separationSlider = createSlider(0, 0.5, 0, 0.1);
  separationSlider.parent('soslider');
  market = createButton("Market");
  market.parent('canv');
  quar = createButton("Quarantine");
  quar.parent('canv');
  popslider = createSlider(10,100,50,10);
  popslider.parent('pop_slider');
  sizeslider= createSlider(4,8,6,1);
  sizeslider.parent('hum_slider');
  infslider= createSlider(0.01,0.1,0.02,0.01);
  infslider.parent('inf_slider');
  infradslider= createSlider(10,30,18,4);
  infradslider.parent('radslider');
  oldprobslider = createSlider(20,80,20,30);
  oldprobslider.parent('oldslider');
  leakyslider = createSlider(0.35,0.85,0.85,0.10);
  leakyslider.parent('leakslider');
}
function markison(){
  mark_on = true;
  q_on = false;
}
function qison(){
  q_on = true;
  mark_on = false;
}
function resetSketch(){
    graph = false;
    people = [];
    inf = 0;
    sus = popslider.value();
    dead = 0;
    rec = 0;
    sold = 0;
    syoung = 0;
    iold = 0;
    iyoung = 0;
    rold = 0;
    ryoung = 0;
    dold = 0;
    dyoung = 0;
   for (let i = 0; i < popslider.value() ; i++) {
     people.push(new Human(sizeslider.value()));
   }
   for (let ball of people) {
     ball.per_age(oldprobslider.value());
   }
   const p = random(people);
   p.id = 'I';
   p.colour = color(255,0,0);
   mark_on = false;
   q_on = false;
}
function draw() {
  background(0);
  document.getElementById("population").innerHTML = popslider.value();
  document.getElementById("Human_size").innerHTML = sizeslider.value();
  document.getElementById("Inf_prob").innerHTML = infslider.value();
  prob_infection = infslider.value();
  document.getElementById("Inf_rad").innerHTML = infradslider.value();
  document.getElementById("socio").innerHTML = separationSlider.value();
  document.getElementById("old_prob").innerHTML = oldprobslider.value();
  document.getElementById("leako").innerHTML = leakyslider.value();

  for (let ball of people) {
    ball.edges();
    ball.socialDistance(people,infradslider.value());
    ball.update();
    ball.infect(int(infradslider.value()), people);
    ball.recover(people);
    
    var travel = new Community(width/4,height/4);
    var travel2 = new Community(width/4,3*(height/4));
    var travel3 = new Community(3*(width/4),height/4);
    var travel4 = new Community(3*(width/4),3*(height/4));
    var tra = travel.CalculateAttraction(ball);
    var tra1 = travel2.CalculateAttraction(ball);
    var tra2 = travel3.CalculateAttraction(ball);
    var tra3 = travel4.CalculateAttraction(ball);

    ball.applyForce(tra);
    ball.applyForce(tra1);
    ball.applyForce(tra2);
    ball.applyForce(tra3);

    ball.show();
  }

  updateCount(people);
  market.mousePressed(markison);
  quar.mousePressed(qison);
  central(people);
  quarantine(people);
  noFill();
  stroke(255);
  strokeWeight(1.5);
  rect(width/4,height/4,210,210);
  rectMode(CENTER);
  rect(width/4,3*(height/4),210,210);
  rectMode(CENTER);
  rect(3*(width/4),height/4,210,210);
  rectMode(CENTER);
  rect(3*(width/4),3*(height/4),210,210);
  rectMode(CENTER);

  button_reset.mousePressed(resetSketch);
}
