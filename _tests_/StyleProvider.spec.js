import React from 'react-native';
import { assert } from 'chai';
import { mount } from 'enzyme';
import { Theme } from '../';
import StyleProviderTestAppComponent from './mocks/StyleProviderTestAppComponent';
import StyleProviderTestComponent from './mocks/StyleProviderTestComponent';

describe('StyleProvider', () => {
  it('provides a theme', () => {
    const demo = mount(
      <StyleProviderTestAppComponent>
        <StyleProviderTestComponent />
      </StyleProviderTestAppComponent>
    );
    const passedTheme = demo.find(StyleProviderTestComponent).nodes[0].getThemeStyle();

    assert.isTrue(passedTheme instanceof Theme, 'theme not available in context');
  });
});
