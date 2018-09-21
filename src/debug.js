// @flow
import baseDebug from "debug";

function getCircularReplacer() {
  const seen = new WeakSet();

  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return;

      seen.add(value);
    }

    return value;
  };
}

export default function debug(key: string) {
  return baseDebug(`abstract:${key}`);
}

export function debugArgs(key: string) {
  const log = debug(key);

  return (...args: *) => {
    log(JSON.stringify(args, getCircularReplacer(), 2));
    return args;
  };
}
