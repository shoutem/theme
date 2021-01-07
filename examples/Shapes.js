import React from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import connectStyle from '../src/connectStyle';
import { INCLUDE } from '../src/resolveIncludes';
import StyleProvider from '../src/StyleProvider';

const resolveTheme = (variables = {}) => ({
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

export default class Shapes extends React.Component {
  static propTypes = {
    themeVariables: PropTypes.object,
    screenStyle: PropTypes.object,
  };

  static defaultProps = {
    themeVariables: {},
    screenStyle: {},
  };

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

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
    const { themeVariables } = this.state;

    const newThemeVariables = { ...themeVariables, [key]: val };
    this.setState({ themeVariables: newThemeVariables });
  }

  render() {
    const { screenStyle } = this.props;
    const { themeVariables } = this.state;

    return (
      <StyleProvider style={resolveTheme(themeVariables)}>
        <StyledScreen style={screenStyle} />
      </StyleProvider>
    );
  }
}

function Screen({ style }) {
  const { container, title } = style;

  // connectStyle creates HOC which pass theme style to component by it style name automatically
  return (
    <StyledView style={container} virtual>
      <Text style={title}>Theme Screen</Text>

      <StyledView styleName="square">
        {/* Circle styleName is not applied because it is not nested properly in theme */}
        <StyledView styleName="circle" />
        <StyledView styleName="nestedCircle" />
      </StyledView>

      {/* Virtual prop make component pass parent style rules to children */}
      <StyledView
        styleName="square"
        virtual
        style={{ backgroundColor: 'navy' }}
      >
        <StyledView styleName="circle" />
      </StyledView>
    </StyledView>
  );
}

Screen.propTypes = {
  style: PropTypes.object,
};

Screen.defaultProps = {
  style: {},
};

// Component style name - developer.project.screen
// Second argument is optional, additional component specific style.
const StyledScreen = connectStyle('developer.project.screen')(Screen);
const StyledView = connectStyle('developer.project.view')(View);
