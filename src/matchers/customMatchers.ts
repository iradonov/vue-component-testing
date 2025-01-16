import { VueWrapper } from "@vue/test-utils";

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
  toHaveClasses,
};
