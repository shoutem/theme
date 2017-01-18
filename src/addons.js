import tinyColor from 'tinycolor2';
import { Dimensions } from 'react-native';
import _ from 'lodash';

const window = Dimensions.get('window');

function capitalizeFirstLetter(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Creates a set of style variations with the provided name
 * suffixes. This function is useful when creating style variations
 * for styles with shorthands, e.g., margin, padding, etc. This function
 * will return an object with the keys that represent the style variations,
 * and each key will have an object with the provided key and value. Both
 * style variation, and value object keys will get the provided suffixes. The
 * style variation key names are expected to be in snake-case, and value keys
 * are expected to be in camelCase.
 *
 * Example:
 * createVariations('large-margin', ['', 'left', 'right'], 'margin', 30)
 * will return:
 * {
 *   'large-margin': {
 *     margin: 30
 *   },
 *   'large-margin-left': {
 *     marginLeft: 30,
 *   },
 *   'large-margin-right': {
 *     marginRight: 30,
 *   }
 * }
 *
 * @param baseName Base name for style variation §names.
 * @param nameSuffixes Suffixes that will be concatenated to baseName.
 * @param key The value key name to use.
 * @param value The value that will be assigned to the key property.
 * @returns {object} An object with the generated style variants.
 */
export function createVariations(baseName, nameSuffixes, key, value) {
  return _.reduce(nameSuffixes, (result, variant) => {
    const variantName = variant ? `${baseName}-${variant}` : baseName;
    const keyName = variant ? `${key}${capitalizeFirstLetter(variant)}` : key;

    // eslint-disable-next-line no-param-reassign
    result[variantName] = {
      [keyName]: value,
    };

    return result;
  }, {});
}

/**
 * Creates a set of style rules for the provided components. This function
 * is useful when a set of components needs to have the same style. The
 * shared style will be applied to each component. It is also possible to
 * provide custom style for each component that will be applied on top of
 * the shared style.
 *
 * Example:
 * createSharedStyle(['shoutem.ui.Text', 'shoutem.ui.Title'], {
 *   color: 'white'
 * }, {
 *   'shoutem.ui.Title: {
 *     marginBottom: 15
 *   }
 * );
 * will return:
 * {
 *   'shoutem.ui.Text': {
 *     color: 'white'
 *   },
 *   'shoutem.ui.Title': {
 *     color: 'white',
 *     marginBottom: 15
 *   }
 * }
 *
 * @param componentNames The names of the components to generate styles for.
 * @param sharedStyle The style to apply to each component.
 * @param customStyles Style overrides by component names.
 * @returns {object} An object with the generated styles.
 */
export function createSharedStyle(componentNames, sharedStyle = {}, customStyles = {}) {
  return _.reduce(componentNames, (result, componentName) => {
    // eslint-disable-next-line no-param-reassign
    result[componentName] = {
      ...sharedStyle,
      ...customStyles[componentName],
    };

    return result;
  }, {});
}

/**
 * Change color alpha channel even if color wasn't original transparent.
 * @param color - rgba or hex
 * @param newAlpha
 * @returns {*}
 */
export function changeColorAlpha(color, newAlpha) {
  return tinyColor(color).setAlpha(newAlpha).toRgbString();
}

/**
 * Makes bright colors darker and dark colors brighter.
 * @param colorValue - rgba or hex
 * @param amount
 * @returns {string}
 */
export function inverseColorBrightnessForAmount(colorValue, amount) {
  const color = tinyColor(colorValue);
  if (color.isLight()) {
    return color.darken(amount).toString();
  }
  return color.lighten(amount).toString();
}

/**
 * Scale dimension to reference value by taking in consideration actual reference value.
 * For example, element should be 50px wide on screen wide 375px. If screen actual size is wider
 * then planned everything is going to be scaled up and vice versa.
 * @param dimension - wanted value for reference
 * @param originalRefVal - wanted value reference
 * @param actualRefVal - actual reference value
 * @returns {number}
 */
export function getSizeRelativeToReference(dimension, originalRefVal, actualRefVal) {
  return (dimension / originalRefVal) * actualRefVal;
}
