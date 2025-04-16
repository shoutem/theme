import React, { PureComponent, useContext } from 'react';
import autoBindReact from 'auto-bind/react';
import hoistStatics from 'hoist-non-react-statics';
import _ from 'lodash';
import normalizeStyle from './StyleNormalizer/normalizeStyle';
import resolveComponentStyle from './resolveComponentStyle';
import { ThemeContext } from './StyleProvider';
import Theme from './Theme';

function throwConnectStyleError(errorMessage, componentDisplayName) {
  throw new Error(
    `${errorMessage} - when connecting ${componentDisplayName} component to style.`,
  );
}

export default function connectStyle(
  componentStyleName,
  componentStyle = {},
  mapPropsToStyleNames,
  options = {},
) {
  if (!_.isPlainObject(componentStyle)) {
    throwConnectStyleError(
      'Component style must be plain object',
      componentStyleName,
    );
  }

  if (!_.isString(componentStyleName)) {
    throwConnectStyleError(
      'Component Style Name must be string',
      componentStyleName,
    );
  }

  function getComponentDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }

  function getBaseComponent(WrappedComponent) {
    return WrappedComponent.BaseComponent || WrappedComponent;
  }

  function StyledWrapper(props) {
    const themeContext = useContext(ThemeContext);
    return <StyledComponent {...props} __themeContext={themeContext} />;
  }

  class StyledComponent extends PureComponent {
    static displayName = `Styled(${getComponentDisplayName(
      componentStyleName,
    )})`;

    static WrappedComponent = componentStyleName;

    static BaseComponent = getBaseComponent(componentStyleName);

    constructor(props) {
      super(props);

      const { __themeContext } = props;

      autoBindReact(this);

      const styleNames = this.resolveStyleNames(props);
      const resolvedStyle = this.resolveStyle(
        __themeContext,
        props,
        styleNames,
      );

      this.state = {
        style: resolvedStyle.componentStyle,
        childrenStyle: resolvedStyle.childrenStyle,
        addedProps: this.resolveAddedProps(),
        styleNames,
      };
    }

    componentDidUpdate(prevProps) {
      const styleNames = this.resolveStyleNames(this.props);

      if (this.shouldRebuildStyle(prevProps, styleNames)) {
        const resolvedStyle = this.resolveStyle(
          this.props.__themeContext,
          this.props,
          styleNames,
        );

        this.setState({
          style: resolvedStyle.componentStyle,
          childrenStyle: resolvedStyle.childrenStyle,
          styleNames,
        });
      }
    }

    resolveStyleNames(props) {
      const { styleName } = props;
      const styleNames = styleName ? styleName.split(/\s+/g) : [];

      return mapPropsToStyleNames
        ? _.uniq(mapPropsToStyleNames(styleNames, props))
        : styleNames;
    }

    shouldRebuildStyle(prevProps, styleNames) {
      return (
        prevProps.style !== this.props.style ||
        prevProps.styleName !== this.props.styleName ||
        !_.isEqual(this.state.styleNames, styleNames)
      );
    }

    resolveStyle(context, props, styleNames) {
      const style = normalizeStyle(props.style);
      const theme = context.theme || Theme.getDefaultTheme();
      const themeStyle = theme.createComponentStyle(
        componentStyleName,
        componentStyle,
      );

      return resolveComponentStyle(
        componentStyleName,
        styleNames,
        themeStyle,
        context.parentStyle,
        style,
      );
    }

    resolveAddedProps() {
      const addedProps = {};
      if (options.withRef && this.isRefDefined()) {
        console.warn('withRef is deprecated and will be removed');
        addedProps.ref = this.setWrappedInstance;
      }
      return addedProps;
    }

    isRefDefined() {
      return (
        StyledComponent.WrappedComponent.prototype &&
        typeof StyledComponent.WrappedComponent.prototype.render === 'function'
      );
    }

    setWrappedInstance = component => {
      this.wrappedInstance = component;
    };

    transformProps = props => {
      const styleNames = this.resolveStyleNames(props);
      const resolved = this.resolveStyle(
        this.props.__themeContext,
        props,
        styleNames,
      );
      return {
        ...props,
        style: resolved.componentStyle,
      };
    };

    render() {
      const { style, addedProps, childrenStyle } = this.state;
      const {
        __themeContext,
        virtual = options.virtual,
        ...restProps
      } = this.props;

      const parentStyle = virtual ? __themeContext.parentStyle : childrenStyle;

      return (
        <ThemeContext.Provider
          value={{
            ...__themeContext,
            parentStyle,
            transformProps: this.transformProps,
          }}
        >
          <StyledComponent.WrappedComponent
            {...restProps}
            {...addedProps}
            style={style}
          />
        </ThemeContext.Provider>
      );
    }
  }

  return hoistStatics(StyledWrapper, componentStyleName);
}
