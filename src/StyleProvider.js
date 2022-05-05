import { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import Theme, { ThemeShape } from './Theme';

/**
 *  Provides a theme to child components trough context.
 */

export default class StyleProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };

  static childContextTypes = {
    theme: ThemeShape.isRequired,
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

  getChildContext() {
    const { theme } = this.state;

    return { theme };
  }

  render() {
    const { children } = this.props;

    return Children.only(children);
  }
}
