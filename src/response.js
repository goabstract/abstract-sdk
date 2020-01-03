// @flow
export function wrap(value: any, response: any) {
  value = Array.isArray(value) ? [...value] : { ...response };
  Object.defineProperty(value, "_response", {
    enumerable: false,
    value: response
  });
  return value;
}

export function unwrap(value: any) {
  return value._response;
}
