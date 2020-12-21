import React from 'react';
import PropTypes from 'prop-types';
import themeInit from './ThemeTest';
import StyleProvider from '../../src/StyleProvider';

export const TEST_VARIABLE = 5;

export default function StyleProviderTestAppComponent({ children }) {
  const themeVariables = { testVariable: TEST_VARIABLE };
  const style = themeInit(themeVariables);

  return <StyleProvider style={style}>{children}</StyleProvider>;
}

StyleProviderTestAppComponent.propTypes = {
  children: PropTypes.object.isRequired,
};
