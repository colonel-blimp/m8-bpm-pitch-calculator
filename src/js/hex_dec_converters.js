
class DecimalToHex {
    static round(v) {
      return Math.sign(v) * Math.round(Math.abs(v));
    }
  
    static normal(decimal) {
      return decimal.toString(16).padStart(2, '0').toUpperCase();
    }
  
    static pit(decimal) {
      if (decimal > -0.5 && decimal <= 127) {
        return DecimalToHex.round(decimal).toString(16).padStart(2, '0').toUpperCase();
      } else if (decimal >= -128 && decimal <= -0.5) {
        return ((DecimalToHex.round(decimal) + 256).toString(16).padStart(2, '0').toUpperCase());
      } else {
        return (`Couldn't handle value: ${decimal}`);
      }
    }
  
    static fin(decimal) {
      decimal=Number(decimal)
      if (decimal >= 0 && decimal <= 1) {
        return DecimalToHex.round(decimal * 127).toString(16).padStart(2, '0').toUpperCase();;
      } else if (decimal >= -1 && decimal < 0) {
        let v = DecimalToHex.round(
          Math.min(
            (decimal + 1) * 128
            ,127 // fix for [<0 .. -0.0039], which round to 128
          )
        ) + 128;
        
        return (v.toString(16).padStart(2, '0').toUpperCase());
      } else {
        return ("Couldn't handle value");
      }
    }
  
    static detune(decimal) {
      if (decimal >= 0 && decimal <= 8) {
        return (DecimalToHex.round((decimal/8) * 128) + 127 ).toString(16).padStart(2, '0').toUpperCase();
      } else if (decimal >= -8 && decimal < 0) {
        return (DecimalToHex.round((decimal/8 + 1) * 128)  ).toString(16).padStart(2, '0').toUpperCase();
      } else {
        return (`Couldn't handle value: ${decimal}`);
      }
    }
  
    static remainder(decimal) {
      const pitHex = DecimalToHex.pit(decimal);
  
      const pitDecimal = hexToDecimal.pit(pitHex);
      let decimalDiff = decimal - pitDecimal;
      if( decimalDiff < -1 ){
        decimalDiff = (decimal + 256) - pitDecimal
      }
      console.log(`remainder: (decimal: ${decimal} pitHex: ${pitHex}  pitDecimal: ${pitDecimal}  decimal - pitDecimal: ${decimalDiff}   DecimalToHex.fin(${decimalDiff}): ${DecimalToHex.fin(decimalDiff)} `)
  
      return DecimalToHex.fin(decimalDiff);
    }
  }
  
  
  
  const hexToDecimal = {
    // handle -0.5 rounding as expected
    round: v => Math.sign(v) * Math.round(Math.abs(v)),
  
    normal: function(hex) {
      return parseInt(hex, 16);
    },
    pit: function(hex) {
      hexToDecimal.fail_if_not_hex(hex)
      const decimal = parseInt(hex, 16);
      if (decimal >= 0 && decimal <= 127) {
        return hexToDecimal.round(decimal);
      } else if (decimal >= 128 && decimal <= 255) {
        return hexToDecimal.round(decimal - 255) - 1;
      } else {
        return NaN;
      }
    },
  
    fin: function(hex) {
      hexToDecimal.fail_if_not_hex(hex)
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
      hexToDecimal.fail_if_not_hex(hex)
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
  
  export { DecimalToHex };