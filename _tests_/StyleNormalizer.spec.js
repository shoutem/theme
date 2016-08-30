import { assert } from 'chai';
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

      assert.isOk(styleNormalizer.normalizers.test, 'normalizer not created');
    });
    it('creates proper horizontal normalizers', () => {
      const styleNormalizer = new StyleNormalizer();
      styleNormalizer.createNormalizers('test', [HORIZONTAL]);

      assert.isOk(styleNormalizer.normalizers.testHorizontal, 'normalizer not created');
    });
    it('creates proper vertical normalizers', () => {
      const styleNormalizer = new StyleNormalizer();
      styleNormalizer.createNormalizers('test', [VERTICAL]);

      assert.isOk(styleNormalizer.normalizers.testVertical, 'normalizer not created');
    });
    it('creates proper horizontal normalizers', () => {
      const styleNormalizer = new StyleNormalizer();
      styleNormalizer.createNormalizers('test', [CORNERS]);

      assert.isOk(styleNormalizer.normalizers.test, 'normalizer not created');
    });
    it('creates multiple normalizers', () => {
      const styleNormalizer = new StyleNormalizer();
      styleNormalizer.createNormalizers('test', [SIDES, HORIZONTAL, VERTICAL]);

      assert.isOk(styleNormalizer.normalizers.test, 'normalizer not created');
      assert.isOk(styleNormalizer.normalizers.testHorizontal, 'normalizer not created');
      assert.isOk(styleNormalizer.normalizers.testVertical, 'normalizer not created');
    });
    it('throws error if normalizer for shorthand already exists', () => {
      const styleNormalizer = new StyleNormalizer();
      assert.throws(() => {
        styleNormalizer.createNormalizers('test', [SIDES, CORNERS]);
      }, 'Normalizer for \'test\' shorthand already exists');
    });
  });
  describe('normalizers creation with suffix', () => {
    it('creates proper normalizers with suffix', () => {
      const styleNormalizer = new StyleNormalizer();
      styleNormalizer.createNormalizers('test', [SIDES], 'Suffix');

      assert.isOk(styleNormalizer.normalizers.testSuffix, 'normalizer not created');
    });
    it('creates proper normalizers with suffix', () => {
      const styleNormalizer = new StyleNormalizer();
      styleNormalizer.createNormalizers('test', [SIDES, VERTICAL], 'Suffix');

      assert.isOk(styleNormalizer.normalizers.testSuffix, 'normalizer not created');
      assert.isOk(styleNormalizer.normalizers.testVerticalSuffix, 'normalizer not created');
    });
  });
});
