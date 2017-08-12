import React, { Children } from 'react';
import PropTypes from 'prop-types';
import Theme, { ThemeShape } from './Theme';
import normalizeStyle from './StyleNormalizer/normalizeStyle';

/**
 *  Provides a theme to child components trough context.
 */
export default class StyleProvider extends React.Component {
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
      theme: this.createTheme(props),
    };
  }

  getChildContext() {
    return {
      theme: this.state.theme,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.style !== this.props.style) {
      this.setState({
        theme: this.createTheme(nextProps),
      });
    }
  }

  createTheme(props) {
    return new Theme(props.style);
  }

  render() {
    const { children } = this.props;

    return Children.only(children);
  }
}
