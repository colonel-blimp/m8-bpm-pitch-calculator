import { DecimalToHex } from './hex_dec_converters.js';

export const bpm_to_pitch = (old_bpm, new_bpm) => Math.log2(new_bpm/old_bpm)*12

// Create a function to initialize the application
export function initApp() {
  // Select the input elements
  const fromBpmInput = document.querySelector('#from-bpm');
  const toBpmInput = document.querySelector('#to-bpm');
  const displayBox = document.querySelector('#display-box');
  const semitoneDiffFull = document.querySelector('#semitones-full-fraction');
  const displayBoxPitHex = document.querySelector('#display-box-pit-hex');
  const displayBoxFinHex = document.querySelector('#display-box-fin-hex');
  const displayBoxPitFinHex = document.querySelector('#display-box-pit-fin-hex'); 
  const displayBoxDetuneHex = document.querySelector('#display-box-detune-hex');
  
  // Add event listeners to the input elements
  fromBpmInput.addEventListener('input', onBpmInputChange);
  toBpmInput.addEventListener('input', onBpmInputChange);
  
  makeInputDraggable(fromBpmInput);
  makeInputDraggable(toBpmInput);


  function onBpmInputChange() {
    function runWithinRange( fnnn, v, min, max, na_fn=(v)=>{'N/A'}) {
      return (v > max || v < min) ? 'N/A' : fnnn(v);
    }
  
    // if one of the inputs is blank, make it the same as the other
    // TODO: UX of this didn't turn out too great; see if there's a better way
    //   starting at 60, so it doesn't match after typing the `1` in `120`
    if ((fromBpmInput.value > 60) && (toBpmInput.value == '')) {
      toBpmInput.value = fromBpmInput.value;
    } else if ((toBpmInput.value > 60) && (fromBpmInput == '')) {
      fromBpmInput.value = toBpmInput.value;
    };
    
    const semitoneChange = bpm_to_pitch(parseFloat(fromBpmInput.value), parseFloat(toBpmInput.value));

    // if the semitone change is less than 1, show 2 decimal places
    const mantissaDigits = semitoneChange > -1 && semitoneChange < 1 ? 2 : 1 


    function dec2fin(semitoneChange) {
      return runWithinRange((DecimalToHex.fin), semitoneChange, -1, 1)
    }

    semitoneDiffFull.value = semitoneChange // hidden input to keep full precision value
    displayBox.value = semitoneChange.toFixed(mantissaDigits); // friendlier display value
    displayBoxDetuneHex.value = runWithinRange((DecimalToHex.detune), semitoneChange, -8, 8);
    displayBoxPitHex.value = DecimalToHex.pit(semitoneChange);
    displayBoxPitFinHex.value = DecimalToHex.remainder(semitoneChange);
    displayBoxFinHex.value = dec2fin(semitoneChange);

    [displayBoxDetuneHex, displayBoxPitHex, displayBoxPitFinHex, displayBoxFinHex].forEach(function(el) {
      if( /^[0-9A-Fa-f.]+$/.test( el.value ) ) {
        el.classList.remove('invalid-value');
      } else {
        el.classList.add('invalid-value');
      } 
    });
  }

  
  function makeInputDraggable(input){
    input.addEventListener('touchstart', function(event) {
      // Store the starting y-coordinate of the touch
      this.touchStartY = event.touches[0].clientY;    
      // Store the current value of the input
      this.startValue = parseFloat(this.value) || 0;
    });
    
    input.addEventListener('touchmove', function(event) {
      // Disable scrolling behavior
      event.preventDefault();
    
      // Calculate the distance moved by the touchdisplayBoxFinHex
      let deltaY = this.touchStartY - event.touches[0].clientY;
    
      // Calculate the new value of the input based on the distance moved
      let newValue = this.startValue + (deltaY / 10);  
      newValue = newValue < 1 ? 1 : newValue;
  
      // If someone added a more precise fraction, keep that level of precision
      const str_mant = this.value.toString().split('.')[1]
      const mantissaDigits = str_mant ? str_mant.length : 0;
      
      // Set the new value of the input
      this.value = newValue.toFixed(mantissaDigits);
    });
  
    input.addEventListener('touchend', onBpmInputChange);
  }  

};


// Call the initApp function when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initApp();
});
