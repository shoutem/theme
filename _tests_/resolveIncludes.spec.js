import resolveIncludes, { INCLUDE } from '../src/resolveIncludes';

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

      expect(includedStyle.includeSingleStyle.number).toEqual(
        target.numberInclude.number,
      );
      expect(includedStyle.includeMultipleStyles.number).toEqual(
        target.numberInclude.number,
      );
      expect(includedStyle.includeMultipleStyles.text).toEqual(
        target.textInclude.text,
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

      expect(includedStyle.includingStyle.number).toEqual(
        target.secondIncludeNumber.number,
      );
      expect(includedStyle).toEqual(expectedResolvedStyle);
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

      expect(includedStyle.includeAndOverride.number).toEqual(
        target.includeAndOverride.number,
      );
      expect(includedStyle.includeAndOverride.text).toEqual(
        target.textInclude.text,
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

        expect(includedStyle.includeSingleStyleFromBase.number).toEqual(
          base.numberInclude.number,
        );
        expect(includedStyle.includeMultipleStyles.number).toEqual(
          base.numberInclude.number,
        );
        expect(includedStyle.includeMultipleStyles.text).toEqual(
          base.textInclude.text,
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

        expect(includedStyle.includeAndOverride.number).toEqual(
          target.includeAndOverride.number,
        );
        expect(includedStyle.includeAndOverride.text).toEqual(
          base.textInclude.text,
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

        expect(() => {
          resolveIncludes(target, base);
        }).toThrow();
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

        expect(includedStyle.includeSingleStyle.number).toEqual(
          target.numberInclude.number,
        );
        expect(includedStyle.includeSingleStyle.number2).toEqual(
          base.numberInclude.number2,
        );

        expect(includedStyle.includeMultipleStyles.number).toEqual(
          target.numberInclude.number,
        );
        expect(includedStyle.includeMultipleStyles.text).toEqual(
          target.textInclude.text,
        );
        expect(includedStyle.includeMultipleStyles.number1).toEqual(
          base.numberInclude.number1,
        );
        expect(includedStyle.includeMultipleStyles.text1).toEqual(
          base.textInclude.text1,
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

        expect(includedStyle.includeAndOverride.number).toEqual(
          target.includeAndOverride.number,
        );
        expect(includedStyle.includeAndOverride.text1).toEqual(
          target.includeAndOverride.text1,
        );
        expect(includedStyle.includeAndOverride.text).toEqual(
          target.textInclude.text,
        );
        expect(includedStyle.includeAndOverride.number1).toEqual(
          base.numberInclude.number1,
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

      expect(() => {
        resolveIncludes(target);
      }).toThrow();
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

      expect(() => {
        resolveIncludes(target);
      }).toThrow();
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
      expect(includedStyles.testInclude.test).toEqual(target.testInclude.test);
    });
    it('successfully with empty include value', () => {
      const target = {
        testInclude: {
          [INCLUDE]: [],
          test: 5,
        },
      };
      const includedStyles = resolveIncludes(target);

      expect(includedStyles.testInclude.test).toEqual(target.testInclude.test);
    });
    it('throws error if include not array but is "true"', () => {
      expect(() => {
        resolveIncludes({
          testInclude: {
            [INCLUDE]: 's',
          },
        });
      }).toThrow();
      expect(() => {
        resolveIncludes({
          testInclude1: {
            [INCLUDE]: 1,
          },
        });
      }).toThrow();
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

      expect(resolveIncludes(undefinedInclude)).toEqual(undefinedInclude);
      expect(resolveIncludes(falseInclude)).toEqual(falseInclude);
    });
  });
});
