/* @flow */
import type { CursorMeta, CursorPromise, CursorResponse } from "../";

export default class Cursor<T> {
  lastResponse: ?Promise<CursorResponse<T> | void>;
  meta: CursorMeta;
  request: (meta?: CursorMeta) => Promise<CursorResponse<T>>;

  get promise(): CursorPromise<T> {
    return ((this: any): CursorPromise<T>);
  }

  _next(first?: boolean): CursorPromise<T> {
    const makeRequest = async () => {
      if (!first && !this.meta.nextOffset) return;
      const response = await this.request(this.meta);
      this.meta = response.meta;
      return response;
    };
    this.lastResponse = this.lastResponse
      ? this.lastResponse.then(makeRequest)
      : makeRequest();
    const promise = (this.lastResponse.then(
      response => response && response.data
    ): any);
    promise.next = this.next.bind(this);
    const cursorPromise = (promise: CursorPromise<T>);
    return cursorPromise;
  }

  constructor(request: (meta?: CursorMeta) => Promise<CursorResponse<T>>) {
    this.request = request;
  }

  then(
    onFulfilled: (data: T) => *,
    onRejected: (error: *) => *
  ): CursorPromise<T> {
    const cursorPromise = this._next(true);
    cursorPromise.then(onFulfilled, onRejected);
    return cursorPromise;
  }

  next(first?: boolean): CursorPromise<T> {
    return this._next();
  }
}
