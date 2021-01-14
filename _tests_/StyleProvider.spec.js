import React from 'react';
import { mount } from 'enzyme';

import Theme from '../src/Theme';
import StyleProviderTestAppComponent from './mocks/StyleProviderTestAppComponent';
import StyleProviderTestComponent from './mocks/StyleProviderTestComponent';

describe('StyleProvider', () => {
  it('provides a theme', () => {
    const demo = mount(
      <StyleProviderTestAppComponent>
        <StyleProviderTestComponent />
      </StyleProviderTestAppComponent>,
    );
    const passedTheme = demo
      .find(StyleProviderTestComponent)
      .instance()
      .getThemeStyle();

    expect(passedTheme instanceof Theme).toBe(true);
  });
});
