import _ from 'lodash';

const createShorthand = (name, type) => ({
  name,
  type: _.isUndefined(type) ? name : type,
});

export const SIDES = createShorthand('Sides', '');
export const CORNERS = createShorthand('Corners', '');
export const HORIZONTAL = createShorthand('Horizontal');
export const VERTICAL = createShorthand('Vertical');

export const LEFT = 'Left';
export const RIGHT = 'Right';
export const TOP = 'Top';
export const BOTTOM = 'Bottom';
export const TOP_RIGHT = 'TopRight';
export const BOTTOM_RIGHT = 'BottomRight';
export const TOP_LEFT = 'TopLeft';
export const BOTTOM_LEFT = 'BottomLeft';

// Shorthands normalizers creators.
// This creators provide standard normalizer used in most cases.
// When style property has any of this shorthands, use this creators
// to create shorthand normalizer.

function createAllSidesNormalizer(prop, shorthand, suffix = '') {
  return val => ({
    [prop + LEFT + suffix]: val,
    [prop + RIGHT + suffix]: val,
    [prop + TOP + suffix]: val,
    [prop + BOTTOM + suffix]: val,
  });
}

function createAllCornersNormalizer(prop, shorthand, suffix = '') {
  return val => ({
    [prop + BOTTOM_LEFT + suffix]: val,
    [prop + BOTTOM_RIGHT + suffix]: val,
    [prop + TOP_LEFT + suffix]: val,
    [prop + TOP_RIGHT + suffix]: val,
  });
}

function createHorizontalSidesNormalizer(prop) {
  return val => ({
    [prop + LEFT]: val,
    [prop + RIGHT]: val,
  });
}

function createVerticalSidesNormalizer(prop) {
  return val => ({
    [prop + TOP]: val,
    [prop + BOTTOM]: val,
  });
}

class ShorthandsNormalizerFactory {
  constructor() {
    this.createNormalizersMap = {
      [SIDES.name]: createAllSidesNormalizer,
      [CORNERS.name]: createAllCornersNormalizer,
      [HORIZONTAL.name]: createHorizontalSidesNormalizer,
      [VERTICAL.name]: createVerticalSidesNormalizer,
    };
  }

  getNormalizerCreator(shorthand) {
    return this.createNormalizersMap[shorthand.name];
  }

  createNormalizer(prop, shorthand, suffix) {
    const normalizerCreator = this.getNormalizerCreator(shorthand);

    return normalizerCreator(prop, shorthand, suffix);
  }
}

export default new ShorthandsNormalizerFactory();
