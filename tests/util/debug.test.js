// @flow
import { log } from "../../src/util/debug";

describe("debug", () => {
  test("namespace", () => {
    const logger = log.extend("foo");
    expect(logger.namespace).toEqual("abstract:foo");
  });
});
