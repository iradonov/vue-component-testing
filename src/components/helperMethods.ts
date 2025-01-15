/* eslint-disable jest/no-conditional-in-test */
import { DOMWrapper } from "@vue/test-utils";
import {
  TestCaseAttribute,
  TestCaseEmitsOnClick,
  TestCaseHasClasses,
  TestCasePropValue,
  TestCaseRenders,
  TestCaseRendersText,
  TestSelector,
  WrapperFunction,
} from "vitest";
import { nextTick } from "vue";
import {
  createTestName,
  findComponentSelector,
  findSelector,
  getSelectorName,
  setupTest,
} from "./helperMethodsUtils";

function testRenders(
  selector: TestSelector,
  testCases: TestCaseRenders[],
  createWrapper: WrapperFunction
) {
  if (!testCases.length) {
    return;
  }

  const extendedCases = testCases.map((testCase) => ({
    ...testCase,
    selector,
    renders: testCase.isRendered ? "renders" : "does not render",
  }));
  describe("testRenders", () => {
    extendedCases.map((testCase) =>
      test(
        createTestName(
          `${testCase.renders} ${getSelectorName(selector)}`,
          testCase
        ),
        async () => {
          expect.hasAssertions();
          const { isRendered, isInitiallyRendered = false } = testCase;
          const wrapper = await setupTest(testCase, createWrapper, {
            onClick: (wrp) => {
              expect(findSelector(wrp, selector).exists()).toBe(
                isInitiallyRendered
              );
            },
          });
          expect(findSelector(wrapper, selector).exists()).toBe(isRendered);
        }
      )
    );
  });
}

function testRendersText(
  selector: TestSelector,
  testCases: string | TestCaseRendersText[],
  createWrapper: WrapperFunction
) {
  if (!testCases.length) {
    return;
  }

  const cases =
    typeof testCases === "string" ? [{ value: testCases }] : testCases;
  const extendedCases = cases.map((testCase) => ({
    ...testCase,
    selector,
  }));
  describe("testRendersText", () => {
    extendedCases.map((testCase) =>
      test(
        createTestName(
          `renders ${testCase.value} in ${getSelectorName(selector)}`,
          testCase
        ),
        async () => {
          expect.assertions(1);
          const { value, contains } = testCase;
          const wrapper = await setupTest(testCase, createWrapper);
          const selectorText = findSelector(wrapper, selector).text();
          if (contains) {
            expect(selectorText).toContain(value);
          } else {
            expect(selectorText).toBe(value);
          }
        }
      )
    );
  });
}

function testPropValue(
  selector: TestSelector,
  testCases: TestCasePropValue[],
  createWrapper: WrapperFunction
) {
  if (!testCases.length) {
    return;
  }

  const extendedCases = testCases.map((testCase) => ({
    ...testCase,
    selector,
  }));
  describe("testPropValue", () => {
    extendedCases.map((testCase) =>
      test(
        createTestName(
          `passes ${testCase.prop} prop to ${getSelectorName(
            selector
          )} with value $value`,
          testCase
        ),
        async () => {
          expect.assertions(1);
          const { prop, value } = testCase;
          const wrapper = await setupTest(testCase, createWrapper);
          expect(
            findComponentSelector(wrapper, selector).props(prop)
          ).toStrictEqual(value);
        }
      )
    );
  });
}

function testAttribute(
  selector: TestSelector,
  testCases: TestCaseAttribute[],
  createWrapper: WrapperFunction
) {
  if (!testCases.length) {
    return;
  }

  describe("testAttribute", () => {
    testCases.map((testCase) =>
      test(
        createTestName(
          `passes ${testCase.value} to ${getSelectorName(selector)} ${
            testCase.attribute
          } attribute`,
          testCase
        ),
        async () => {
          expect.assertions(1);
          const { attribute, value } = testCase;
          const wrapper = await setupTest(testCase, createWrapper);
          expect(findSelector(wrapper, selector).attributes(attribute)).toBe(
            value
          );
        }
      )
    );
  });
}

function testModelValue(
  selector: TestSelector,
  {
    prop = "modelValue",
    initialValue,
    updatedValue,
    trim = false,
    native = false,
  }: {
    prop?: string;
    initialValue: any;
    updatedValue: any;
    trim?: boolean;
    native?: boolean;
  },
  createWrapper: WrapperFunction
) {
  const emittedValue = trim ? ` ${updatedValue} ` : updatedValue;
  const trimmed = trim ? "trimmed " : "";

  if (native) {
    describe(`${getSelectorName(selector)} input v-model`, () => {
      test(`passes updated ${trimmed}value to input when input value is set to "${emittedValue}"`, async () => {
        expect.assertions(2);
        const wrapper = createWrapper();
        const selectorWrapper: DOMWrapper<HTMLInputElement> =
          wrapper.find(selector);
        expect(selectorWrapper.element.value).toStrictEqual(initialValue);

        await selectorWrapper.setValue(emittedValue);
        expect(selectorWrapper.element.value).toStrictEqual(updatedValue);
      });
    });
  } else {
    describe(`${getSelectorName(selector)} v-model`, () => {
      testPropValue(selector, [{ prop, value: initialValue }], createWrapper);

      test(`passes updated ${trimmed}value to component ${prop} prop when component emits "update:${prop}" with ${emittedValue}`, async () => {
        expect.assertions(1);
        const wrapper = createWrapper();
        const selectorWrapper = wrapper.findComponent(selector);
        selectorWrapper.vm.$emit(`update:${prop}`, emittedValue);
        await nextTick();
        expect(selectorWrapper.props(prop)).toStrictEqual(updatedValue);
      });
    });
  }
}

function testHasClasses(
  selector: TestSelector,
  testCases: TestCaseHasClasses[],
  createWrapper: WrapperFunction
) {
  if (!testCases.length) {
    return;
  }

  const extendedCases = testCases.map((testCase) => ({
    ...testCase,
    selector,
    renders: testCase.hasClasses === false ? "does not render" : "renders",
  }));
  describe(`testHasClasses for selector ${getSelectorName(selector)}`, () => {
    extendedCases.map((testCase, index) =>
      test(
        createTestName(
          `${index}. ${testCase.renders} ${testCase.classes}`,
          testCase
        ),
        async () => {
          expect.assertions(1);
          const { classes, hasClasses = true } = testCase;
          const wrapper = await setupTest(testCase, createWrapper);
          expect(findSelector(wrapper, selector)).toHaveClasses(
            classes,
            hasClasses
          );
        }
      )
    );
  });
}

function testEmitsOnClick(
  testCases: TestCaseEmitsOnClick[],
  createWrapper: WrapperFunction
) {
  if (!testCases.length) {
    return;
  }

  describe("testEmitsOnClick", () => {
    testCases.map((testCase) =>
      test(
        createTestName(
          `emits "${testCase.event}" event when ${testCase.target} is clicked`,
          testCase
        ),
        async () => {
          expect.assertions(1);
          const { target, event, payload = [] } = testCase;
          const wrapper = await setupTest(testCase, createWrapper);
          findSelector(wrapper, target).trigger("click");
          await nextTick();
          expect(wrapper).toHaveEmittedOnceWith(event, ...payload);
        }
      )
    );
  });
}

export {
  testRenders,
  testRendersText,
  testPropValue,
  testAttribute,
  testModelValue,
  testHasClasses,
  testEmitsOnClick,
};
