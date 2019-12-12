// @flow
import * as utils from "../../src/util/helpers";

describe("helpers", () => {
  test("inferShareId", () => {
    expect(
      utils.inferShareId({
        url: "share.goabstract.com/share-id"
      })
    ).toBe("share-id");
  });

  test("inferShareId throws", () => {
    try {
      utils.inferShareId(({}: any));
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toContain("Could not infer share id");
    }
  });

  test("isNodeEnvironment", () => {
    expect(utils.isNodeEnvironment()).toBe(true);
  });
});
