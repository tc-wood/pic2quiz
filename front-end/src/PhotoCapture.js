import React, { useRef, useEffect, useState } from 'react';

const PhotoCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState('');

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

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      const dataUrl = canvasRef.current.toDataURL('image/png');
      setPhoto(dataUrl);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Take a Photo of Your Notes</h1>
      <video ref={videoRef} width="640" height="480" autoPlay style={{ border: '1px solid black' }}></video>
      <button onClick={capturePhoto} style={{ margin: '10px' }}>Capture Photo</button>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      {photo && <img src={photo} alt="Captured" style={{ border: '1px solid black', marginTop: '10px' }} />}
    </div>
  );
};

export default PhotoCapture;