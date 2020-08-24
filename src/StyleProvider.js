import React, { PureComponent, Children } from 'react'; // eslint-disable-line
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

  static getDerivedStateFromProps(props, state) {
    return props.style === state.style ? state : {
      style: props.style,
      theme: new Theme(props.style),
    };
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      theme: new Theme(props.style),
    };
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
