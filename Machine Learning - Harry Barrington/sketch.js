let video;
let label = "waiting...";
let confidence = 0.0;
let classifier;
let modelURL = 'https://teachablemachine.withgoogle.com/models/N4Ab3mENb/';
let handImg;
let personImg;
let bgImg;
let startButtonImg;
let ignoreButtonImg;
let deleteButtonImg;
let logoutButtonImg;
let guidelinesButtonImg;
let guidelinesImg;
let backButtonImg; // New back button image
let state = 'start';

function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');
  handImg = loadImage("hand.png");
  personImg = loadImage("person.png");
  bgImg = loadImage("gamebg.png");
  startButtonImg = loadImage("start.png");
  ignoreButtonImg = loadImage("ignore.png");
  deleteButtonImg = loadImage("delete.png");
  logoutButtonImg = loadImage("logout.png");
  guidelinesButtonImg = loadImage("codeconduct.png");
  guidelinesImg = loadImage("codeconductbg.png");
  backButtonImg = loadImage("back.png"); // Load the back button image
}

function setup() {
  createCanvas(640, 520);
  video = createCapture(VIDEO);
  video.hide();
  classifyVideo();
}

function draw() {
  if (state === 'start') {
    drawStartScreen();
  } else if (state === 'play') {
    drawWebcam();
  } else if (state === 'guidelines') {
    drawGuidelinesScreen();
  }
}

function drawStartScreen() {
  background(bgImg);
  image(startButtonImg, width / 2 - 50, height / 2 - 25, 100, 50);
  image(guidelinesButtonImg, width / 2 - 50, height / 2 + 35, 100, 50); // Draw the guidelines button
}

function drawWebcam() {
  background(0);
  image(video, 0, 0, width, 480);

  if (label == "ignore" && confidence > 0.9) {
    image(ignoreButtonImg, 0, 0, width, height);
  } else if (label == "delete" && confidence > 0.9) {
    image(deleteButtonImg, 0, 0, width, height);
  } else if (label == "nothing") {
    // Don't display any image
  }
  
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);
  text(label + " " + confidence, width / 2, height - 16);

  // Draw the buttons
  image(ignoreButtonImg, 50, height - 70, 100, 50);
  image(deleteButtonImg, width - 150, height - 70, 100, 50);
  image(logoutButtonImg, 10, 10, 100, 50); // Draw the logout button at the top left
}

function drawGuidelinesScreen() {
  background(255);
  image(guidelinesImg, 0, 0, width, height); // Draw the community guidelines image
  image(backButtonImg, width - 110, 10, 100, 50); // Draw the back button at the top right
}

function mousePressed() {
  if (state === 'start') {
    if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 - 25 && mouseY < height / 2 + 25) {
      state = 'play';
    } else if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 35 && mouseY < height / 2 + 85) {
      state = 'guidelines';
    }
  } else if (state === 'play') {
    if (mouseX > 50 && mouseX < 150 && mouseY > height - 70 && mouseY < height - 20) {
      // Ignore button pressed
      console.log('ignore button pressed');
    } else if (mouseX > width - 150 && mouseX < width - 50 && mouseY > height - 70 && mouseY < height - 20) {
      // Delete button pressed
      console.log('delete button pressed');
    } else if (mouseX > 10 && mouseX < 110 && mouseY > 10 && mouseY < 60) {
      // Logout button pressed
      alert("You're fired");
    }
  } else if (state === 'guidelines') {
    if (mouseX > width - 110 && mouseX < width - 10 && mouseY > 10 && mouseY < 60) {
      // Back button pressed
      state = 'start';
    }
  }
}

// STEP 2: Do the classifying
function classifyVideo() {
  classifier.classify(video, gotResults);
}

// STEP 3: Get the classification
function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  // Store the label and classify again
  label = results[0].label;
  confidence = nf(results[0].confidence, 0, 2);
  classifyVideo();
}
