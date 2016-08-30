import React from 'react';
import connectStyle from '../src/connectStyle';
import StyleProvider from '../src/StyleProvider';
import { INCLUDE } from '../src/resolveIncludes';
import { View, Text } from 'react-native';

const theme = (variables = {}) => ({
  circle: {
    width: variables.circleRadius,
    height: variables.circleRadius,
    borderRadius: variables.circleRadius,
    backgroundColor: '#fff',
  },
  'developer.project.screen': {
    'developer.project.view': {

      'developer.project.view': {
        '.nestedCircle': {
          [INCLUDE]: ['circle'],
        },
      },

      '.square': {
        marginTop: 10,
        width: variables.squareSize,
        height: variables.squareSize,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
      },

      '.circle': {
        [INCLUDE]: ['circle'],
      },
    },
    container: {
      marginTop: 50,
      alignItems: 'center',
      flex: 1,
    },
    title: {
      color: variables.color,
      fontSize: variables.fontSize,
    },
    input: {
      width: 100,
      height: 50,
      backgroundColor: 'red',
    },
  },
});

export  default class Shapes extends React.Component {
  static propTypes = {
    themeVariables: React.PropTypes.object,
    screenStyle: React.PropTypes.object,
  };

  static defaultProps = {
    themeVariables: {},
    screenStyle: {},
  };

  constructor(props, context) {
    super(props, context);
    this.updateThemeVariable = this.updateThemeVariable.bind(this);

    const themeVariables = {
      color: 'navy',
      fontSize: 18,
      squareSize: 250,
      circleRadius: 100,
      ...props.themeVariables,
    };

    this.state = {
      themeVariables,
    };
  }

  updateThemeVariable(key, val) {
    const themeVariables = { ...this.state.themeVariables, [key]: val };
    this.setState({ themeVariables });
  }

  resolveTheme(themeVariables) {
    return theme(themeVariables);
  }

  render() {
    const { themeVariables } = this.state;
    return (
      <StyleProvider style={this.resolveTheme(themeVariables)}>
        <StyledScreen style={this.props.screenStyle} />
      </StyleProvider>
    );
  }
}

function Screen({ style }) {
  // connectStyle creates HOC which pass theme style to component by it style name automatically
  return (
    <StyledView style={style.container} virtual>
      <Text style={style.title}>Theme Screen</Text>

      <StyledView styleName="square">
        {/* Circle styleName is not applied because it is not nested properly in theme */}
        <StyledView styleName="circle" />
        <StyledView styleName="nestedCircle" />
      </StyledView>

      {/* Virtual prop make component pass parent style rules to children */}
      <StyledView styleName="square" virtual style={{ backgroundColor: 'navy' }}>
        <StyledView styleName="circle" />
      </StyledView>

    </StyledView>
  );
}

Screen.propTypes = {
  style: React.PropTypes.object,
};

// Component style name - developer.project.screen
// Second argument is optional, additional component specific style.
const StyledScreen = connectStyle('developer.project.screen')(Screen);
const StyledView = connectStyle('developer.project.view')(View);
