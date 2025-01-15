import { VueWrapper } from "@vue/test-utils";
import { StoreGeneric } from "pinia";

/* eslint-disable-next-line max-params */
async function toBeInActionStateWhile(
  store: StoreGeneric,
  actionState: string,
  dispatchFn: (...args: any[]) => Promise<unknown>,
  ...args: any[]
) {
  const promise = dispatchFn(...args);
  const pass = store.actionState === actionState;
  await promise;
  return {
    pass,
    message: () =>
      `Expected ${store.$id}.actionState to be ${actionState} but got "${store.actionState}"`,
  };
}

function toHaveClasses(
  received: VueWrapper,
  classes: string,
  hasClasses = true
) {
  const includesClasses = classes
    .split(" ")
    .every((cls) => received.classes(cls));
  const not = hasClasses ? " " : "not ";
  return {
    message: () =>
      `expected classes '${classes}' ${not}to exist on wrapper, but wrapper classes are '${received.classes()}'`,
    pass: hasClasses ? includesClasses : !includesClasses,
  };
}

export default {
  toBeInActionStateWhile,
  toHaveClasses,
};
