// @flow
export function wrap(value: any, response?: any) {
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
