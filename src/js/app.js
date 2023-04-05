

// Create a function to initialize the application
function initApp() {
  // Select the input elements
  const fromBpmInput = document.querySelector('#from-bpm');
  const toBpmInput = document.querySelector('#to-bpm');
  const displayBox = document.querySelector('#display-box');
  const displayBoxHex = document.querySelector('#display-box-hex');
  const displayBoxDetuneHex = document.querySelector('#display-box-detune-hex');



  const to_base16_80center = pitch_change => 128 + (Number(pitch_change) * 16)
  const dec2hex = d => Math.round(d).toString(16).padStart(2, '0').toUpperCase()
  const hex2dec = d => Number(d).parseInt(16)

  function bpm_to_pitch(old_bpm, new_bpm) {
    return(Math.log2(new_bpm/old_bpm)*12)
  }

  // Define the function to calculate semitone difference
  function convertBpmDiffToSemitones(fromBpm, toBpm) {
    const semitones = 12 * Math.log2(toBpm / fromBpm);
    return semitones.toFixed(2);
  }


  function dec2detuneHex(semitoneChange) {
    if(semitoneChange > 8 || semitoneChange < -8){
      return `*OOB:* ${+Number(semitoneChange).toFixed(2)}\n`
    } else {
      return dec2hex(to_base16_80center(semitoneChange))
    }
  }

  function onBpmInputChange() {
    if ((fromBpmInput.value > 0) && (toBpmInput.value == '')) {
      toBpmInput.value = fromBpmInput.value;
    } else if ((toBpmInput.value > 0) && (fromBpmInput == '')) {
      fromBpmInput.value = toBpmInput.value;
    };

    
    const semitoneChange = convertBpmDiffToSemitones(parseFloat(fromBpmInput.value), parseFloat(toBpmInput.value));
    displayBox.value =  semitoneChange;

    const hex_pitch_change = dec2hex(semitoneChange*16);
    displayBoxHex.value = hex_pitch_change;
    displayBoxDetuneHex.value = dec2detuneHex(semitoneChange);

    let debug_str = '';
    return debug_str;

  }

  // Add event listeners to the input elements
  fromBpmInput.addEventListener('input', onBpmInputChange);
  toBpmInput.addEventListener('input', onBpmInputChange);

  makeInputDraggable(fromBpmInput);
  makeInputDraggable(toBpmInput);

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
    
      // Calculate the distance moved by the touch
      let deltaY = this.touchStartY - event.touches[0].clientY;
    
      // Calculate the new value of the input based on the distance moved
      let newValue = this.startValue + (deltaY / 10);
    
      // Set the new value of the input
      this.value = newValue.toFixed(2);
    });
  
    input.addEventListener('touchend', onBpmInputChange);
  }
  

};




// Call the initApp function when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initApp();
});
