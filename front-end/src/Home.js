import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [systemMessage, setSystemMessage] = useState("");
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });
  const navigate = useNavigate();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {
          facingMode: { ideal: "environment"},
          audio: false,
        }});
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          const videoTrack = stream.getVideoTracks()[0];
          const settings = videoTrack.getSettings();
          setVideoDimensions({
            width: settings.width || 640,
            height: settings.height || 480,
          });
        }
      } catch (err) {
        console.error('Error accessing camera: ', err);
      }
    };

    startCamera();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (videoRef.current) {
        const aspectRatio = videoDimensions.width / videoDimensions.height;
        const maxVideoHeight = window.innerHeight * 0.6; // 60% of the window height
        const videoHeight = Math.min(maxVideoHeight, videoDimensions.height);
        const videoWidth = videoHeight * aspectRatio;
        setVideoDimensions({ width: videoWidth, height: videoHeight });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set the size based on the initial window size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [videoDimensions.width, videoDimensions.height]);

  const capturePhoto = async () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.7);
      const textOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fileAsString: dataUrl })
      }
      setSystemMessage("Loading...");
      setLoading(true);
      const textResponse = await fetch("http://localhost:5050/gen", textOptions);
      const textToQuizzify = await textResponse.json();
      if(!textToQuizzify.result || textToQuizzify.result.length === 0){
        setSystemMessage("An error occurred. Please ensure that there is any text in your image.");
        setLoading(false);
        return;
      }
      const quizOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ input: textToQuizzify.result })
      }
      const quizResponse = await fetch("http://localhost:5050/openai", quizOptions);
      const quiz = await quizResponse.json();
      console.log(quiz)
      setLoading(false);
      setSystemMessage("");
      navigate('/quiz', { state: quiz.response });
    }
  };

  return (
    <div className="window">
      <h1>Doc<font style={{color: '#04AA6D'}}>2</font>Quiz</h1>
      <p>Take a photo of your notes and it'll make a quiz!</p>
      <video ref={videoRef} width={videoDimensions.width} height={videoDimensions.height} autoPlay style={{ border: '3px solid white', borderRadius: '15px', maxWidth: '100%', maxHeight: '60vh' }}></video>
      {!loading && <button onClick={capturePhoto} className='capture-button'>Capture Photo</button>}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      {systemMessage && <p>{systemMessage}</p>}
    </div>
  );
};

export default Home;
