import ShorthandsNormalizerFactory, {
  SIDES,
  HORIZONTAL,
  VERTICAL,
} from './ShorthandsNormalizerFactory';

/**
 * Style Normalizer uses ShorthandsNormalizerCreators to creates different normalizers
 * specific to properties.
 */
export default class StyleNormalizer {
  constructor() {
    this.normalizers = {};
    this.createNormalizers('margin', [HORIZONTAL, VERTICAL, SIDES]);
    this.createNormalizers('padding', [HORIZONTAL, VERTICAL, SIDES]);
    this.createNormalizers('border', [SIDES], 'Width');
  }

  createNormalizers(prop, shorthands, suffix = '') {
    shorthands.forEach(shorthand => {
      const propName = prop + shorthand.type + suffix;

      if (this.normalizerExists(propName)) {
        throw Error(`Normalizer for '${propName}' shorthand already exists`);
      }

      this.normalizers[propName] =
        ShorthandsNormalizerFactory.createNormalizer(prop, shorthand, suffix);
    });
  }

  normalizerExists(normalizerName) {
    return !!this.normalizers[normalizerName];
  }

  canNormalize(prop) {
    return this.normalizerExists(prop);
  }

  normalize(prop, val) {
    return this.normalizers[prop](val);
  }
}
