import connectStyle from './src/connectStyle';
import { INCLUDE } from './src/resolveIncludes';
import StyleProvider from './src/StyleProvider';
import Theme, { ThemeShape } from './src/Theme';
import { createVariations, createSharedStyle } from './src/addons';
import Shapes from './examples/Shapes';

const Examples = {
  Shapes,
};

export {
  connectStyle,
  INCLUDE,
  StyleProvider,
  Theme,
  ThemeShape,
  createVariations,
  createSharedStyle,
  Examples
};
