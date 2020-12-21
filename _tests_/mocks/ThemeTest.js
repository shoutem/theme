export const TEST_PROPERTY = 1;

export default themeInit = variables => {
  return {
    testStyle: {
      testProperty: TEST_PROPERTY,
      variableProperty: variables.testVariable,
    },
  };
};
