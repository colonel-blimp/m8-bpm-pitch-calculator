import {describe, expect, test} from '@jest/globals';
import { DecimalToHex } from '../src/js/hex_dec_converters';


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
    // for( let i=1; i >-1.1; i-=0.01 ){
    //   process.stdout.write(`DecimalToHex.pit(${i}): ${DecimalToHex.pit}`)
    //   i = i.toFixed(2);
    //   test.todo(`DecimalToHex.fin(${i}): ${DecimalToHex.fin(i)}`);
    // }    
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
  
  /*
  describe('detune', () => {
    test('returns correct hex string for valid inputs', () => {
      expect(DecimalToHex.detune(0)).toEqual('7F');
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
      expect(DecimalToHex.remainder(0)).toEqual('7F');
      expect(DecimalToHex.remainder(1.5)).toEqual('FF');
      expect(DecimalToHex.remainder(-1.5)).toEqual('00');
    });

    test('handles negative decimal values correctly', () => {
      expect(DecimalToHex.remainder(-2.5)).toEqual('7F');
      expect(DecimalToHex.remainder(-3.5)).toEqual('FE');
      expect(DecimalToHex.remainder(-4.5)).toEqual('FD');
    });

    test('returns an error message for values outside the valid range', () => {
      expect(DecimalToHex.remainder(-200)).toEqual(`Couldn't handle value: -200`);
      expect(DecimalToHex.remainder(200)).toEqual(`Couldn't handle value: 200`);
    });

    test('returns the correct remainder for positive decimal values', () => {
      expect(DecimalToHex.remainder(40)).toEqual('20');
    });

    test('returns the correct remainder for negative decimal values', () => {
      expect(DecimalToHex.remainder(-40)).toEqual('60');
    });

});*/
});
