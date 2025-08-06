// Piano.js
import React, { useCallback, useEffect } from 'react';
import PianoKey from './PianoKey';

// Notes in an octave
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_KEYS = ['C#', 'D#', 'F#', 'G#', 'A#'];

// Keyboard mapping for computer keyboard to piano keys
const KEY_MAP = {
  // First row (white keys)
  'a': 'C', 's': 'D', 'd': 'E', 'f': 'F', 'g': 'G', 'h': 'A', 'j': 'B',
  'k': 'C', 'l': 'D', ';': 'E', "'": 'F',
  // Second row (black keys)
  'w': 'C#', 'e': 'D#', 't': 'F#', 'y': 'G#', 'u': 'A#',
  'o': 'C#', 'p': 'D#', '[': 'F#'
};

const Piano = ({ 
  octave, 
  volume, 
  waveType, 
  sustain, 
  onKeyPress, 
  onKeyRelease, 
  activeNotes, 
  audioContext 
}) => {
  // Calculate frequency for a given note and octave
  const getNoteFrequency = useCallback((note, octave) => {
    // A4 is 440Hz
    const A4 = 440;
    const noteIndex = NOTES.indexOf(note);
    const A4Index = 9; // A is the 10th note (0-indexed)
    const distance = (octave - 4) * 12 + (noteIndex - A4Index);
    return A4 * Math.pow(2, distance / 12);
  }, []);

  // Play a note
  const playNote = useCallback((note, octave) => {
    console.log(`Attempting to play note: ${note}${octave}`);
    
    if (!audioContext) {
      console.warn('Audio context not ready');
      return () => {}; // Return empty cleanup function
    }
    
    console.log('AudioContext state:', audioContext.state);
    
    // Ensure audio context is running
    if (audioContext.state === 'suspended') {
      console.log('AudioContext is suspended, attempting to resume...');
      audioContext.resume()
        .then(() => console.log('AudioContext resumed successfully'))
        .catch(e => console.error('Failed to resume AudioContext:', e));
    }
    
    const frequency = getNoteFrequency(note, octave);
    console.log(`Playing ${note}${octave} at ${frequency.toFixed(2)}Hz`);
    
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Set oscillator type and frequency
      oscillator.type = waveType;
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      
      // Configure gain for the note
      gainNode.gain.setValueAtTime(0.001, audioContext.currentTime); // Start from near silence to avoid clicks
      gainNode.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + 0.05); // Quick fade in
      
      if (!sustain) {
        // If sustain is off, add a release
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
      }
      
      // Connect nodes - FIX: Connect to the main gain node
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.gainNode || audioContext.destination);
      
      console.log('Audio nodes connected, starting oscillator...');
      
      // Start the oscillator
      const now = audioContext.currentTime;
      oscillator.start(now);
      
      // Call the onKeyPress callback with note and frequency
      onKeyPress(`${note}${octave}`, frequency);
      
      // Return cleanup function
      return () => {
        try {
          console.log(`Releasing note: ${note}${octave}`);
          // Quick fade out to avoid clicks
          const releaseTime = 0.1;
          gainNode.gain.cancelScheduledValues(now);
          gainNode.gain.setValueAtTime(gainNode.gain.value, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + releaseTime);
          
          // Stop the oscillator after fade out
          oscillator.stop(now + releaseTime);
          
          // Disconnect nodes after they're done
          setTimeout(() => {
            try {
              oscillator.disconnect();
              gainNode.disconnect();
              console.log('Audio nodes disconnected');
            } catch (e) {
              console.warn('Error cleaning up audio nodes:', e);
            }
          }, (releaseTime + 0.1) * 1000);
          
          // Call the onKeyRelease callback
          onKeyRelease(`${note}${octave}`);
        } catch (e) {
          console.warn('Error in note cleanup:', e);
        }
      };
    } catch (e) {
      console.error('Error creating audio nodes:', e);
      return () => {}; // Return empty cleanup function
    }
  }, [audioContext, getNoteFrequency, onKeyPress, onKeyRelease, sustain, volume, waveType]);

  // Handle keyboard events
  useEffect(() => {
    const activeOscillators = {};
    
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (KEY_MAP[key] && !activeOscillators[key]) {
        const note = KEY_MAP[key];
        const releaseNote = playNote(note, octave);
        if (releaseNote) {
          activeOscillators[key] = releaseNote;
        }
      }
    };
    
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (KEY_MAP[key] && activeOscillators[key]) {
        activeOscillators[key]();
        delete activeOscillators[key];
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      // Clean up any active oscillators
      Object.values(activeOscillators).forEach(release => release());
    };
  }, [octave, playNote]);

  // Render piano keys
  const renderKeys = () => {
    const keys = [];
    let whiteKeyIndex = 0;
    
    // Create 7 octaves of keys
    for (let i = 0; i < 7; i++) {
      // White keys
      for (let j = 0; j < WHITE_KEYS.length; j++) {
        const note = WHITE_KEYS[j];
        const noteWithOctave = `${note}${octave + i}`;
        const isActive = activeNotes.has(noteWithOctave);
        
        keys.push(
          <PianoKey
            key={`white-${i}-${j}`}
            note={note}
            octave={octave + i} // FIX: Use correct octave
            isBlack={false}
            isActive={isActive}
            onPress={playNote}
            onRelease={() => onKeyRelease(noteWithOctave)}
            style={{
              left: `${whiteKeyIndex * 40}px`,
              zIndex: 1
            }}
          />
        );
        
        // Add black keys where applicable
        if (j < WHITE_KEYS.length - 1 && note !== 'E' && note !== 'B') {
          const blackNote = `${note}#`;
          const blackNoteWithOctave = `${blackNote}${octave + i}`;
          const isBlackActive = activeNotes.has(blackNoteWithOctave);
          
          keys.push(
            <PianoKey
              key={`black-${i}-${j}`}
              note={blackNote}
              octave={octave + i} // FIX: Use correct octave
              isBlack={true}
              isActive={isBlackActive}
              onPress={playNote}
              onRelease={() => onKeyRelease(blackNoteWithOctave)}
              style={{
                left: `${whiteKeyIndex * 40 + 30}px`,
                zIndex: 2
              }}
            />
          );
        }
        
        whiteKeyIndex++;
      }
    }
    
    return keys;
  };

  return (
    <div className="piano-container">
      <div className="piano">
        {renderKeys()}
      </div>
    </div>
  );
};

export default Piano;