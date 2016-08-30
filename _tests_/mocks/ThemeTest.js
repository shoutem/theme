export const TEST_PROPERTY = 1;

export default (variables) => ({
  testStyle: {
    testProperty: TEST_PROPERTY,
    variableProperty: variables.testVariable,
  },
});
