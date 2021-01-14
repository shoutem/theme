# Theme

The React Native component's style is usually defined as a static variable along with the component itself. This makes it easy to build self contained components that always look and behave in the same way. On the other hand, it complicates building themeable (or skinnable) components that could have multiple styles that can be customized without touching the component source code.
`@shoutem/theme` is built to address that problem. With themes, you can target specific components in your app and customize them through one file, just like you would do it with CSS on the web.

## Install

```bash
$ npm install --save @shoutem/theme
```

## Docs

All the documentation is available on the [Developer portal](http://shoutem.github.io/docs/ui-toolkit/theme/introduction).

## Community

Join [our community](https://www.facebook.com/groups/shoutem.community/) on Facebook. Also, feel free to ask a question on Stack Overflow using ["shoutem" tag](http://stackoverflow.com/tags/shoutem).

## Examples

Use [Shoutem UI](https://github.com/shoutem/theme), set of components which are made to be customizable by Theme, to see how to work with it.

Create new React Native project:

```bash
$ react-native init HelloWorld
```

Install `@shoutem/ui` and `@shoutem/theme` and link them in your project:

```bash
$ cd HelloWorld
$ npm install --save @shoutem/ui
$ npm install --save @shoutem/theme
$ rnpm link
```

Now, simply copy the following to the `App.js` file of your React Native project:

```JavaScript
import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { StyleProvider } from '@shoutem/theme';
import {
  Card,
  Image,
  View,
  Subtitle,
  Caption,
} from '@shoutem/ui';

const window = Dimensions.get('window');

const Colors = {
  BACKGROUND: '#ffffff',
  SHADOW: '#000000',
};

const MEDIUM_GUTTER = 15;

const theme = {
  'shoutem.ui.View': {
    '.h-center': {
      alignItems: 'center',
    },

    '.v-center': {
      justifyContent: 'center',
    },

    '.flexible': {
      flex: 1,
    },

    flexDirection: 'column',
  },

  'shoutem.ui.Card': {
    'shoutem.ui.View.content': {
      'shoutem.ui.Subtitle': {
        marginBottom: MEDIUM_GUTTER,
      },

      flex: 1,
      alignSelf: 'stretch',
      padding: 10,
    },

    width: (180 / 375) * window.width,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: Colors.BACKGROUND,
    borderRadius: 2,
    shadowColor: Colors.SHADOW,
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 1 },
  },

  'shoutem.ui.Image': {
    '.medium-wide': {
      width: (180 / 375) * window.width,
      height: 85,
    },

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BACKGROUND,
  },
};

export default class App extends Component<{}> {
  render() {
    return (
      <StyleProvider style={theme}>
        <View styleName="flexible vertical v-center h-center">
          <Card>
            <Image
              styleName="medium-wide"
              source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-12.png' }}
            />
            <View styleName="content">
              <Subtitle numberOfLines={4}>
                Lady Gaga Sings National Anthem at Super Bowl 50
              </Subtitle>
              <Caption>21 hours ago</Caption>
            </View>
          </Card>
        </View>
      </StyleProvider>
    );
  }
}
```

Finally, run the app!

```bash
$ react-native run-ios
```

## Automated Testing

Jest has been set up to provide the ability to test `@shoutem/theme` after any changes.

To run tests, first add the following to `dependencies` in `package.json`:
- `"react-native": "0.63.2"`
- `"react": "16.13.1"`
- `"react-dom": "16.13.1"`

Or whichever version is relevant after your changes. Then run `npm i && npm run test` and see if you broke anything.


## UI Toolkit

Shoutem UI is a part of the Shoutem UI Toolkit that enables you to build professionally looking React Native apps with ease.  

It consists of three libraries:

- [@shoutem/ui](https://github.com/shoutem/ui): beautiful and customizable UI components
- [@shoutem/theme](https://github.com/shoutem/theme): “CSS-way" of styling entire app
- [@shoutem/animation](https://github.com/shoutem/animation): declarative way of applying ready-made  animations


## License

[The BSD License](https://opensource.org/licenses/BSD-3-Clause)
Copyright (c) 2016-present, [Shoutem](http://shoutem.github.io)
