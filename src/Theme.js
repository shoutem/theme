import { PropTypes } from 'react';
import resolveIncludes from './resolveIncludes';
import mergeComponentAndThemeStyles from './mergeComponentAndThemeStyles';
import normalizeStyle from './StyleNormalizer/normalizeStyle';

// Privates, ideally those should be symbols
const THEME_STYLE = '@@shoutem.theme/themeStyle';
const THEME_STYLE_CACHE = '@@shoutem.theme/themeCachedStyle';

let defaultTheme;

const resolveStyle = (style, baseStyle) => normalizeStyle(resolveIncludes(style, baseStyle));

/**
 * The theme defines the application style, and provides methods to
 * resolve the style for a specific component.
 *
 * A theme style is a JavaScript object that contains the
 * React Native style rules, with several additional features:
 * 1. Style rules may be nested arbitrarily
 * 2. Top level keys may target specific components by using their fully qualified name
 * 3. INCLUDE keyword may be used to include any top level style key rules in any other style key
 *
 * Top level keys in a theme are usually some shared styles and component styles, e.g.:
 * {
 *   // Shared style
 *   baseFont: {
 *     fontFamily: '...'
 *   },
 *
 *   // Style that will be applied to shoutem.ui.Text component
 *   'shoutem.ui.Text': {
 *     [INCLUDE]: ['baseFont'],
 *     color: 'black'
 *   }
 * }
 */
export default class Theme {
  constructor(themeStyle) {
    this[THEME_STYLE] = resolveStyle(themeStyle);
    this[THEME_STYLE_CACHE] = {};
  }

  /**
   * Sets the given style as a default theme style.
   */
  static setDefaultThemeStyle(style) {
    defaultTheme = new Theme(style);
  }

  /**
   * Returns the default theme that will be used as fallback
   * if the StyleProvider is not configured in the app.
   */
  static getDefaultTheme() {
    if (!defaultTheme) {
      defaultTheme = new Theme({});
    }

    return defaultTheme;
  }

  /**
   * Creates a component style by merging the theme style on top of the
   * provided default component style. Any rules in the theme style will
   * override the rules from the base component style.
   *
   * This method will also resolve any INCLUDE keywords in the theme or
   * component styles before returning the final style.
   *
   * @param componentName fully qualified component name.
   * @param defaultStyle - default component style that will be used as base style.
   */
  createComponentStyle(componentName, defaultStyle) {
    if (this[THEME_STYLE_CACHE][componentName]) {
      return this[THEME_STYLE_CACHE][componentName];
    }

    const componentIncludedStyle = resolveStyle(defaultStyle, this[THEME_STYLE]);

    /**
     * This is static component style (static per componentName). This style can only
     * change if the theme changes during runtime, so it is safe to reuse it within a
     * scope of a theme once it is resolved for the first time.
     */
    this[THEME_STYLE_CACHE][componentName] = mergeComponentAndThemeStyles(
      componentIncludedStyle,
      this[THEME_STYLE][componentName],
      this[THEME_STYLE]
    );

    return this[THEME_STYLE_CACHE][componentName];
  }
}

export const ThemeShape = PropTypes.shape({
  createComponentStyle: PropTypes.func.isRequired,
});
