import React, { PureComponent, Children, isValidElement, cloneElement } from 'react';
import autoBindReact from 'auto-bind/react';
import hoistStatics from 'hoist-non-react-statics';
import _ from 'lodash';
import PropTypes from 'prop-types';
import normalizeStyle from './StyleNormalizer/normalizeStyle';
import resolveComponentStyle from './resolveComponentStyle';
import { ThemeShape } from './Theme';

// TODO - remove withRef warning in next version

/**
 * Formats and throws an error when connecting component style with the theme.
 *
 * @param errorMessage The error message.
 * @param componentDisplayName The name of the component that is being connected.
 */
function throwConnectStyleError(errorMessage, componentDisplayName) {
  throw Error(
    `${errorMessage} - when connecting ${componentDisplayName} component to style.`,
  );
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
      static propTypes = {
        // Element style that overrides any other style of the component
        style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        // The style variant names to apply to this component,
        // multiple variants may be separated with a space character
        styleName: PropTypes.string,
        // Virtual elements will propagate the parent
        // style to their children, i.e., the children
        // will behave as they are placed directly below
        // the parent of a virtual element.
        virtual: PropTypes.bool,
        parentStyle: PropTypes.object,
        transformProps: PropTypes.func,
      };

      static defaultProps = {
        virtual: options.virtual,
      };

      static contextTypes = {
        theme: ThemeShape,
      };

      static displayName = `Styled(${componentDisplayName})`;
      static WrappedComponent = WrappedComponent;
      static BaseComponent = getBaseComponent(WrappedComponent);

      constructor(props, context) {
        super(props, context);

        const styleNames = this.resolveStyleNames(props);
        const resolvedStyle = this.resolveStyle(context, props, styleNames);

        autoBindReact(this);

        this.state = {
          style: resolvedStyle.componentStyle,
          childrenStyle: resolvedStyle.childrenStyle,
          // AddedProps are additional WrappedComponent props
          // Usually they are set through alternative ways,
          // such as theme style, or through options
          addedProps: this.resolveAddedProps(),
          styleNames,
          themeChange: false,
        };
      }

      componentDidMount() {
        this.context.theme.subscribe(() => {
          this.setState({ themeChange: true }, this.forceUpdate);
        });
      }

      componentDidUpdate(prevProps) {
        const styleNames = this.resolveStyleNames(this.props);

        if (this.shouldRebuildStyle(prevProps, styleNames)) {
          const resolvedStyle = this.resolveStyle(
            this.context,
            this.props,
            styleNames,
          );

          this.setState({
            style: resolvedStyle.componentStyle,
            childrenStyle: resolvedStyle.childrenStyle,
            styleNames,
            themeChange: false,
          });
        }
      }

      setNativeProps(nativeProps) {
        if (!this.isRefDefined()) {
          // eslint-disable-next-line no-console
          console.warn("setNativeProps can't be used on stateless components");
          return;
        }
        if (this.wrappedInstance.setNativeProps) {
          this.wrappedInstance.setNativeProps(nativeProps);
        }
      }

      setWrappedInstance(component) {
        this.wrappedInstance = component;
      }

      hasStyleNameChanged(prevProps, styleNames) {
        const stateStyleNames = _.get(this.state, 'styleNames');

        return (
          mapPropsToStyleNames &&
          this.props !== prevProps &&
          // Even though props did change here, it doesn't necessarily mean
          // props that affect styleName have changed
          !_.isEqual(stateStyleNames, styleNames)
        );
      }

      shouldRebuildStyle(prevProps, styleNames) {
        const { themeChange } = this.state;

        return (
          prevProps.style !== this.props.style ||
          prevProps.styleName !== this.props.styleName ||
          prevProps.parentStyle !== this.props.parentStyle ||
          themeChange ||
          this.hasStyleNameChanged(prevProps, styleNames)
        );
      }

      resolveStyleNames(props) {
        const { styleName } = props;
        const styleNames = styleName ? styleName.split(/\s/g) : [];

        if (!mapPropsToStyleNames) {
          return styleNames;
        }

        // We only want to keep the unique style names
        return _.uniq(mapPropsToStyleNames(styleNames, props));
      }

      isRefDefined() {
        // Define refs on all stateful containers
        // Since react-redux v7, connect returns objects instead of functions.
        // prototype can be null now
        return WrappedComponent.prototype?.render;
      }

      resolveAddedProps() {
        const addedProps = {};
        if (options.withRef) {
          // eslint-disable-next-line no-console
          console.warn('withRef is deprecated');
        }
        if (this.isRefDefined()) {
          addedProps.ref = this.setWrappedInstance;
        }
        return addedProps;
      }

      resolveStyle(context, props, styleNames) {
        const { parentStyle, style } = props;
        const normalizedStyle = normalizeStyle(style);

        const themeStyle = context.theme.createComponentStyle(
          componentStyleName,
          componentStyle,
        );

        return resolveComponentStyle(
          componentStyleName,
          styleNames,
          themeStyle,
          parentStyle,
          normalizedStyle,
        );
      }

      /**
       * A helper function provided to child components that enables
       * them to get the prop transformations that this component performs.
       *
       * @param props The component props to transform.
       * @returns {*} The transformed props.
       */
      transformProps(props) {
        const styleNames = this.resolveStyleNames(props);
        const componentStyle = this.resolveStyle(
          this.context,
          props,
          styleNames,
        );

        return {
          ...props,
          style: this.resolveStyle(this.context, props, styleNames).componentStyle,
        };
      }

      render() {
        const { virtual, parentStyle, children, ...otherProps } = this.props;
        const { addedProps, style, childrenStyle } = this.state;

        const resolvedParentStyle = virtual ? parentStyle : childrenStyle;

        const childrenWithProps = Children.map(children, child => {
          if (isValidElement(child)) {
            return cloneElement(child, { parentStyle: resolvedParentStyle, transformProps: this.transformProps })
          }

          return child;
        });

        return (
          <WrappedComponent
            {...otherProps}
            {...addedProps}
            style={style}
          >
            {childrenWithProps}
          </WrappedComponent>
        );
      }
    }

    return hoistStatics(StyledComponent, WrappedComponent);
  };
};
