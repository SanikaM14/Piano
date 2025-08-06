import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './assets/css/styles.css';
import App from './App';

// Create a single audio context when the app loads
let audioContext = null;

// Function to initialize audio context
const initAudioContext = () => {
  if (!audioContext) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
      
      // Create a gain node for volume control
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.7; // Default volume
      gainNode.connect(audioContext.destination);
      
      // Store the gain node on the context for easy access
      audioContext.gainNode = gainNode;
      
      console.log('AudioContext created successfully');
      return audioContext;
    } catch (e) {
      console.error('Error initializing AudioContext:', e);
      return null;
    }
  }
  return audioContext;
};

// Initialize the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Create a wrapper component to handle audio context initialization
const AudioProvider = ({ children }) => {
  const [ctx, setCtx] = React.useState(null);
  
  // Initialize audio context on first interaction
  const handleInteraction = React.useCallback(() => {
    if (!ctx) {
      const newCtx = initAudioContext();
      if (newCtx && newCtx.state === 'suspended') {
        newCtx.resume().then(() => {
          console.log('AudioContext resumed successfully');
          setCtx(newCtx);
        }).catch(e => {
          console.error('Failed to resume AudioContext:', e);
        });
      } else {
        setCtx(newCtx);
      }
    }
  }, [ctx]);
  
  // Set up event listeners for first interaction
  React.useEffect(() => {
    if (!ctx) {
      const events = ['click', 'keydown', 'touchstart'];
      events.forEach(event => {
        document.addEventListener(event, handleInteraction, { once: true });
      });
      
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleInteraction);
        });
      };
    }
  }, [ctx, handleInteraction]);
  
  return React.cloneElement(children, { audioContext: ctx });
};

root.render(
  <React.StrictMode>
    <AudioProvider>
      <App audioContext={audioContext} initAudioContext={initAudioContext} />
    </AudioProvider>
  </React.StrictMode>
);
