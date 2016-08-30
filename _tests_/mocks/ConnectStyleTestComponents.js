import React, {
  Component,
  Text,
} from 'react-native';

import { connectStyle } from '../../';

class ConnectStyleTestClassComponent extends Component {
  static propTypes = {
    style: React.PropTypes.object,
  };
  constructor(props, context) {
    super(props, context);
    this.state = { text: 'Testing StyleProvider' };
  }
  render() {
    return <Text>{this.state.text}</Text>;
  }
}

function ConnectStyleTestStatelessComponent() {
  return <Text>Stateless Component</Text>;
}

const style = {
  testStyle: {},
};

const options = { withRef: true };

const componentName = 'test.component.TestComponent';

const ConnectedClassComponent =
  connectStyle(componentName, style, undefined, options)(ConnectStyleTestClassComponent);
const ConnectedStatelessComponent =
  connectStyle(componentName, style, undefined, options)(ConnectStyleTestStatelessComponent);

export {
  ConnectedClassComponent,
  ConnectedStatelessComponent,
  componentName,
};
