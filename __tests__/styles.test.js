import { jest, describe, it, expect } from '@jest/globals';
import { StyleSheet } from 'react-native';
import Styles from '../app/stylesheets/styles';
import { COLORS } from '../constants/COLORS';

describe('Styles', () => {
  describe('Structure', () => {
    it('exports a valid StyleSheet object', () => {
      expect(Styles).toBeDefined();
      expect(typeof Styles).toBe('object');
      expect(Object.keys(Styles).length).toBeGreaterThan(0);
    });

    it('contains all required style objects', () => {
      const requiredStyles = ['button', 'buttonText', 'container', 'title'];
      requiredStyles.forEach(style => {
        expect(Styles).toHaveProperty(style);
      });
    });
  });

  describe('Button Styles', () => {
    it('has correct button styling', () => {
      expect(Styles.button).toEqual(
        expect.objectContaining({
          alignItems: 'center',
          backgroundColor: COLORS.primary,
          borderRadius: 5,
          elevation: 0,
          justifyContent: 'center',
          marginTop: 20,
          minHeight: 50,
          paddingHorizontal: 20,
          paddingVertical: 10,
          zIndex: 1
        })
      );
    });

    it('has correct button text styling', () => {
      expect(Styles.buttonText).toEqual(
        expect.objectContaining({
          color: COLORS.white,
          fontFamily: 'Arial',
          fontSize: 16,
          textAlign: 'center'
        })
      );
    });
  });

  describe('Container Styles', () => {
    it('has correct container styling', () => {
      expect(Styles.container).toEqual(
        expect.objectContaining({
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          minWidth: '90%',
          maxWidth: '90%'
        })
      );
    });
  });

  describe('Typography Styles', () => {
    it('has correct title styling', () => {
      expect(Styles.title).toEqual(
        expect.objectContaining({
          fontSize: 24,
          marginBottom: 20,
          textAlign: 'center'
        })
      );
    });
  });

  describe('Color Usage', () => {
    it('uses correct colors from COLORS constants', () => {
      expect(Styles.button.backgroundColor).toBe(COLORS.primary);
      expect(Styles.buttonText.color).toBe(COLORS.white);
    });
  });

  describe('Responsive Values', () => {
    it('uses relative units for typography', () => {
      // Font sizes should be numbers for React Native to handle scaling
      expect(typeof Styles.buttonText.fontSize).toBe('number');
      expect(typeof Styles.title.fontSize).toBe('number');
    });

    it('uses flexible layout properties', () => {
      expect(Styles.container.flex).toBe(1);
      expect(Styles.container.alignItems).toBe('center');
      expect(Styles.container.justifyContent).toBe('center');
    });
  });

  describe('Accessibility', () => {
    it('has sufficient touch target sizes', () => {
      // Following Material Design guidelines for touch targets
      expect(Styles.button.minHeight).toBeGreaterThanOrEqual(48);
      expect(Styles.button.paddingVertical).toBeGreaterThanOrEqual(10);
    });
  });
}); 