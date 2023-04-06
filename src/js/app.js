const to_base16_80center = pitch_change => 128 + (Number(pitch_change) * 16)
const to_base16_7Fdown = pitch_change => 256 + (Number(pitch_change) )
const dec2hex = d => Math.round(d).toString(16).padStart(2, '0').slice(-2).toUpperCase()
const hex2dec = h => parseInt(h, 16)
const bpm_to_pitch = (old_bpm, new_bpm) => Math.log2(new_bpm/old_bpm)*12

// Create a function to initialize the application
function initApp() {
  // Select the input elements
  const fromBpmInput = document.querySelector('#from-bpm');
  const toBpmInput = document.querySelector('#to-bpm');
  const displayBox = document.querySelector('#display-box');
  const semitoneDiffFull = document.querySelector('#semitones-full-fraction');
  const displayBoxPitHex = document.querySelector('#display-box-pit-hex');
  const displayBoxFinHex = document.querySelector('#display-box-fin-hex');
  const displayBoxPitFinHex = document.querySelector('#display-box-pit-fin-hex'); 
  const displayBoxDetuneHex = document.querySelector('#display-box-detune-hex');
  
  
  function dec2detuneHex(semitoneChange) {
    if(semitoneChange > 8 || semitoneChange < -8){
      return `*OOB:* ${+Number(semitoneChange).toFixed(2)}\n`
    } else {
      return dec2hex(to_base16_80center(semitoneChange))
    }
  }

  function dec2finHex(semitoneChange) {
    if(semitoneChange > 1 || semitoneChange < -1){
      return `*OOB:* ${+Number(semitoneChange).toFixed(2)}\n`
    } else {

      tickRate = semitoneChange > 0 ? 127 : 128
      const st2finTicks = semitoneChange * tickRate  // 127 max -128 min
  
      return dec2hex(to_base16_7Fdown(st2finTicks))
    }
  }

  function dec2pitHex(semitoneChange) {
    let stc =  semitoneChange

    if (semitoneChange < 0){
      stc = to_base16_7Fdown(semitoneChange)
    }
    return(dec2hex(stc));
  }

  function dec2pitFinHex(semitoneChange, pitHexValue) {
    let pit =  hex2dec(pitHexValue)


    if ( semitoneChange < -1){
      pit = pit -256
    } 

    if( pitHexValue == 'FF' )
      pit = -1


    let pd = semitoneChange - pit


    console.log(`pit: (${pitHexValue})  ${pit}  semitoneChange: ${semitoneChange} pd: ${pd}  `)
    let v = dec2finHex(pd)
    
    
    return(v)
  } 

  function onBpmInputChange() {

    // if one input is blank, make it the same as the other
    if ((fromBpmInput.value > 0) && (toBpmInput.value == '')) {
      toBpmInput.value = fromBpmInput.value;
    } else if ((toBpmInput.value > 0) && (fromBpmInput == '')) {
      fromBpmInput.value = toBpmInput.value;
    };
    
    const semitoneChange = bpm_to_pitch(parseFloat(fromBpmInput.value), parseFloat(toBpmInput.value));

    semitoneDiffFull.value = semitoneChange

    const pitHexValue = dec2pitHex(semitoneChange);


    const pitFinHexValue = dec2pitFinHex(semitoneChange, pitHexValue);


    mantissaDigits = semitoneChange > -1 && semitoneChange < 1 ? 2 : 1 
    displayBox.value = semitoneChange.toFixed(mantissaDigits);
    displayBoxPitHex.value = pitHexValue;
    displayBoxDetuneHex.value = dec2detuneHex(semitoneChange);
    displayBoxFinHex.value = dec2finHex(semitoneChange);
    displayBoxPitFinHex.value = pitFinHexValue

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
    
      if( newValue < 1 ) {
        newValue = 1;
      } 


      
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
