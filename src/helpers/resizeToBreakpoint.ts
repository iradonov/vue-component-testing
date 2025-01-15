import { ScreenSize } from "vitest";
import { nextTick } from "vue";

// @ts-expect-error Need to parse screens from tailwind configuration or user-provided object
const { sm, md, lg, xl } = {};

const breakpoints: Record<ScreenSize, number> = {
  "xs-max": Number.parseInt(sm, 10) - 1,
  sm: Number.parseInt(sm, 10),
  "sm-max": Number.parseInt(md, 10) - 1,
  md: Number.parseInt(md, 10),
  "md-max": Number.parseInt(lg, 10) - 1,
  lg: Number.parseInt(lg, 10),
  "lg-max": Number.parseInt(xl, 10) - 1,
  xl: Number.parseInt(xl, 10),
};

export default function resizeToBreakpoint(
  screen: ScreenSize,
  height = 640
): Promise<void> {
  const width = breakpoints[screen];
  window.resizeTo(width, height);
  return nextTick();
}
