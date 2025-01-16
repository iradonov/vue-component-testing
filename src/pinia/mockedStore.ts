import { Store } from "pinia";
import { Mock } from "vitest";
import { ComputedRef } from "vue";

export type WritableGetters<Getters> = {
  [K in keyof Getters]: Getters[K] extends ComputedRef<infer T> ? T : never;
};

export type MockActions<Actions> = {
  [A in keyof Actions]: Actions[A] extends Fn ? Mock<Actions[A]> : Actions[A];
};

export default function mockedStore<TStore>(
  store: TStore
): TStore extends Store<infer Id, infer State, infer Getters, infer Actions>
  ? Store<Id, State, Record<string, never>, MockActions<Actions>> &
      WritableGetters<Getters>
  : TStore {
  return store as any;
}
