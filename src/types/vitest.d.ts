import { VueWrapper } from "@vue/test-utils";
import { StateTree, StoreDefinition } from "pinia";
import { ClassComponent } from "primevue/ts-helpers";
import { Directive, Plugin, ComponentOptions } from "vue";
import { RouteLocationNormalizedLoaded } from "vue-router";

declare module "vitest" {
  interface MatcherResult {
    pass: boolean;
    message: () => string;
    actual?: unknown;
    expected?: unknown;
  }

  interface StoreSetupOptions {
    useStore: StoreDefinition;
    payload?: StateTree;
    getterPayload?: Record<string, unknown>;
  }

  type PrimeVueComponent = ClassComponent;

  type TestSelector =
    | string
    | PrimeVueComponent
    | ((wrapper: VueWrapper) => VueWrapper)
    | ComponentOptions<any, any, any, any, any>;

  type HelperMethod<
    T = TestCase,
    HasSelector = false,
    SingleValue = never
  > = HasSelector extends true
    ? (
        selector: TestSelector,
        testCases: T[] | SingleValue,
        createWrapper: WrapperFunction
      ) => void
    : (testCases: T[] | SingleValue, createWrapper: WrapperFunction) => void;

  type MatcherHint = (...args: any[]) => string;

  interface MockInstance {
    mockRejectedValue(obj?: any): this;
    mockRejectedValueOnce(obj?: any): this;
  }

  type ScreenSize =
    | "xs-max"
    | "sm"
    | "sm-max"
    | "md"
    | "md-max"
    | "lg"
    | "lg-max"
    | "xl";

  interface WrapperOptions {
    /**
     * Initial state for each store used, represented by an object with store id's as keys and states as values.
     * Note: This option is only for setting state properties.
     */
    initialState?: StateTree;
    /**
     * Props that are passed to the component.
     */
    props?: Record<string, any>;
    /**
     * Render all sub-components, instead of stubbing them. This uses mount, instead of shallowMount under the hood.
     */
    deep?: boolean;
    /**
     * Component stubs.
     */
    stubs?: Record<string, any>;
    /**
     * Component mocks.
     */
    mocks?: Record<string, any>;
    /**
     * Component slots.
     */
    slots?: Record<string, any>;
    /**
     * Plugins from libraries, e.g PrimeVue.
     */
    plugins?: Plugin[];
    /**
     * Directives registered at app level using app.directive('name', Directive). The value is object of type {name: Directive}.
     */
    directives?: Record<string, Directive>;
    /**
     * Mount the component inside the document. Useful when testing input fields or forms.
     */
    attachToDocument?: boolean;
  }

  type WrapperFunction = (
    customProps?: Record<string, unknown>,
    customOptions?: Record<string, unknown>
  ) => VueWrapper;

  type StoreData = [StoreDefinition<any, any, any, any>, Record<string, any>];

  interface TestCase {
    /**
     * (Optional) Props that should be passed to the component.
     */
    props?: Record<string, any>;
    /**
     * (Optional) Screen size, e.g. 'md' or 'xl'.
     */
    screenSize?: ScreenSize;
    /**
     * (Optional) Store data. There are three ways to specify the data:
     * - first argument is the useStore function and the second argument is an object with the state and getter properties
     *
     * Example:
     *
     * ```storeData: [useAuthStore, { user: { picture: 'abc' } }]```
     * - encapsulate the changes inside a function that wraps createWrapperStore, e.g. `storeData: createStore`
     * - when using multiple stores, use a nested array of tuples
     *
     * Example:
     *
     * ```storeData: [[useAuthStore, { user: { picture: 'abc' } }], [useTracksStore, { tracks: [] }]]```
     */
    storeData?:
      | StoreData
      | StoreData[]
      | (() => ReturnType<typeof createWrapperStore>);
    mockRoute?: MockRoute;
    routeData?: MockRoute;
    onClick?: string;
  }

  interface TestCaseRenders extends TestCase {
    /**
     * Specifies if the target should be rendered.
     */
    isRendered: boolean;
    /**
     * When the onClick option is set, specifies whether the selector should be initially rendered.
     */
    isInitiallyRendered?: boolean;
  }

  interface TestCaseRendersText extends TestCase {
    /**
     * Text that should be rendered in the selector.
     */
    value: string;
    /**
     * (Optional) When set to true, the test will assert that the value is contained in the text.
     */
    contains?: boolean;
  }

  interface TestCaseAttribute extends TestCase {
    /**
     * Attribute of the selector.
     */
    attribute: string;
    /**
     * Value of the attribute.
     */
    value: string | undefined;
  }

  type TestModelValue = (
    selector: TestSelector,
    payload: {
      /**
       * (Optional) The model value prop. Default is "modelValue".
       */
      prop?: string;
      /**
       * The initial value passed to the element.
       */
      initialValue: any;
      /**
       * The updated value when the component emits "update", or a value is set to the input.
       */
      updatedValue: any;
      /**
       * (Optional) Set to true when using the .trim modifier.
       */
      trim?: boolean;
      /**
       * (Optional) Set to true when testing input elements. Defaults to false.
       */
      native?: boolean;
    },
    createWrapper: WrapperFunction
  ) => any;

  interface TestCaseHasClasses extends TestCase {
    /**
     * Classes that should exist on the selector.
     */
    classes: string;
    /**
     * (Optional) Specifies if the class should be rendered. Default is true.
     */
    hasClasses?: boolean;
  }

  interface TestCasePropValue extends TestCase {
    /**
     * Prop name.
     */
    prop: string;
    /**
     * Prop value.
     */
    value: any;
  }

  interface TestCaseEmitsOnClick extends TestCase {
    /**
     * Target selector that should be clicked in order to emit the event.
     */
    target: TestSelector;
    /**
     * The name of the emitted event.
     */
    event: string;
    /**
     * The payload of the emitted event.
     */
    payload?: any[];
  }
}

declare module "@vitest/expect" {
  interface Assertion {
    toBeInActionStateWhile(
      actionState: string,
      dispatchFn: (...args: any[]) => Promise<any>,
      ...args: any[]
    ): Promise<MatcherResult>;
    toHaveEmittedTimes(times: number, event: string): MatcherResult;
    toHaveEmittedOnce(event: string): MatcherResult;
    toHaveEmittedOnceWith(event: string, ...expected: any[]): MatcherResult;
    toHaveClasses(classes: string, hasClasses?: boolean): MatcherResult;
  }
}

export type MockRoute = Partial<RouteLocationNormalizedLoaded>;
