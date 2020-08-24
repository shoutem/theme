import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'auto-bind';
import hoistStatics from 'hoist-non-react-statics';
import _ from 'lodash';

import normalizeStyle from './StyleNormalizer/normalizeStyle';
import resolveComponentStyle from './resolveComponentStyle';
import Theme, { ThemeShape } from './Theme';

// TODO - remove withRef warning in next version

/**
 * Formats and throws an error when connecting component style with the theme.
 *
 * @param errorMessage The error message.
 * @param componentDisplayName The name of the component that is being connected.
 */
function throwConnectStyleError(errorMessage, componentDisplayName) {
  throw Error(`${errorMessage} - when connecting ${componentDisplayName} component to style.`);
}

/**
 * Returns the theme object from the provided context,
 * or an empty theme if the context doesn't contain a theme.
 *
 * @param context The React component context.
 * @returns {Theme} The Theme object.
 */
function getTheme(context) {
  // Fallback to a default theme if the component isn't
  // rendered in a StyleProvider.
  return context.theme || Theme.getDefaultTheme();
}

function isRefDefined(WrappedComponent) {
  // Define refs on all stateful containers
  return WrappedComponent.prototype.render;
}

function resolveStyle(context, props, styleNames) {
  const { parentStyle } = context;
  const { componentStyle, componentStyleName, style: propStyle } = props;

  const style = normalizeStyle(propStyle);
  const theme = getTheme(context);
  const themeStyle = theme.createComponentStyle(componentStyleName, componentStyle);

  return resolveComponentStyle(
    componentStyleName,
    styleNames,
    themeStyle,
    parentStyle,
    style,
  );
}

function resolveStyleNames(props) {
  const { mapPropsToStyleNames, styleName } = props;
  const styleNames = styleName ? styleName.split(/\s/g) : [];

  if (!mapPropsToStyleNames) {
    return styleNames;
  }

  // We only want to keep the unique style names
  return _.uniq(mapPropsToStyleNames(styleNames, props));
}

/**
 * Resolves the final component style by using the theme style, if available and
 * merging it with the style provided directly through the style prop, and style
 * variants applied through the styleName prop.
 *
 * @param componentStyleName The component name that will be used
 * to target this component in style rules.
 * @param componentStyle The default component style.
 * @param mapPropsToStyleNames Pure function to customize styleNames depending on props.
 * @param options The additional connectStyle options
 * @param options.virtual The default value of the virtual prop
 * @returns {StyledComponent} The new component that will handle
 * the styling of the wrapped component.
 */
export default function connectStyle(
  componentStyleName,
  componentStyle = {},
  mapPropsToStyleNames,
  options = {},
) {
  function getComponentDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }

  function getBaseComponent(WrappedComponent) {
    if (WrappedComponent.BaseComponent) {
      return WrappedComponent.BaseComponent;
    }

    return WrappedComponent;
  }

  return function wrapWithStyledComponent(WrappedComponent) {
    const componentDisplayName = getComponentDisplayName(WrappedComponent);

    if (!_.isPlainObject(componentStyle)) {
      throwConnectStyleError(
        'Component style must be plain object',
        componentDisplayName,
      );
    }

    if (!_.isString(componentStyleName)) {
      throwConnectStyleError(
        'Component Style Name must be string',
        componentDisplayName,
      );
    }

    class StyledComponent extends PureComponent {
      static contextTypes = {
        theme: ThemeShape,
        // The style inherited from the parent
        parentStyle: PropTypes.object,
        transformProps: PropTypes.func,
      };

      static childContextTypes = {
        // Provide the parent style to child components
        parentStyle: PropTypes.object,
        transformProps: PropTypes.func,
      };

      static propTypes = {
        // Element style that overrides any other style of the component
        style: PropTypes.oneOfType([
          PropTypes.object,
          PropTypes.array,
        ]),
        // The style variant names to apply to this component,
        // multiple variants may be separated with a space character
        styleName: PropTypes.string,
        // Virtual elements will propagate the parent
        // style to their children, i.e., the children
        // will behave as they are placed directly below
        // the parent of a virtual element.
        virtual: PropTypes.bool,
      };

      static defaultProps = {
        style: {},
        styleName: '',
        virtual: options.virtual,
      };

      static displayName = `Styled(${componentDisplayName})`;

      static WrappedComponent = WrappedComponent;

      static BaseComponent = getBaseComponent(WrappedComponent);

      constructor(props, context) {
        super(props, context);

        autoBind(this);

        const styleNames = resolveStyleNames(props);
        const resolvedStyle = resolveStyle(context, props, styleNames);

        this.state = {
          style: resolvedStyle.componentStyle,
          childrenStyle: resolvedStyle.childrenStyle,
          // AddedProps are additional WrappedComponent props
          // Usually they are set through alternative ways,
          // such as theme style, or through options
          addedProps: this.resolveAddedProps(),
          styleNames, // eslint-disable-line
        };
      }

      getChildContext() {
        const { virtual } = this.props;
        const { childrenStyle } = this.state;
        const { parentStyle } = this.context;

        return {
          parentStyle: virtual ? parentStyle : childrenStyle,
          transformProps: this.transformProps,
        };
      }

      setNativeProps(nativeProps) {
        if (!isRefDefined(WrappedComponent)) {
          console.warn('setNativeProps can\'t be used on stateless components');
          return;
        }
        if (this.wrappedInstance.setNativeProps) {
          this.wrappedInstance.setNativeProps(nativeProps);
        }
      }

      setWrappedInstance(component) {
        this.wrappedInstance = component;
      }

      resolveAddedProps() {
        const addedProps = {};
        if (options.withRef) {
          console.warn('withRef is deprecated');
        }
        if (isRefDefined(WrappedComponent)) {
          addedProps.ref = this.setWrappedInstance(WrappedComponent);
        }
        return addedProps;
      }

      /**
       * A helper function provided to child components that enables
       * them to get the prop transformations that this component performs.
       *
       * @param props The component props to transform.
       * @returns {*} The transformed props.
       */
      transformProps(props) {
        const styleNames = resolveStyleNames(props);

        return {
          ...props,
          style: resolveStyle(
            this.context,
            props,
            styleNames,
          ).componentStyle,
        };
      }

      render() {
        const { addedProps, style } = this.state;

        return (
          <WrappedComponent
            {...this.props}
            {...addedProps}
            style={style}
          />
        );
      }
    }

    return hoistStatics(StyledComponent, WrappedComponent);
  };
}
