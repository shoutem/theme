import * as _ from 'lodash';
export const INCLUDE = '@@shoutem.theme/include';

/**
 * Customizer function for lodash mergeWith which handle INCLUDE symbol.
 * Lodash merge/mergeWith functions doesn't merge symbols
 * and we use INCLUDE symbol to define which style we want to include.
 */
// eslint-disable-next-line consistent-return
function includeSymbolMergeHandler(objVal, srcVal) {
  const newObjVal = objVal;
  let include;

  if (srcVal && srcVal[INCLUDE]) {
    include = newObjVal && newObjVal[INCLUDE] ?
      [...newObjVal[INCLUDE], ...srcVal[INCLUDE]] : srcVal[INCLUDE];
  }

  // if objVal doesn't exists create new from source
  if (_.isUndefined(newObjVal) && _.isPlainObject(srcVal)) {
    // Copy symbol fix.
    // { ...srcVal } copies symbol wrong, it adds symbol value to the property defined just after it
    // Problem example: { SYMBOL: ['Test'], someProp: 10 } => { someProp: ['Test'] }
    // mergeWith prevents wrong copy because it doesn't iterate trough Symbols so it skips INCLUDE
    // We do not INCLUDE symbol to be copied actually in this function
    // because it is copied manually. This whole function is fixing Symbol problems.
    const newObj = _.mergeWith({}, srcVal, (o, s) => s);
    // Assigning INCLUDE after object definition to avoid Object.assign when code transpiled.
    // Object.assign in RN uses polyfill which doesn't copy Symbols that's why INCLUDE symbol
    // must be set manually after spread.
    // TODO(Braco) - once Object.assign polyfill is no longer used use commented code bellow
    // Check if `customizer` is needed still at all after polyfill is removed!
    // return { ...srcVal, [INCLUDE]: include }; // add new lines for each property
    if (include) {
      newObj[INCLUDE] = include;
    }
    return newObj;
  }

  // otherwise let lodash default merge (return undefined)
  // and add INCLUDE to objVal if any in srcVal
  if (_.isPlainObject(newObjVal) && include) {
    newObjVal[INCLUDE] = include;
  }
}

/**
 * Recursively include required target styles from target and base root.
 *
 * @param target - styles object containing
 * @param base - additional style object from which target may include style
 */
export default function resolveIncludes(target, base = {}) {
  /**
   * Include process steps:
   * 1. Iterate through target object, check if property is object and if it has [INCLUDE]
   * 2.a. If property is object, repeat process for that object
   * 2.b. If property is not object leave value as is
   * 3. Include any [INCLUDE] (required style)
   *  1. Repeat process for required style (check if it has any [INCLUDE])
   */

  /**
   * Merges style from target and base.
   * Target style overrides base.
   * @param styleName - style name to include
   */
  function getStyle(styleName) {
    const defaultStyle = {};
    let style = defaultStyle;

    const baseStyle = base[styleName];
    if (baseStyle) {
      if (baseStyle[INCLUDE]) {
        throw Error(`Base style cannot have includes, unexpected include in ${styleName}.`);
      }
      style = { ...baseStyle };
    }

    const targetStyle = target[styleName];
    if (targetStyle) {
      style = {
        ...style,
        ...targetStyle,
      };
    }

    if (style === defaultStyle) {
      console.warn(`Including unexisting style: ${styleName}`);
    }

    return style;
  }

  // Includes all styles required by using the INCLUDE symbol
  // on the styleNode object level, and recursively calls itself
  // for all nested style objects. After calling this function, the
  // styleNode object will be fully processed, i.e., all styles
  // required by this object, and any of its children will be resolved.
  function includeNodeStyles(styleNode, processingStyleNames) {
    if (!_.isPlainObject(styleNode)) {
      return styleNode;
    }

    // Style names which current style node want to include
    const styleNamesToInclude = styleNode[INCLUDE];

    let stylesToInclude = {};
    if (styleNamesToInclude) {
      if (!_.isArray(styleNamesToInclude)) {
        throw Error('Include should be array');
      }

      for (const styleName of styleNamesToInclude) {
        if (processingStyleNames.has(styleName)) {
          throw Error(`Circular style include, including ${styleName}`);
        }
        processingStyleNames.add(styleName);
        stylesToInclude = _.mergeWith(
          {},
          stylesToInclude,
          includeNodeStyles(getStyle(styleName), processingStyleNames),
          includeSymbolMergeHandler
        );
        processingStyleNames.delete(styleName);
      }
    }

    const resultingStyle = _.mergeWith({}, stylesToInclude, styleNode, includeSymbolMergeHandler);
    delete resultingStyle[INCLUDE];

    for (const styleName of _.keys(resultingStyle)) {
      resultingStyle[styleName] =
        includeNodeStyles(resultingStyle[styleName], processingStyleNames);
    }
    return resultingStyle;
  }

  // A that holds all style names that are currently
  // being processed. This is used to detect include
  // cycles.
  const processingStyleNames = new Set();
  return includeNodeStyles(target, processingStyleNames);
}
