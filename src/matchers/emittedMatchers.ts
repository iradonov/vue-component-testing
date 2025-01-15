import { VueWrapper } from "@vue/test-utils";

type MatcherHint = (...args: any[]) => string;

function plural(s: string, n: number) {
  return `${s}${n === 1 ? "" : "s"}`;
}

function timesString(n: number) {
  return `${n} ${plural("time", n)}`;
}

function assertExpectedNumberOfEmits(
  received: VueWrapper,
  expectedTimes: number,
  event: string
) {
  const actualTimes = received?.emitted(event)?.length ?? 0;
  return {
    message: () =>
      `expected event '${event}' to have been emitted ${timesString(
        expectedTimes
      )}, but was emitted ${timesString(actualTimes)}`,
    pass: actualTimes === expectedTimes,
  };
}

function getMatcherHint(matcherHint: MatcherHint) {
  return matcherHint("toHaveEmittedOnceWith", "wrapper", "event", {
    secondArgument: "...arguments",
  });
}

// eslint-disable-next-line max-params
function assertPayload(
  received: VueWrapper,
  event: string,
  expected: any[],
  { equals, expand, utils }: any
) {
  const actual = received?.emitted?.(event)?.[0];
  return {
    message: () =>
      `${getMatcherHint(utils.matcherHint)}:\n${utils.diff(expected, actual, {
        expand,
      })}`,
    pass: equals(actual, expected, undefined, true),
  };
}

export default {
  toHaveEmittedTimes(received: VueWrapper, times: number, event: string) {
    return assertExpectedNumberOfEmits(received, times, event);
  },

  toHaveEmittedOnce(received: VueWrapper, event: string) {
    return assertExpectedNumberOfEmits(received, 1, event);
  },

  toHaveEmittedOnceWith(received: VueWrapper, event: string, ...args: any[]) {
    const expectedNumberOfEmits = assertExpectedNumberOfEmits(
      received,
      1,
      event
    );
    if (!expectedNumberOfEmits.pass) {
      return expectedNumberOfEmits;
    }

    return assertPayload(received, event, args, this);
  },
};
