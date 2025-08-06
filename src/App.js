// App.js
import React, { useState, useEffect } from 'react';
import Piano from './components/Piano';
import Controls from './components/Controls';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import './assets/css/styles.css';

function App({ audioContext }) {
  const [octave, setOctave] = useState(4);
  const [volume, setVolume] = useState(0.7);
  const [waveType, setWaveType] = useState('sine');
  const [sustain, setSustain] = useState(false);
  const [activeNotes, setActiveNotes] = useState(new Set());
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Handle audio context initialization
  useEffect(() => {
    if (audioContext && !audioInitialized) {
      console.log('AudioContext available in App:', audioContext.state);
      setAudioInitialized(true);
    }
  }, [audioContext, audioInitialized]);

  // Update volume when it changes
  useEffect(() => {
    if (audioContext && audioContext.gainNode) {
      console.log('Updating volume to:', volume);
      audioContext.gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    }
  }, [volume, audioContext]);

  const handleKeyPress = (note, frequency) => {
    setActiveNotes(prev => new Set(prev).add(note));
  };

  const handleKeyRelease = (note) => {
    setActiveNotes(prev => {
      const newNotes = new Set(prev);
      newNotes.delete(note);
      return newNotes;
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="text-center my-4">🎹 Harmony Keys</h1>
      </header>
      
      <main className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <Piano 
              octave={octave}
              volume={volume}
              waveType={waveType}
              sustain={sustain}
              onKeyPress={handleKeyPress}
              onKeyRelease={handleKeyRelease}
              activeNotes={activeNotes}
              audioContext={audioContext}
            />
            
            <Controls
              octave={octave}
              setOctave={setOctave}
              volume={volume}
              setVolume={setVolume}
              waveType={waveType}
              setWaveType={setWaveType}
              sustain={sustain}
              setSustain={setSustain}
              showShortcuts={showShortcuts}
              setShowShortcuts={setShowShortcuts}
            />
          </div>
        </div>
      </main>
      
      <footer className="text-center text-muted mt-4 mb-3">
        <small>Use your keyboard (A-L for white keys, W, E, T, Y, U for black keys) or click/tap the keys</small>
      </footer>
      
      {showShortcuts && <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />}
    </div>
  );
}

export default App;