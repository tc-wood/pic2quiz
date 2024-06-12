import logo from './logo.svg';
import useEffect from 'react';
import './App.css';

function App() {
  useEffect(() => {
        // Access the device camera and stream video
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                var videoElement = document.getElementById('video');
                videoElement.srcObject = stream;
            })
            .catch(function(error) {
                console.error('Error accessing the camera:', error);
            });
            
        // Capture picture from the video stream
        var captureButton = document.getElementById('capture-btn');
        captureButton.addEventListener('click', function() {
            var videoElement = document.getElementById('video');
            var canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            var context = canvas.getContext('2d');
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            
            // Convert the captured picture to base64 data URL
            var imageDataUrl = canvas.toDataURL('image/jpeg');
            
            // Send the picture to the remote server for analysis
            // Replace 'http://example.com/analyze' with the actual server endpoint
            fetch('http://example.com/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image: imageDataUrl })
            })
            .then(function(response) {
                // Handle the response from the server
                console.log('Server response:', response);
            })
            .catch(function(error) {
                console.error('Error sending picture to the server:', error);
            });
        });

  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <video id="video" width="640" height="480" autoplay></video>
      <button id="capture-btn">Capture Picture</button>

    </div>
  );
}

export default App;
