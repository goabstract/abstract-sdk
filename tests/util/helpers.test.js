// @flow
import * as utils from "../../src/util/helpers";
import { API_CLIENT } from "../../src/util/testing";

describe("helpers", () => {
  test("inferShareId", () => {
    expect(
      utils.inferShareId({
        url: "share.goabstract.com/share-id"
      })
    ).toBe("share-id");
    expect(
      utils.inferShareId({
        url: "share.abstract.com/share-id-2"
      })
    ).toBe("share-id-2");
  });

  test("inferShareId throws", () => {
    let error;
    try {
      utils.inferShareId(({}: any));
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(Error);
    expect(error && error.message).toContain("Could not infer share id");
  });

  test("isNodeEnvironment", () => {
    expect(utils.isNodeEnvironment()).toBe(true);
  });

  test("wrap", () => {
    const value = { foo: "bar" };
    const response = { ...value, baz: "qux" };
    expect(API_CLIENT.unwrap(utils.wrap(value, response))).toEqual(response);
  });
});
