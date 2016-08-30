import React, {
  Component,
  Text,
} from 'react-native';

import { ThemeShape } from '../../';

export default class StyleProviderTestComponent extends Component {
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
