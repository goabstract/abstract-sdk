// @flow
import { CursorPromise } from "@core/types";

export function paginate<T>(cursor: CursorPromise<T>): AsyncIterable<T> {
  // $FlowFixMe: Flow lacks Symbol support https://github.com/facebook/flow/issues/3258
  return {
    initial: true,
    // $FlowFixMe: Flow lacks Symbol support https://github.com/facebook/flow/issues/3258
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      cursor = this.initial ? cursor : cursor.next();
      const value = await cursor;
      this.initial = false;
      return { value, done: !value };
    }
  };
}
