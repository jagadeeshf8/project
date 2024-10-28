let bodyPose;
let video;
let poses = [];
let connections;
let specs;

function preload() {
  // Load the bodyPose model with a callback to confirm loading
  bodyPose = ml5.bodyPose(modelLoaded);
  specs = loadImage('images/spects.png'); // Load specs image in preload
}

function setup() {
  createCanvas(640, 480);

  // Capture webcam video
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
}

function modelLoaded() {
  console.log("BodyPose model has loaded");

  // Start detecting poses in the video
  bodyPose.detectStart(video, gotPoses);

  // Get skeleton connection information
  connections = bodyPose.getSkeleton();
}

// Callback for when the model returns pose data
function gotPoses(results) {
  poses = results; // Store detected poses in the global variable
}


function draw() {

    image(video, 0, 0, width, height);
    if (poses.length > 0) {
        let pose = poses[0];
    
        // Get left and right eye positions
        let leftEye = pose.left_eye;  // Assuming left eye is at index 1
        let rightEye = pose.right_eye; // Assuming right eye is at index 2
    
        // Ensure both eye keypoints are defined and have confidence > 0.1
        if (leftEye.confidence > 0.1 && rightEye.confidence > 0.1) {
          let eyeDistance = dist(leftEye.x, leftEye.y, rightEye.x, rightEye.y);
    
          // Set the size of the specs based on the eye distance
          let specsWidth = eyeDistance * 2; // You can adjust this multiplier to change size scaling
          let specsHeight = specsWidth * (120 / 200); // Maintain aspect ratio (120 is original height, 200 is original width)
    
          // Draw specs image at the right eye position
          image(specs, (rightEye.x - specsWidth / 2) + 50, (rightEye.y - specsHeight / 2)+5, specsWidth+10, specsHeight);
        }
    
        console.log(poses);
      }
  
    // Draw skeleton connections and keypoints if poses are detected
    console.log("Current poses:", poses); // Log current poses to check their structure
    for (let i = 0; i < poses.length; i++) {
      let pose = poses[i];
  
      // Draw skeleton connections
      for (let j = 0; j < connections.length; j++) {
        let pointAIndex = connections[j][0];
        let pointBIndex = connections[j][1];
        let pointA = pose.keypoints[pointAIndex];
        let pointB = pose.keypoints[pointBIndex];
  
        // Only draw if both points have confidence > 0.1
        if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
          stroke(0, 0, 255);
          strokeWeight(2);
          line(pointA.x, pointA.y, pointB.x, pointB.y);
        }
      }
  
      // Draw keypoints
      for (let j = 0; j < pose.keypoints.length; j++) {
        let keypoint = pose.keypoints[j];
  
        // Only draw if the keypoint's confidence is greater than 0.1
        if (keypoint.confidence > 0.1) {
            fill(255,255,255)
          noStroke();
          circle(keypoint.x, keypoint.y, 10);
        }
      }
    }
  }