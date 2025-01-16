declare global {
  interface Fn<T = any> {
    (...arg: T[]): T;
  }

  type Merge<T> = {
    [K in keyof T]: T[K];
  };

  type ValueOf<T> = T[keyof T];

  type RequiredByKeys<T, K extends keyof T = keyof T> = Merge<
    Required<Pick<T, K>> & Omit<T, K>
  >;

  type PartialDeep<T> = T extends object
    ? {
        [P in keyof T]?: PartialDeep<T[P]>;
      }
    : T;
}

export {};
