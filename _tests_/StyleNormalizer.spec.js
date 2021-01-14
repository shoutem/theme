import StyleNormalizer from '../src/StyleNormalizer/StyleNormalizer';
import {
  SIDES,
  CORNERS,
  HORIZONTAL,
  VERTICAL,
} from '../src/StyleNormalizer/ShorthandsNormalizerFactory';

describe('StyleNormalizer', () => {
  describe('shorthand normalizers creation', () => {
    it('creates proper sides normalizers', () => {
      const styleNormalizer = new StyleNormalizer();
      styleNormalizer.createNormalizers('test', [SIDES]);

      expect(styleNormalizer.normalizers.test).toBeTruthy();
    });
    it('creates proper horizontal normalizers', () => {
      const styleNormalizer = new StyleNormalizer();
      styleNormalizer.createNormalizers('test', [HORIZONTAL]);

      expect(styleNormalizer.normalizers.testHorizontal).toBeTruthy();
    });
    it('creates proper vertical normalizers', () => {
      const styleNormalizer = new StyleNormalizer();
      styleNormalizer.createNormalizers('test', [VERTICAL]);

      expect(styleNormalizer.normalizers.testVertical).toBeTruthy();
    });
    it('creates proper horizontal normalizers', () => {
      const styleNormalizer = new StyleNormalizer();
      styleNormalizer.createNormalizers('test', [CORNERS]);

      expect(styleNormalizer.normalizers.test).toBeTruthy();
    });
    it('creates multiple normalizers', () => {
      const styleNormalizer = new StyleNormalizer();
      styleNormalizer.createNormalizers('test', [SIDES, HORIZONTAL, VERTICAL]);

      expect(styleNormalizer.normalizers.test).toBeTruthy();
      expect(styleNormalizer.normalizers.testHorizontal).toBeTruthy();
      expect(styleNormalizer.normalizers.testVertical).toBeTruthy();
    });
    it('throws error if normalizer for shorthand already exists', () => {
      const styleNormalizer = new StyleNormalizer();
      expect(() => {
        styleNormalizer.createNormalizers('test', [SIDES, CORNERS]);
      }).toThrow();
    });
  });
  describe('normalizers creation with suffix', () => {
    it('creates proper normalizers with suffix', () => {
      const styleNormalizer = new StyleNormalizer();
      styleNormalizer.createNormalizers('test', [SIDES], 'Suffix');

      expect(styleNormalizer.normalizers.testSuffix).toBeTruthy();
    });
    it('creates proper normalizers with suffix', () => {
      const styleNormalizer = new StyleNormalizer();
      styleNormalizer.createNormalizers('test', [SIDES, VERTICAL], 'Suffix');

      expect(styleNormalizer.normalizers.testSuffix).toBeTruthy();
      expect(styleNormalizer.normalizers.testVerticalSuffix).toBeTruthy();
    });
  });
});
