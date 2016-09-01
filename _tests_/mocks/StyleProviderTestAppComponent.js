import React from 'react-native';
import themeInit from './ThemeTest';
import { StyleProvider } from '../../';

export const TEST_VARIABLE = 5;

export default function StyleProviderTestAppComponent({ children }) {
  const themeVariables = {
    testVariable: TEST_VARIABLE,
  };
  return (
    <StyleProvider style={themeInit(themeVariables)}>
      {children}
    </StyleProvider>
  );
}

StyleProviderTestAppComponent.propTypes = {
  children: React.PropTypes.object,
};
