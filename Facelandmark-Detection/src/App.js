// Import dependencies
import React, { useRef } from "react";
import "./App.css";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./meshUtilities.js";

// Define App function
function App() {
  const webcamReference = useRef(null);
  const canvasReference = useRef(null);

  // Load facemesh model
  const loadFacemesh = async () => {
    const network = await facemesh.load({
      inputResolution: { width: 720, height: 500 },
      scale: 0.8
    });
    setInterval(() => {
      detectFace(network);
    }, 100);
  };

  // Check if webcam is up and running
  const detectFace = async (network) => {
    if (
      typeof webcamReference.current !== "undefined" &&
      webcamReference.current !== null &&
      webcamReference.current.video.readyState === 4
    ) {
      // Get video properties
      const video = webcamReference.current.video;
      const videoWidth = webcamReference.current.video.videoWidth;
      const videoHeight = webcamReference.current.video.videoHeight;

      // Set video width & height
      webcamReference.current.video.width = videoWidth;
      webcamReference.current.video.height = videoHeight;

      // Set canvas width & height
      canvasReference.current.width = videoWidth;
      canvasReference.current.height = videoHeight;

      // Make face detection estimate
      const faceEstimate = await network.estimateFaces(video);
      console.log(faceEstimate);

      // Get canvas context
      const ctx = canvasReference.current.getContext("2d");
      drawMesh(faceEstimate, ctx);
    }
  };

  // Call loadFacemesh()
  loadFacemesh();

  return (
    <div className="App">
      <Webcam
        ref={webcamReference}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 720,
          height: 500
        }}
      />

      <canvas
        ref={canvasReference}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 720,
          height: 500
        }}
      />
    </div>
  );
}

export default App;
