import React from 'react';
import PropTypes from 'prop-types';

const Controls = ({
  octave,
  setOctave,
  volume,
  setVolume,
  waveType,
  setWaveType,
  sustain,
  setSustain,
  showShortcuts,
  setShowShortcuts
}) => {
  const waveTypes = [
    { value: 'sine', label: 'Sine' },
    { value: 'square', label: 'Square' },
    { value: 'sawtooth', label: 'Sawtooth' },
    { value: 'triangle', label: 'Triangle' }
  ];

  // Format the volume value for display (0-100)
  const volumePercent = Math.round(volume * 100);

  return (
    <div className="controls mt-4">
      <div className="row g-3">
        {/* Octave Control */}
        <div className="col-12 col-md-4">
          <div className="control-group">
            <label htmlFor="octave-control" className="form-label">
              Octave: <span className="badge bg-primary">{octave}</span>
            </label>
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-outline-secondary btn-sm me-2"
                onClick={() => setOctave(prev => Math.max(0, prev - 1))}
                disabled={octave <= 0}
                aria-label="Decrease octave"
              >
                <i className="fas fa-minus"></i>
              </button>
              <input
                type="range"
                className="form-range flex-grow-1"
                id="octave-control"
                min="0"
                max="8"
                value={octave}
                onChange={(e) => setOctave(parseInt(e.target.value, 10))}
              />
              <button 
                className="btn btn-outline-secondary btn-sm ms-2"
                onClick={() => setOctave(prev => Math.min(8, prev + 1))}
                disabled={octave >= 8}
                aria-label="Increase octave"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Volume Control */}
        <div className="col-12 col-md-4">
          <div className="control-group">
            <label htmlFor="volume-control" className="form-label">
              Volume: <span className="badge bg-primary">{volumePercent}%</span>
            </label>
            <div className="d-flex align-items-center">
              <i className="fas fa-volume-off me-2"></i>
              <input
                type="range"
                className="form-range flex-grow-1"
                id="volume-control"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                aria-label="Volume control"
              />
              <i className="fas fa-volume-up ms-2"></i>
            </div>
          </div>
        </div>

        {/* Wave Type Selector */}
        <div className="col-12 col-md-4">
          <div className="control-group">
            <label htmlFor="wave-type" className="form-label">
              Wave Type
            </label>
            <select
              id="wave-type"
              className="form-select"
              value={waveType}
              onChange={(e) => setWaveType(e.target.value)}
              aria-label="Select wave type"
            >
              {waveTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            {/* Sustain Pedal Toggle */}
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="sustain-pedal"
                checked={sustain}
                onChange={(e) => setSustain(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="sustain-pedal">
                <i className="fas fa-music me-1"></i> Sustain Pedal
              </label>
            </div>

            {/* Keyboard Shortcuts Button */}
            <button
              className="btn btn-outline-info btn-sm"
              onClick={() => setShowShortcuts(!showShortcuts)}
              aria-expanded={showShortcuts}
              aria-controls="keyboard-shortcuts"
            >
              <i className="fas fa-keyboard me-1"></i>
              {showShortcuts ? 'Hide' : 'Show'} Keyboard Shortcuts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Controls.propTypes = {
  octave: PropTypes.number.isRequired,
  setOctave: PropTypes.func.isRequired,
  volume: PropTypes.number.isRequired,
  setVolume: PropTypes.func.isRequired,
  waveType: PropTypes.string.isRequired,
  setWaveType: PropTypes.func.isRequired,
  sustain: PropTypes.bool.isRequired,
  setSustain: PropTypes.func.isRequired,
  showShortcuts: PropTypes.bool.isRequired,
  setShowShortcuts: PropTypes.func.isRequired
};

export default Controls;
