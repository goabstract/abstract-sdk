// @flow
import { log } from "@core/util/debug";

describe("debug", () => {
  test("namespace", () => {
    const logger = log.extend("foo");
    expect(logger.namespace).toEqual("abstract:foo");
  });
});
