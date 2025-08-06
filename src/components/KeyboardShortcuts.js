import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const KeyboardShortcuts = ({ onClose }) => {
  // Handle keyboard events to close the modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Keyboard mapping for the virtual piano
  const keyMappings = [
    {
      key: 'A - L',
      description: 'White keys (C to B)'
    },
    {
      key: 'W, E',
      description: 'Black keys C♯, D♯'
    },
    {
      key: 'T, Y, U',
      description: 'Black keys F♯, G♯, A♯'
    },
    {
      key: 'O, P, [',
      description: 'Black keys C♯, D♯, F♯ (next octave)'
    },
    {
      key: 'Z, X',
      description: 'Decrease/Increase octave'
    },
    {
      key: 'S',
      description: 'Toggle sustain pedal'
    },
    {
      key: '1-4',
      description: 'Change wave type (Sine, Square, Sawtooth, Triangle)'
    },
    {
      key: 'Arrow Up/Down',
      description: 'Increase/Decrease volume'
    },
    {
      key: '?',
      description: 'Show/hide this help'
    }
  ];

  return (
    <div className="keyboard-shortcuts-modal">
      <div 
        className="modal-backdrop show" 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1040
        }}
      ></div>
      
      <div 
        className="modal show d-block" 
        tabIndex="-1"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1050,
          width: '90%',
          maxWidth: '600px'
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <i className="fas fa-keyboard me-2"></i>
                Keyboard Shortcuts
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keyMappings.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <kbd className="bg-secondary">
                            {item.key.split(',').map((key, i) => (
                              <React.Fragment key={i}>
                                {i > 0 && ', '}
                                {key.trim()}
                              </React.Fragment>
                            ))}
                          </kbd>
                        </td>
                        <td>{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="alert alert-info mb-0">
                <i className="fas fa-info-circle me-2"></i>
                You can also use your mouse or touch screen to play the piano.
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={onClose}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

KeyboardShortcuts.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default KeyboardShortcuts;
