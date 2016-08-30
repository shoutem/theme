import resolveIncludes, { INCLUDE } from '../src/resolveIncludes';
import { assert } from 'chai';

// TODO(Braco) - complete tests
// base including style which it contains itself but it's also in target

describe('resolveIncludes', () => {
  describe('resolve only target ', () => {
    it('includes styles', () => {
      const target = {
        numberInclude: {
          number: 1,
        },
        textInclude: {
          text: 'test',
        },
        includeSingleStyle: {
          [INCLUDE]: ['numberInclude'],
        },
        includeMultipleStyles: {
          [INCLUDE]: ['numberInclude', 'textInclude'],
        },
      };
      const includedStyle = resolveIncludes(target);

      assert.equal(
        includedStyle.includeSingleStyle.number,
        target.numberInclude.number,
        'style not included properly'
      );
      assert.equal(
        includedStyle.includeMultipleStyles.number,
        target.numberInclude.number,
        'first style include not included properly'
      );
      assert.equal(
        includedStyle.includeMultipleStyles.text,
        target.textInclude.text,
        'second style include not included properly'
      );
    });

    it('includes nested includes', () => {
      const target = {
        firstInclude: {
          [INCLUDE]: ['firstIncludeNumber'],
        },
        secondInclude: {
          [INCLUDE]: ['secondIncludeNumber'],
          color: 'red',
        },
        includingStyle: {
          [INCLUDE]: ['firstInclude', 'secondInclude'],
        },
        firstIncludeNumber: {
          number: 2,
        },
        secondIncludeNumber: {
          number: 3,
        },
      };
      const expectedResolvedStyle = {
        firstInclude: {
          number: 2,
        },
        secondInclude: {
          color: 'red',
          number: 3,
        },
        includingStyle: {
          number: 3,
          color: 'red',
        },
        firstIncludeNumber: {
          number: 2,
        },
        secondIncludeNumber: {
          number: 3,
        },
      };
      const includedStyle = resolveIncludes(target);

      assert.equal(
        includedStyle.includingStyle.number,
        target.secondIncludeNumber.number,
        'style not included properly'
      );
      assert.deepEqual(
        includedStyle,
        expectedResolvedStyle,
        'style not resolved properly'
      );
    });

    it('target style overrides it self properly', () => {
      const target = {
        numberInclude: {
          number: 1,
        },
        textInclude: {
          text: 'test',
        },
        includeAndOverride: {
          [INCLUDE]: ['numberInclude', 'textInclude'],
          number: 8,
        },
      };
      const includedStyle = resolveIncludes(target);

      assert.equal(
        includedStyle.includeAndOverride.number,
        target.includeAndOverride.number,
        'included style override defined style'
      );
      assert.equal(
        includedStyle.includeAndOverride.text,
        target.textInclude.text,
        'included style didn\'t override defined style'
      );
    });
  });

  describe('resolve target with base', () => {
    describe('resolve base depending includes', () => {
      it('includes styles from base', () => {
        const target = {
          includeSingleStyleFromBase: {
            [INCLUDE]: ['numberInclude'],
          },
          includeMultipleStyles: {
            [INCLUDE]: ['numberInclude', 'textInclude'],
          },
        };
        const base = {
          numberInclude: {
            number: 1,
          },
          textInclude: {
            text: 'test',
          },
        };
        const includedStyle = resolveIncludes(target, base);

        assert.equal(
          includedStyle.includeSingleStyleFromBase.number,
          base.numberInclude.number,
          'style not included properly'
        );
        assert.equal(
          includedStyle.includeMultipleStyles.number,
          base.numberInclude.number,
          'first style include not included properly'
        );
        assert.equal(
          includedStyle.includeMultipleStyles.text,
          base.textInclude.text,
          'second style include not included properly'
        );
      });

      it('base style overrides target properly', () => {
        const target = {
          includeAndOverride: {
            [INCLUDE]: ['numberInclude', 'textInclude'],
            number: 8,
          },
        };
        const base = {
          numberInclude: {
            number: 1,
          },
          textInclude: {
            text: 'test',
          },
        };
        const includedStyle = resolveIncludes(target, base);

        assert.equal(
          includedStyle.includeAndOverride.number,
          target.includeAndOverride.number,
          'included style override defined style'
        );
        assert.equal(
          includedStyle.includeAndOverride.text,
          base.textInclude.text,
          'included style didn\'t override defined style'
        );
      });

      it('throws error if base style has include and is required', () => {
        const target = {
          includeSingleStyleFromBase: {
            [INCLUDE]: ['numberInclude'],
          },
        };
        const base = {
          numberInclude: {
            [INCLUDE]: ['Test'],
            number: 1,
          },
        };

        assert.throws(() => {
          resolveIncludes(target, base);
        }, 'Base style cannot have includes');
      });
    });

    describe('resolve target and base depending includes', () => {
      it('includes styles from both', () => {
        const target = {
          numberInclude: {
            number: 1,
          },
          textInclude: {
            text: 'test',
          },
          includeSingleStyle: {
            [INCLUDE]: ['numberInclude'],
            width: 100,
          },
          includeMultipleStyles: {
            [INCLUDE]: ['numberInclude', 'textInclude'],
          },
        };
        const base = {
          numberInclude: {
            number1: 4,
          },
          textInclude: {
            text1: 'test8',
          },
        };
        const includedStyle = resolveIncludes(target, base);

        assert.equal(
          includedStyle.includeSingleStyle.number,
          target.numberInclude.number,
          'style not included properly from target'
        );
        assert.equal(
          includedStyle.includeSingleStyle.number2,
          base.numberInclude.number2,
          'style not included properly from base'
        );

        assert.equal(
          includedStyle.includeMultipleStyles.number,
          target.numberInclude.number,
          'first style not included properly from target'
        );
        assert.equal(
          includedStyle.includeMultipleStyles.text,
          target.textInclude.text,
          'second style not included properly from target'
        );
        assert.equal(
          includedStyle.includeMultipleStyles.number1,
          base.numberInclude.number1,
          'first style not included properly from base'
        );
        assert.equal(
          includedStyle.includeMultipleStyles.text1,
          base.textInclude.text1,
          'second style not included properly from base'
        );
      });

      it('both overrides target style properly', () => {
        const target = {
          numberInclude: {
            number: 1,
          },
          textInclude: {
            text: 'test',
          },
          includeAndOverride: {
            [INCLUDE]: ['numberInclude', 'textInclude'],
            number: 8,
            text1: 'test7',
          },
        };
        const base = {
          numberInclude: {
            number1: 5,
          },
          textInclude: {
            text1: 'test',
          },
        };
        const includedStyle = resolveIncludes(target, base);

        assert.equal(
          includedStyle.includeAndOverride.number,
          target.includeAndOverride.number,
          'included target style override defined style'
        );
        assert.equal(
          includedStyle.includeAndOverride.text1,
          target.includeAndOverride.text1,
          'included base style override defined style'
        );
        assert.equal(
          includedStyle.includeAndOverride.text,
          target.textInclude.text,
          'included target style didn\'t override defined style'
        );
        assert.equal(
          includedStyle.includeAndOverride.number1,
          base.numberInclude.number1,
          'included base style didn\'t override defined style'
        );
      });
    });
  });

  describe('resolve circular includes', () => {
    it('throws error on circular include from target', () => {
      const target = {
        testInclude: {
          [INCLUDE]: ['circular'],
        },
        circular: {
          [INCLUDE]: ['testInclude'],
        },
      };

      assert.throws(() => {
        resolveIncludes(target);
      }, 'Circular style include');
    });
    it('throws error on circular nested include from target', () => {
      const target = {
        testInclude: {
          [INCLUDE]: ['circular'],
        },
        circular: {
          test: {
            [INCLUDE]: ['testInclude'],
          },
        },
      };

      assert.throws(() => {
        resolveIncludes(target);
      }, 'Circular style include');
    });
  });

  describe('resolves invalid include values', () => {
    it('successfully with non existing include value', () => {
      const target = {
        testInclude: {
          [INCLUDE]: ['123'],
          test: 5,
        },
      };
      const includedStyles = resolveIncludes(target);
      assert.equal(
        includedStyles.testInclude.test,
        target.testInclude.test,
        'style not resolved properly'
      );
    });
    it('successfully with empty include value', () => {
      const target = {
        testInclude: {
          [INCLUDE]: [],
          test: 5,
        },
      };
      const includedStyles = resolveIncludes(target);

      assert.equal(
        includedStyles.testInclude.test,
        target.testInclude.test,
        'style not resolved properly'
      );
    });
    it('throws error if include not array but is "true"', () => {
      assert.throws(() => {
        resolveIncludes({
          testInclude: {
            [INCLUDE]: 's',
          },
        });
      }, 'Include should be array');
      assert.throws(() => {
        resolveIncludes({
          testInclude1: {
            [INCLUDE]: 1,
          },
        });
      }, 'Include should be array');
    });
    it('without error if include is "not"', () => {
      const undefinedInclude = {
        testInclude: {
          [INCLUDE]: undefined,
          test: 1,
        },
      };
      const falseInclude = {
        testInclude: {
          [INCLUDE]: false,
          test: 1,
        },
      };
      delete undefinedInclude.testInclude[INCLUDE];
      delete falseInclude.testInclude[INCLUDE];

      assert.deepEqual(
        resolveIncludes(undefinedInclude),
        undefinedInclude,
        'undefined include not resolved properly'
      );
      assert.deepEqual(
        resolveIncludes(falseInclude),
        falseInclude,
        'false include not resolved properly'
      );
    });
  });
});
