// @flow
type Value = {} | [];
type Envelope<T: Value> = T & { _response?: {} };

export function wrap<T: Value>(value: Envelope<T>, response?: {}): Envelope<T> {
  response = response || value;
  Object.defineProperty(value, "_response", {
    enumerable: false,
    value: Array.isArray(response) ? [...response] : { ...(response: {}) }
  });
  return value;
}

export function unwrap(value: any) {
  return value._response;
}
