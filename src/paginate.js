// @flow
import type { CursorPromise } from "./types";

export default function paginate<T>(
  cursor: CursorPromise<T>
): AsyncIterable<T> {
  // $FlowFixMe: Flow lacks Symbol support https://github.com/facebook/flow/issues/3258
  return {
    initial: true,
    // $FlowFixMe: Flow lacks Symbol support https://github.com/facebook/flow/issues/3258
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      const value = this.initial ? await cursor : await cursor.next();
      this.initial = false;
      return { value, done: !value };
    }
  };
}
