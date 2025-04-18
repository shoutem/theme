module.exports = function babelConfig(api) {
  api.cache.forever();

  const presets = ['module:@react-native/babel-preset'];
  const plugins = [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ];

  return {
    presets,
    plugins,
  };
};
