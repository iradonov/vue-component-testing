import {
  Store,
  StoreActions,
  StoreDefinition,
  StoreGetters,
  StoreState,
} from "pinia";
import { Mock } from "vitest";
import { nextTick } from "vue";
import { MockActions, WritableGetters } from "../pinia/mockedStore";

export default async function createWrapperStore<T extends Fn>(
  useStore: T,
  payload: Partial<StoreState<ReturnType<T>>> &
    Partial<StoreGetters<ReturnType<T>>> &
    Partial<Record<keyof StoreActions<ReturnType<T>>, Mock>>
): Promise<
  T extends StoreDefinition<infer Id, infer State, infer Getters, infer Actions>
    ? Store<Id, State, Record<string, never>, MockActions<Actions>> &
        WritableGetters<Getters>
    : ReturnType<T>
> {
  const store = useStore();
  Object.keys(payload).forEach((getter) => {
    store[getter] = payload[getter];
  });
  await nextTick();
  return store;
}
