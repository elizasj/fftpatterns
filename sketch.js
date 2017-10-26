// https://github.com/therewasaguy/p5-music-viz/blob/master/demos/05a_fft_particle_system/sketch.js
// https://www.youtube.com/watch?v=2O3nm0Nvbi4

var song, fft
var smoothing = 0.8
var binCount = 1024

function toggleSong() {
  if (song.isPlaying()) {
    song.pause()
  } else {
    song.play()
  }
}

function preload() {
  song = loadSound('song1.mp3')

}

function setup() {
  createCanvas(1000, 1000)

  colorMode(HSB, 360, 100, 100, 1)
  rectMode(CENTER)

  button = createButton('toggle')
  button.mousePressed(toggleSong)
  song.play()

  fft = new p5.FFT(smoothing, binCount)

  frameRate(60)
}

function draw() {
  background(168, 0, 96);

  // analyze amplitude values along the whole frequency domain
  var spectrum = fft.analyze()

  //grab low levels
  var lowLvls = fft.getEnergy("bass", "lowMid")
  var low = map(lowLvls, 0, 255, 0, 5)

  // grab med levels
  var medLvls = fft.getEnergy("lowMid", "mid")
  var med = map(medLvls, 0, 255, 0, 25)
  var colorMap = map(medLvls, 0, 255, 26, 59)

  // grab high levels
  var highLvls = fft.getEnergy("highMid", "treble")
  var high = map(highLvls, 0, 255, 2, 25)
  var high2 = map(highLvls, 0, 255, 2, 100)

  // create shapes grid
  for (var x = 200; x <= width - 100; x += 200) {
    for (var y = 200; y <= height - 100; y += 200) {
      
      
      push();
      translate(x, y)
      rotate(radians(round(lowLvls)))
      translate(-x, -y)
      
      //magenta rect
      noFill();
      stroke(332, 100, 100, 0.5);
      strokeWeight(round(med))
      rect(x, y, round(medLvls), round(medLvls))
      pop()

      //grey ellipse
      noStroke()
      fill(58, 5, 83, 0.5)
      ellipse(x, y, round(lowLvls), round(lowLvls))
      
      //yellow ellipse
      noFill()
      strokeWeight(round(high2*smoothing))
      stroke(colorMap, 93, 100, 0.5)
      ellipse(x, y, round(medLvls / 2), round(medLvls / 2))

      push()
      translate(x, y)
      rotate(radians(round(highLvls)))
      translate(-x, -y)
      
      //turquoise
      noFill()
      strokeWeight(round(high))
      stroke(168, 80, 90, 0.5);
      rect(x, y, round(lowLvls), round(lowLvls))
      pop()

    }
  }
}