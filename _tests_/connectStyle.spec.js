import React, { Component } from 'react';
import { assert } from 'chai';
import { mount } from 'enzyme';
import { TEST_PROPERTY } from './mocks/ThemeTest';
import StyleProviderTestAppComponent,
{
  TEST_VARIABLE,
} from './mocks/StyleProviderTestAppComponent';
import {
  ConnectedClassComponent,
  ConnectedStatelessComponent,
  componentName,
} from './mocks/ConnectStyleTestComponents';

describe('connectStyle', () => {
  it('provides proper style to component', () => {
    const demo = mount(
      <StyleProviderTestAppComponent>
        <ConnectedClassComponent />
      </StyleProviderTestAppComponent>
    );
    const passedStyle = demo.find(ConnectedClassComponent)
      .nodes[0].refs.wrappedInstance.props.style;

    assert.equal(
      passedStyle.testStyle.testProperty,
      TEST_PROPERTY,
      'style different then defined at theme'
    );
    assert.equal(
      passedStyle.testStyle.variableProperty,
      TEST_VARIABLE,
      'style different then variable value (as defined at theme)'
    );
  });
  it('provides normalized style ', () => {
    const denormalizedStyle = { denormalized: { padding: 5 } };
    const demo = mount(
      <StyleProviderTestAppComponent>
        <ConnectedClassComponent style={denormalizedStyle} />
      </StyleProviderTestAppComponent>
    );

    const passedStyle = demo.find(ConnectedClassComponent)
      .nodes[0].refs.wrappedInstance.props.style;

    const normalizedStyle = {
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 5,
      paddingRight: 5,
    };

    assert.deepEqual(
      passedStyle.denormalized,
      normalizedStyle,
      'style different then defined at theme'
    );
    assert.equal(
      passedStyle.testStyle.variableProperty,
      TEST_VARIABLE,
      'style different then variable value (as defined at theme)'
    );
  });
  it('creates ref for react Component component', () => {
    const demo = mount(
      <StyleProviderTestAppComponent>
        <ConnectedClassComponent />
      </StyleProviderTestAppComponent>
    );
    const instance = demo.find(ConnectedClassComponent)
      .nodes[0].refs.wrappedInstance;

    assert.isOk(instance instanceof Component, 'instance doesn\'t exists at class component');
  });
  it('doesn\'t create ref for stateless component', () => {
    const demo = mount(
      <StyleProviderTestAppComponent>
        <ConnectedStatelessComponent />
      </StyleProviderTestAppComponent>
    );
    const instance = demo.find(ConnectedStatelessComponent)
      .nodes[0].refs.wrappedInstance;

    assert.isNotOk(instance, 'instance exists on stateless component');
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
      const demo = mount(<ConnectedClassComponent virtual/>, { context });
      const instanceContext = demo.instance().getChildContext();

      assert.strictEqual(
        instanceContext.parentStyle,
        context.parentStyle,
        'doesn\'t pass correct style');
    });
    it('doesn\'t pass parent style to child component as parent style', () => {
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

      const expectedParentStyle = {
        'some.child.component': {
          flex: 1,
        },
        'some.child.component1': {
          flex: 2,
        },
      };
      assert.deepEqual(
        instanceContext.parentStyle,
        expectedParentStyle,
        'pass correct style'
      );
    });
  });
});
