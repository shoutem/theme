const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const exposedProperties = ['window', 'navigator', 'document'];

global.document = new JSDOM('');
Object.keys(global.document).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};

documentRef = document;
