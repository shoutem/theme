import _ from 'lodash';

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
