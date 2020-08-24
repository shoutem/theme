import React, { PureComponent } from 'react';
import { Text } from 'react-native';
import { ThemeShape } from '../../src/Theme';

export default class StyleProviderTestComponent extends PureComponent {
  static contextTypes = {
    theme: ThemeShape,
  };

  constructor(props, context) {
    super(props, context);

    this.theme = context.theme;
  }

  getThemeStyle() {
    return this.theme;
  }

  render() {
    return <Text>Testing StyleProvider</Text>;
  }
}
