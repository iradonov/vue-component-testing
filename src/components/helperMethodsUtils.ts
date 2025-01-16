import { VueWrapper } from "@vue/test-utils";
import { StoreData, TestCase, TestSelector, WrapperFunction } from "vitest";
import resizeToBreakpoint from "../helpers/resizeToBreakpoint";
import createWrapperStore from "./createWrapperStore";

function createTestName(assertion: string, testCase: TestCase) {
  const props = testCase.props
    ? `props are ${JSON.stringify(testCase.props)}`
    : "";
  const screenSize = testCase.screenSize
    ? `screen size is ${testCase.screenSize}`
    : "";
  const store =
    testCase.storeData && typeof testCase.storeData !== "function"
      ? `${(testCase.storeData[0] as any).$id} store has data ${JSON.stringify(
          testCase.storeData[1]
        )}`
      : "";
  const route = testCase.routeData
    ? `route is ${JSON.stringify(testCase.routeData)}`
    : "";
  const onClick = testCase.onClick ? `${testCase.onClick} is clicked` : "";
  const descriptions = [props, screenSize, store, route, onClick];
  const formatter = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction",
  });
  let formattedDescriptions = formatter.format(
    descriptions.filter((value) => value.length)
  );
  formattedDescriptions &&= `when ${formattedDescriptions}`;
  return `${assertion} ${formattedDescriptions}`;
}

function hasMultipleStores(
  storeData: Exclude<TestCase["storeData"], Fn | undefined>
): storeData is StoreData[] {
  return Array.isArray(storeData[0]);
}

async function setupTest(
  { screenSize, storeData, props, mockRoute, routeData, onClick }: TestCase,
  createWrapper: WrapperFunction,
  callbacks: Partial<Record<keyof TestCase, Fn>> = {}
) {
  if (screenSize) {
    resizeToBreakpoint(screenSize);
  }

  if (mockRoute) {
    Object.assign(mockRoute, routeData ?? {});
  }

  const wrapper = createWrapper(props);
  if (storeData) {
    if (typeof storeData === "function") {
      await storeData();
    } else if (hasMultipleStores(storeData)) {
      await Promise.all(
        storeData.map((store) => createWrapperStore(store[0], store[1]))
      );
    } else {
      await createWrapperStore(storeData[0], storeData[1]);
    }
  }

  if (onClick) {
    callbacks.onClick?.(wrapper);
    await findSelector(wrapper, onClick).trigger("click");
  }

  return wrapper;
}

function findSelector(wrapper: VueWrapper, selector: TestSelector) {
  if (selector instanceof Function) {
    return selector(wrapper);
  }

  if (typeof selector === "string") {
    return wrapper.find(selector);
  }

  return wrapper.findComponent(selector);
}

function findComponentSelector(wrapper: VueWrapper, selector: TestSelector) {
  if (selector instanceof Function) {
    return selector(wrapper);
  }

  return wrapper.findComponent(selector);
}

function getSelectorName(selector: TestSelector) {
  return typeof selector === "string"
    ? selector
    : selector.name ?? selector.__name;
}

export {
  createTestName,
  setupTest,
  findSelector,
  findComponentSelector,
  getSelectorName,
};
