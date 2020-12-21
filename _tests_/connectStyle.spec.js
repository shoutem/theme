import React, { PureComponent } from 'react';
import { mount } from 'enzyme';
import StyleProviderTestAppComponent from './mocks/StyleProviderTestAppComponent';
import {
  ConnectedClassComponent,
  ConnectedStatelessComponent,
  componentName,
} from './mocks/ConnectStyleTestComponents';

describe('connectStyle', () => {
  it('does not provide irrelevant style to component', () => {
    const demo = mount(
      <StyleProviderTestAppComponent>
        <ConnectedClassComponent />
      </StyleProviderTestAppComponent>,
    );
    const passedStyle = demo.find(ConnectedClassComponent).instance().props
      .style;

    expect(passedStyle.testStyle).toBe(undefined);
  });

  it('provides normalized style ', () => {
    const denormalizedStyle = { denormalized: { padding: 5 } };
    const demo = mount(
      <StyleProviderTestAppComponent>
        <ConnectedClassComponent style={denormalizedStyle} />
      </StyleProviderTestAppComponent>,
    );
    // Weird enzyme magic, in this scenario, instead of props, it ends up in state.
    // Props end up containing the denormalized style (padding: 5).
    // If logged in ConnectStyleTestClassComponent as this.props.style, you end up
    // with normalizedStyle, as expected.
    const passedStyle = demo.find(ConnectedClassComponent).instance().state
      .style;
    const normalizedStyle = {
      paddingBottom: 5,
      paddingLeft: 5,
      paddingRight: 5,
      paddingTop: 5,
    };

    expect(passedStyle.denormalized).toEqual(normalizedStyle);
    expect(passedStyle.testStyle).toBe(undefined);
  });

  it('creates ref for react Component component', () => {
    const demo = mount(
      <StyleProviderTestAppComponent>
        <ConnectedClassComponent />
      </StyleProviderTestAppComponent>,
    );
    const instance = demo.find(ConnectedClassComponent).instance();

    expect(instance instanceof PureComponent).toBeTruthy();
  });

  it("doesn't create ref for stateless component", () => {
    const demo = mount(
      <StyleProviderTestAppComponent>
        <ConnectedStatelessComponent />
      </StyleProviderTestAppComponent>,
    );
    const instance = demo.find(ConnectedStatelessComponent).instance().props
      .ref;

    expect(instance).toBeFalsy();
  });

  describe('virtual', () => {
    it('pass parent style to child component as parent style', () => {
      const context = {
        parentStyle: {
          'some.child.component': {
            flex: 1,
          },
          test: 1,
        },
      };
      const demo = mount(<ConnectedClassComponent virtual />, { context });
      const instanceContext = demo.instance().getChildContext();

      expect(instanceContext.parentStyle).toBe(context.parentStyle);
    });

    it("doesn't pass parent style to child component as parent style", () => {
      const context = {
        parentStyle: {
          [componentName]: {
            'some.child.component': {
              flex: 1,
            },
            'some.child.component1': {
              flex: 2,
            },
            flex: 1,
          },
        },
      };
      const demo = mount(<ConnectedClassComponent />, { context });
      const instanceContext = demo.instance().getChildContext();

      const expectedParentStyle = {};

      expect(instanceContext.parentStyle).toEqual(expectedParentStyle);
    });
  });
});
