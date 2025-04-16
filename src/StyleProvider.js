import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Theme from './Theme';

export const ThemeContext = React.createContext({
  theme: null,
  parentStyle: null,
  transformProps: () => {},
});

/**
 *  Provides a theme to child components trough context.
 */

export default class StyleProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      theme: new Theme(props.style),
    };
  }

  componentDidUpdate(prevProps) {
    const { style } = this.props;
    const { theme } = this.state;
    const { style: prevStyle } = prevProps;

    if (style !== prevStyle) {
      theme.setTheme(style);
    }
  }

  render() {
    const { theme } = this.state;
    const { children } = this.props;

    return (
      <ThemeContext.Provider value={{ theme }}>
        {children}
      </ThemeContext.Provider>
    );
  }
}
