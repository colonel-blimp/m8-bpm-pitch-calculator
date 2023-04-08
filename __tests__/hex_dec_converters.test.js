import {describe, expect, test} from '@jest/globals';
import { DecimalToHex } from '../src/js/hex_dec_converters';
import { HexToDecimal } from '../src/js/hex_dec_converters';


describe('DecimalToHex', () => {
  describe('round', () => {
    test('rounds positive numbers correctly', () => {
      expect(DecimalToHex.round(1.2)).toEqual(1);
      expect(DecimalToHex.round(0.5)).toEqual(1);
      expect(DecimalToHex.round(0.51)).toEqual(1);
      expect(DecimalToHex.round(0.49)).toEqual(0);
      expect(DecimalToHex.round(0)).toEqual(0);
    });

    test('rounds negative numbers correctly', () => {
      expect(DecimalToHex.round(-0.49)).toEqual(-0);
      expect(DecimalToHex.round(-0.5)).toEqual(-1);
      expect(DecimalToHex.round(-0.52)).toEqual(-1);
      expect(DecimalToHex.round(-3.6)).toEqual(-4);
      expect(DecimalToHex.round(-3.4)).toEqual(-3);
    });
  });

  describe('normal', () => {
    test('converts decimal to hex string correctly', () => {
      expect(DecimalToHex.normal(0)).toEqual('00');
      expect(DecimalToHex.normal(10)).toEqual('0A');
      expect(DecimalToHex.normal(128)).toEqual('80');
      expect(DecimalToHex.normal(255)).toEqual('FF');
    });
  });

  describe('pit', () => {
    test('returns correct PIT hex string for valid inputs', () => {
      expect(DecimalToHex.pit(0)).toEqual('00');
      expect(DecimalToHex.pit(1)).toEqual('01');
      expect(DecimalToHex.pit(-1)).toEqual('FF');
      expect(DecimalToHex.pit(127)).toEqual('7F');
      expect(DecimalToHex.pit(-128)).toEqual('80');
      expect(DecimalToHex.pit(-49)).toEqual('CF');
      expect(DecimalToHex.pit(64)).toEqual('40');
    });

    test('returns error message for invalid inputs', () => {
      expect(DecimalToHex.pit(128)).toEqual(`Couldn't handle value: 128`);
      expect(DecimalToHex.pit(-129)).toEqual(`Couldn't handle value: -129`);
    });
  });

  describe('fin', () => {

    describe.skip('output entire range of fin values', () => {
      for( let i=1; i >-1.1; i-=0.01 ){
        process.stdout.write(`DecimalToHex.pit(${i}): ${DecimalToHex.pit}`)
        i = i.toFixed(2);
        test.todo(`DecimalToHex.fin(${i}): ${DecimalToHex.fin(i)}`);
      }
    })
    test('returns correct hex string for valid inputs (0+)', () => {
      expect(DecimalToHex.fin(0)).toEqual('00');
      expect(DecimalToHex.fin(1)).toEqual('7F');  // -127; probably slightly incorrect
      expect(DecimalToHex.fin( 0.5)).toEqual('40');
      expect(DecimalToHex.fin(0.008)).toEqual('01');
    });

    test('returns correct hex string for valid inputs (tiny -0.*)', () => {
      expect(DecimalToHex.fin(-0.0039)).toEqual('FF');
      expect(DecimalToHex.fin(-0.0001)).toEqual('FF');
      expect(DecimalToHex.fin(-0.01)).toEqual('FF');
    });
    test('returns correct hex string for valid inputs', () => {
      expect(DecimalToHex.fin(-0.02)).toEqual('FD');
    });
    test('returns correct hex string for valid inputs', () => {
      expect(DecimalToHex.fin(-1.00)).toEqual('80');
      expect(DecimalToHex.fin(-0.88)).toEqual('8F');
      expect(DecimalToHex.fin( -0.5)).toEqual('C0');
    });


    test('returns error message for invalid inputs', () => {
      expect(DecimalToHex.fin(2)).toEqual(`Couldn't handle value`);
      expect(DecimalToHex.fin(-2)).toEqual(`Couldn't handle value`);
    });
  });


  describe('detune', () => {
    test('returns correct hex string for valid inputs', () => {
      expect(DecimalToHex.detune(0)).toEqual('80');
      expect(DecimalToHex.detune(8)).toEqual('FF');
      expect(DecimalToHex.detune(-8)).toEqual('00');
    });

    test('returns error message for invalid inputs', () => {
      expect(DecimalToHex.detune(9)).toEqual(`Couldn't handle value: 9`);
      expect(DecimalToHex.detune(-9)).toEqual(`Couldn't handle value: -9`);
    });
  });

  describe('remainder', () => {
    test('returns correct hex string for valid inputs', () => {
    });


    test('returns same values as FIN,when PIT is 00', () => {
      [0,0.15,-0.15,0.4,-0.4].forEach( (i) => {
        expect(DecimalToHex.remainder(i)).toEqual(DecimalToHex.fin(i));
      });
    });

    test('handles negative decimal values correctly', () => {
      expect(DecimalToHex.remainder(-0.01)).toEqual('FF');
      expect(DecimalToHex.remainder(-0.15)).toEqual('ED');


    });

});
});


describe('HexToDecimal', () => {
  describe('pit', () => {
    test('returns correct PIT hex string for valid inputs', () => {
      expect(HexToDecimal.pit('00')).toEqual(0);
      expect(HexToDecimal.pit('FF')).toEqual(-1);
      expect(HexToDecimal.pit('7F')).toEqual(127);
      expect(HexToDecimal.pit('80')).toEqual(-128);
      expect(HexToDecimal.pit('CF')).toEqual(-49);
      expect(HexToDecimal.pit('40')).toEqual(64);
    });

    test.skip('returns error message for invalid inputs', () => {
      expect(HexToDecimal.pit(128)).toEqual(`Couldn't handle value: 128`);
      expect(HexToDecimal.pit(-129)).toEqual(`Couldn't handle value: -129`);
    });
  });


});
