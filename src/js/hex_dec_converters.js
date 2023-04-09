
class DecimalToHex {
    static round(v) {
      //return Math.sign(v) * Math.round(Math.abs(v));
      return Number(v.toFixed(0)) // rounds _away_ from zero
    }

    // 
    static limitPrecision(v,precision=3) {
      const factor = 10 ** precision;
      return Math.trunc(v * 10000) / 10000;
    }

    static normal(decimal) {
      return decimal.toString(16).padStart(2, '0').toUpperCase();
    }

    static pit(decimal) {
      decimal=DecimalToHex.limitPrecision(decimal)
      if (decimal > -0.5 && decimal <= 127) {
        return DecimalToHex.round(decimal).toString(16).padStart(2, '0').toUpperCase();
      } else if (decimal >= -128 && decimal <= -0.5) {
        return ((DecimalToHex.round(decimal) + 256).toString(16).padStart(2, '0').toUpperCase());
      } else {
        return (`Couldn't handle value: ${decimal}`);
      }
    }

    static fin(decimal) {
      decimal=DecimalToHex.limitPrecision(Number(decimal))
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
      decimal=DecimalToHex.limitPrecision(decimal)
      let n = null;
      if (decimal >= 0 && decimal <= 8) {
        n = DecimalToHex.round(
          Math.max((decimal / 8) * 128, 0.50)
        ) + 127
      } else if (decimal >= -8 && decimal < 0) {
        n = DecimalToHex.round((decimal/8 + 1) * 128)
      }

      if (n != null){
        return n.toString(16).padStart(2, '0').toUpperCase();
      } else {
        return (`Couldn't handle value: ${decimal}`);
      }
    }

    static remainder(decimal) {
      decimal=DecimalToHex.limitPrecision(decimal)
      const pitHex = DecimalToHex.pit(decimal);
      const pitDecimal = HexToDecimal.pit(pitHex);
      const decimalDiff = decimal - pitDecimal;
      //console.log(`remainder 1: (decimal: ${decimal} pitHex: ${pitHex}  pitDecimal: ${pitDecimal}  decimal - pitDecimal: ${decimalDiff}   DecimalToHex.fin(${decimalDiff}): ${DecimalToHex.fin(decimalDiff)} `)

      return DecimalToHex.fin(decimalDiff);
    }
  }


  class HexToDecimal {
    static round(v) {
      //return Math.sign(v) * Math.round(Math.abs(v));
      return Number(v.toFixed(0)) // rounds _away_ from zero
    }

    static normal(hex) {
      return parseInt(hex, 16);
    }

    static pit(hex) {
      HexToDecimal.fail_if_not_hex(hex);
      const decimal = parseInt(hex, 16);
      if (decimal >= 0 && decimal <= 127) {
        return HexToDecimal.round(decimal);
      } else if (decimal >= 128 && decimal <= 255) {
        return HexToDecimal.round(decimal - 255) - 1;
      } else {
        return NaN;
      }
    }

  /*
    static fin(hex) {
      HexToDecimal.fail_if_not_hex(hex);
      let decimal = parseInt(hex, 16);
      if (decimal >= 0 && decimal <= 127) {
        return (decimal / 127).toFixed(2);
      } else if (decimal >= 128 && decimal <= 255) {
        return ((decimal - 128) / 127).toFixed(2) - 1;
      } else {
        return "Couldn't handle value";
      }
    }

    static detune(hex) {
      HexToDecimal.fail_if_not_hex(hex);
      const decimal = parseInt(hex, 16);
      if (decimal >= 127 && decimal <= 255) {
        return (((decimal - 127) / 128) * 8);
      } else if (decimal >= 0 && decimal < 127) {
        return ((((decimal - 127) / 128) * 8) + -0.0625);
      } else {
        return (`Couldn't handle value: ${hex}`);
      }
    }
  */
    static fail_if_not_hex(hex) {
      if (hex.length != 2) {
        throw new Error(`hex value must be 2 characters long, got ${hex}`);
      }
      if (hex.match(/[^0-9A-Fa-f]/)) {
        throw new Error(`hex value must be 0-9 or A-F, got ${hex}`);
      }
    }
}


  export { DecimalToHex, HexToDecimal};
