import { createTestingPinia } from "@pinia/testing";
import {
  mount,
  RouterLinkStub,
  shallowMount,
  VueWrapper,
} from "@vue/test-utils";
import { StateTree } from "pinia";
import { defineComponent, h, Directive, Plugin } from "vue";

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

const RouterViewStub = defineComponent({
  name: "RouterViewStub",
  // eslint-disable-next-line vue/component-api-style
  render() {
    return h("div");
  },
});

export default function createWrapperFactory(
  component: any,
  options: WrapperOptions | (() => WrapperOptions) = {}
) {
  // eslint-disable-next-line func-names
  return function (
    customProps?: Record<string, unknown>,
    customOptions: Record<string, unknown> = {}
  ) {
    const optionsValue = typeof options === "function" ? options() : options;
    const { initialState } = optionsValue;
    const {
      props = {},
      stubs = {},
      mocks = {},
      plugins = [],
      directives = {},
      slots = {},
      deep = false,
      attachToDocument = false,
    } = {
      ...optionsValue,
      ...customOptions,
    };
    const mountFn = deep ? mount : shallowMount;
    const wrapper: VueWrapper = mountFn(component, {
      props: {
        ...props,
        ...customProps,
      },
      global: {
        stubs,
        mocks,
        plugins: [
          createTestingPinia({
            initialState,
          }),
          ...plugins,
        ],
        directives,
        components: {
          RouterLink: RouterLinkStub,
          RouterView: RouterViewStub,
        },
      },
      slots,
      attachTo: prepareDom(attachToDocument),
    });

    return wrapper;
  };
}

function prepareDom(attachToDocument: boolean) {
  return attachToDocument
    ? document.body.appendChild(document.createElement("div"))
    : undefined;
}
