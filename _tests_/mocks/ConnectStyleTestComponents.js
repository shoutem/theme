import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { ThemeShape } from '../../src/Theme';
import connectStyle from '../../src/connectStyle';

class ConnectStyleTestClassComponent extends Component {
  static propTypes = {
    style: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    this.state = { text: 'Testing StyleProvider' };
  }

  render() {
    const { text } = this.state;

    return <Text>{text}</Text>;
  }
}

function ConnectStyleTestStatelessComponent() {
  return <Text>Stateless Component</Text>;
}

const style = { testStyle: {} };
const options = {};
export const componentName = 'test.component.TestComponent';

export const ConnectedClassComponent = connectStyle(
  componentName,
  style,
  undefined,
  options,
)(ConnectStyleTestClassComponent);

export const ConnectedStatelessComponent = connectStyle(
  componentName,
  style,
  undefined,
  options,
)(ConnectStyleTestStatelessComponent);
