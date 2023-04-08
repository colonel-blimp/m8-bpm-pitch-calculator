import {describe, expect, test} from '@jest/globals';
import { DecimalToHex } from '../src/js/hex_dec_converters';

describe('DecimalToHex', () => {
  describe('round', () => {
    test('rounds positive numbers correctly', () => {
      expect(DecimalToHex.round(3.6)).toEqual(4);
      expect(DecimalToHex.round(3.4)).toEqual(3);
    });

    test('rounds negative numbers correctly', () => {
      expect(DecimalToHex.round(-3.6)).toEqual(-4);
      expect(DecimalToHex.round(-3.4)).toEqual(-3);
    });
  });

  describe('normal', () => {
    test('converts decimal to hex string correctly', () => {
      expect(DecimalToHex.normal(10)).toEqual('0A');
      expect(DecimalToHex.normal(255)).toEqual('FF');
    });
  });

  describe('pit', () => {
    test('returns correct hex string for valid inputs', () => {
      expect(DecimalToHex.pit(0)).toEqual('7F');
      expect(DecimalToHex.pit(-1)).toEqual('00');
      expect(DecimalToHex.pit(127)).toEqual('FF');
      expect(DecimalToHex.pit(-128)).toEqual('80');
    });

    test('returns error message for invalid inputs', () => {
      expect(DecimalToHex.pit(128)).toEqual(`Couldn't handle value: 128`);
      expect(DecimalToHex.pit(-129)).toEqual(`Couldn't handle value: -129`);
    });
  });

  describe('fin', () => {
    test('returns correct hex string for valid inputs', () => {
      expect(DecimalToHex.fin(0)).toEqual('7F');
      expect(DecimalToHex.fin(1)).toEqual('FF');
      expect(DecimalToHex.fin(-1)).toEqual('00');
    });

    test('returns error message for invalid inputs', () => {
      expect(DecimalToHex.fin(2)).toEqual(`Couldn't handle value`);
      expect(DecimalToHex.fin(-2)).toEqual(`Couldn't handle value`);
    });
  });

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

});
});
