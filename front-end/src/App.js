import React, { useRef, useEffect, useState } from 'react';

const App = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera: ', err);
      }
    };

    startCamera();
  }, []);

  const capturePhoto = async () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      const dataUrl = canvasRef.current.toDataURL('image/png');
      const options = {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          fileAsString: dataUrl
        }
      }
      console.log(options.body.fileAsString)
      const response = await fetch("http://localhost:5050/gen", options)
      const data = await response.json()
      console.log(data)
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Doc2Quiz</h1>
      <video ref={videoRef} width="640" height="480" autoPlay style={{ border: '1px solid black' }}></video>
      <button onClick={capturePhoto} style={{ margin: '10px' }}>Capture Photo</button>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default App;