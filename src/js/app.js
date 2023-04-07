const to_base16_80center = pitch_change => 128 + (Number(pitch_change) * 16)
const to_base16_7Fdown = pitch_change => 256 + (Number(pitch_change) )
const dec2hex = d => Math.round(d).toString(16).padStart(2, '0').slice(-2).toUpperCase()
const hex2dec = h => parseInt(h, 16)
const bpm_to_pitch = (old_bpm, new_bpm) => Math.log2(new_bpm/old_bpm)*12


const decimalToHex = {
  normal: function(decimal) {
    return decimal.toString(16).padStart(2, '0');
  },
  pit: function(decimal) {
    if (decimal >= 0 && decimal <= 127) {
      return Math.round(decimal).toString(16).padStart(2, '0').toUpperCase();
    } else if (decimal >= -128 && decimal < 0) {
      return (Math.round(decimal + 255.5).toString(16).padStart(2, '0').toUpperCase());
    } else {
      return (`Couldn't handle value: ${decimal}`);
    }
  },

  fin: function(decimal) {
    if (decimal >= 0 && decimal <= 1) {
      return Math.round(decimal * 127).toString(16).padStart(2, '0').toUpperCase();;
    } else if (decimal >= -1 && decimal < 0) {
      return (Math.round((decimal + 1) * 127) + 128).toString(16).padStart(2, '0').toUpperCase();;
    } else {
      return ("Couldn't handle value");
    }
  },

  detune: function(decimal) {
    if (decimal >= 0 && decimal <= 8) {
      return (Math.round((decimal/8) * 128) + 127 ).toString(16).padStart(2, '0').toUpperCase();
    } else if (decimal >= -8 && decimal < 0) {
      return (Math.round((decimal/8 + 1) * 128)  ).toString(16).padStart(2, '0').toUpperCase();
    } else {
      return (`Couldn't handle value: ${decimal}`);
    }
  },

  remainder: function(decimal) {
    const pitHex = this.pit(decimal);
    const pitDecimal = hexToDecimal.pit(pitHex);
    let decimalDiff = decimal - pitDecimal;
    if( decimalDiff < 0 ){
      decimalDiff = (decimal += 256) - pitDecimal
    }
    console.log(`remainder: (decimal: ${decimal} pitHex: ${pitHex}  pitDecimal: ${pitDecimal}  decimal - pitDecimal: ${decimalDiff} `)

    return this.fin(decimalDiff);
  }
};





const hexToDecimal = {
  normal: function(hex) {
    return parseInt(hex, 16);
  },
  pit: function(hex) {
    this.fail_if_not_hex(hex)
    const decimal = parseInt(hex, 16);
    if (decimal >= 0 && decimal <= 127) {
      return Math.round(decimal);
    } else if (decimal >= 128 && decimal <= 255) {
      return Math.round(decimal - 255) - 1;
    } else {
      return NaN;
    }
  },

  fin: function(hex) {
    this.fail_if_not_hex(hex)
    let decimal = parseInt(hex, 16);
    if (decimal >= 0 && decimal <= 127) {
      return (decimal / 127).toFixed(2);
    } else if (decimal >= 128 && decimal <= 255) {
      return ((decimal - 128) / 127).toFixed(2) - 1;
    } else {
      return "Couldn't handle value";
    }
  },

  
  detune: function(hex) {
    this.fail_if_not_hex(hex)
    const decimal = parseInt(hex, 16);
    if (decimal >= 127 && decimal <= 255) {
      return  (((decimal - 127) / 128) * 8)
    } else if (decimal >= 0 && decimal < 127) {
      // not sure why the -0.0625 is needed here, but it is
      return ((((decimal - 127) / 128) * 8)  + -0.0625 )
    } else {
      return (`Couldn't handle value: ${hex}`);
    }  
  },

  fail_if_not_hex(hex) {
    if (hex.length != 2) {
      throw new Error(`hex value must be 2 characters long, got ${hex}`)
    }
    if (hex.match(/[^0-9A-Fa-f]/)) {
      throw new Error(`hex value must be 2 characters long, got ${hex}`)
    }
  }
};



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
  
  // Add event listeners to the input elements
  fromBpmInput.addEventListener('input', onBpmInputChange);
  toBpmInput.addEventListener('input', onBpmInputChange);
  
  makeInputDraggable(fromBpmInput);
  makeInputDraggable(toBpmInput);

  
  function dec2detuneHex(semitoneChange) {
    if(semitoneChange > 8 || semitoneChange < -8){
      return 'N/A'
    } else {
      return decimalToHex.detune(semitoneChange)
    }
  }

  function dec2finHex(semitoneChange) {

    if(semitoneChange > 1 || semitoneChange < -1){
      return 'N/A'
    } else {
      return(decimalToHex.fin(semitoneChange))
    }
  }

  function dec2pitHex(semitoneChange) {
    return(decimalToHex.pit(semitoneChange))
  }

  function dec2pitFinHex(semitoneChange) {
    let v = decimalToHex.remainder(semitoneChange)
    
    return(v)
  } 

  function onBpmInputChange() {
    // if one of the inputs is blank, make it the same as the other
    // TODO: UX of this didn't turn out too great; see if there's a better way
    //   starting at 60, so it doesn't match after typing the `1` in `120`
    if ((fromBpmInput.value > 60) && (toBpmInput.value == '')) {
      toBpmInput.value = fromBpmInput.value;
    } else if ((toBpmInput.value > 60) && (fromBpmInput == '')) {
      fromBpmInput.value = toBpmInput.value;
    };
    
    const semitoneChange = bpm_to_pitch(parseFloat(fromBpmInput.value), parseFloat(toBpmInput.value));
    const pitHexValue = dec2pitHex(semitoneChange);
    const pitFinHexValue = dec2pitFinHex(semitoneChange);

    // if the semitone change is less than 1, show 2 decimal places
    mantissaDigits = semitoneChange > -1 && semitoneChange < 1 ? 2 : 1 

    semitoneDiffFull.value = semitoneChange // hidden input to keep full precision value
    displayBox.value = semitoneChange.toFixed(mantissaDigits); // friendlier display value
    displayBoxDetuneHex.value = dec2detuneHex(semitoneChange);
    displayBoxPitHex.value = pitHexValue;
    displayBoxPitFinHex.value = pitFinHexValue
    displayBoxFinHex.value = dec2finHex(semitoneChange);

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
    
      // Calculate the distance moved by the touch
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
