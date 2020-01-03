// @flow
type Value = {} | [];
type Envelope<T: Value> = T & { _response?: {} };

export function wrap<T: Value>(value: Envelope<T>, response: {}): Envelope<T> {
  Object.defineProperty(value, "_response", {
    enumerable: false,
    value: { ...response }
  });
  return value;
}

export function unwrap(value: any) {
  return value._response;
}
