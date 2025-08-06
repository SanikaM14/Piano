import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const PianoKey = ({ 
  note, 
  octave, 
  isBlack, 
  isActive, 
  onPress, 
  onRelease, 
  style 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const keyRef = useRef(null);
  
  // Handle mouse/touch start event
  const handlePointerDown = (e) => {
    e.preventDefault();
    if (!isPressed) {
      setIsPressed(true);
      onPress(note, octave);
    }
  };
  
  // Handle mouse/touch end event
  const handlePointerUp = (e) => {
    e.preventDefault();
    if (isPressed) {
      setIsPressed(false);
      onRelease();
    }
  };
  
  // Handle mouse leave event (in case the mouse leaves the key while pressed)
  const handlePointerLeave = (e) => {
    if (isPressed) {
      setIsPressed(false);
      onRelease();
    }
  };
  
  // Handle keyboard focus
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isPressed) {
      e.preventDefault();
      setIsPressed(true);
      onPress(note, octave);
    }
  };
  
  const handleKeyUp = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && isPressed) {
      e.preventDefault();
      setIsPressed(false);
      onRelease();
    }
  };
  
  // Clean up event listeners
  useEffect(() => {
    const keyElement = keyRef.current;
    
    const handleGlobalPointerUp = () => {
      if (isPressed) {
        setIsPressed(false);
        onRelease();
      }
    };
    
    // Add global pointer up event to handle the case when the mouse is released outside the key
    document.addEventListener('pointerup', handleGlobalPointerUp);
    
    return () => {
      document.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [isPressed, onRelease]);
  
  // Determine the class names based on the key type and state
  const keyClasses = [
    'piano-key',
    isBlack ? 'black-key' : 'white-key',
    (isPressed || isActive) ? 'active' : ''
  ].filter(Boolean).join(' ');
  
  // Determine the label to show on the key (only for C notes)
  const showLabel = note.endsWith('C') && !isBlack;
  
  // Determine the display name for the note (without the octave for black keys)
  const displayName = isBlack ? note.replace(/#/g, '♯') : note;
  
  return (
    <div
      ref={keyRef}
      className={keyClasses}
      style={style}
      role="button"
      aria-label={`${note}${octave} key`}
      tabIndex="0"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      {showLabel && (
        <div className="key-label">
          <span className="note-name">{displayName}</span>
          <span className="octave-number">{octave}</span>
        </div>
      )}
      {isBlack && (
        <span className="black-key-label" aria-hidden="true">
          {displayName}
        </span>
      )}
    </div>
  );
};

PianoKey.propTypes = {
  note: PropTypes.string.isRequired,
  octave: PropTypes.number.isRequired,
  isBlack: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  onRelease: PropTypes.func.isRequired,
  style: PropTypes.object
};

PianoKey.defaultProps = {
  style: {}
};

export default PianoKey;
