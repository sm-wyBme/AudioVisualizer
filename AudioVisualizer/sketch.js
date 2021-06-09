var song
var img
var particles = []
var fft

function preload(){
  song = loadSound("ChooLo.mp3")
  img = loadImage("pic.jpg")
}

function setup(){
  createCanvas(windowWidth,windowHeight)
  angleMode(DEGREES)   //angle mode set to degrees
  imageMode(CENTER)
  rectMode(CENTER)
  fft = new p5.FFT(0.3)
  //img.filter(BLUR, 10)
  noLoop()
}

function draw(){
  background(0);
  
  stroke(255)  //wave color
  strokeWeight(3)
  noFill()

  translate(width/2, height/2)   //move x,y to the centre of the screen 
  
 
  fft.analyze()
  amp = fft.getEnergy(20,200)   //energy of the wave

  image(img, 0, 0, width, height)

  var aplha = map(amp, 0,255,180,150)
  fill(0,aplha)
  noStroke()
  rect(0,0, width, height)

  var clr = [random(50,255),random(50,255),random(50,255)]
  stroke(clr)  //wave color
  strokeWeight(3)
  noFill()

  var wave = fft.waveform()   //store the array of elements of the waveform data
  

  for(var t = -1; t <= 1; t += 2){
  //first half of the circle
    beginShape()
    for(var i = 0; i <= 180; i+= 0.5){ 
      //mapping 1024 elements in the waveform array to the width of the screen
      var index = floor(map(i, 0, width, 0, wave.length-1))

      var r = map(wave[index],-1, 1, 150, 350)
      var x = r * sin(i) *t
      var y = r * cos(i)  //waveform values of y and offset to middle of the screen
      //also the wave form value is between 0 and 1, hence we need to scale it to actually visualize the wave
      vertex(x,y)
      }
      endShape()
    }

  var p = new Particle()
  particles.push(p)
  
  //iterated backwards since the particles flicker sometimes when the elements are removed
  for(var i =particles.length -1; i>=0; i--){
   if(!particles[i].control()){
      particles[i].update(amp>230)
      particles[i].show()
    }else{
      particles.splice(i,1)
    }
  }
}


//plays/pauses the song when mouse is clicked
function mouseClicked(){
  if(song.isPlaying()){
    song.pause()
    noLoop()
  }
  else{
    song.play()
    loop()
  }
}

//particles
class Particle{
  constructor(){
    this.pos = p5.Vector.random2D().mult(250)
    this.vel = createVector(0,0)     //initial velocity is 0
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001))  //acceleration in the move of the particles at random acceleration
    this.w = random(2,5)

    this.color = [random(200,255), random(200,255), random(200,255)] 
  }

  //update position of the particles
  update(args){

    this.vel.add(this.acc)
    this.pos.add(this.vel)

    //powerful particles respond to the music and get faster
    if(args){
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }

  //boundary check control method
  control(){
    if(this.pos.x < -width/2 || this.pos.x > width/2 || this.pos.y < -height/2 || this.pos.y > height/2){
      return true
    }else{
    return false
    }
  }

  //draw function
  show(){
    noStroke()
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, this.w)
  }
}

