// @ts-expect-error Replace with custom implementation
import matchMediaPolyfill from "mq-polyfill";

if (typeof window !== "undefined") {
  matchMediaPolyfill(window);

  window.resizeTo = function resizeTo(width, height) {
    Object.assign(this, {
      innerWidth: width,
      innerHeight: height,
      outerWidth: width,
      outerHeight: height,
    }).dispatchEvent(new Event("resize"));
  };
}
