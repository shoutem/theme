import _ from 'lodash';
import StyleNormalizer from './StyleNormalizer';

const styleNormalizer = new StyleNormalizer();

/**
 * Normalize style properties shorthands.
 *
 * @param style
 * @returns {*}
 */
function normalize(style) {
  return _.reduce(
    style,
    (normalizedStyle, val, prop) => {
      /* eslint-disable no-param-reassign */
      if (_.isPlainObject(val)) {
        normalizedStyle[prop] = normalize(val);
      } else if (styleNormalizer.canNormalize(prop)) {
        normalizedStyle = {
          ...normalizedStyle,
          ...styleNormalizer.normalize(prop, val),
        };
      } else {
        normalizedStyle[prop] = val;
      }
      /* eslint-enable no-param-reassign */

      return normalizedStyle;
    },
    {},
  );
}

export default function normalizeStyle(style) {
  if (_.isArray(style)) {
    return _.reduce(
      style,
      (normalizedStyle, val) => ({
        ...normalizedStyle,
        ...normalize(val),
      }),
      {},
    );
  }

  return normalize(style);
}
