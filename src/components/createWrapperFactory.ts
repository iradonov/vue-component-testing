import { createTestingPinia } from "@pinia/testing";
import {
  mount,
  RouterLinkStub,
  shallowMount,
  VueWrapper,
} from "@vue/test-utils";
import { WrapperOptions } from "vitest";
import { defineComponent, h } from "vue";

const RouterViewStub = defineComponent({
  name: "RouterViewStub",
  render() {
    return h("div");
  },
});

export default function createWrapperFactory(
  component: any,
  options: WrapperOptions | (() => WrapperOptions) = {}
) {
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
