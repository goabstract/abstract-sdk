// @flow
import abstractClient from "./";

describe(abstractClient, () => {
  describe("without module cache to reset process.env", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("configures options.abstractToken from process.env.ABSTRACT_TOKEN", () => {
      process.env.ABSTRACT_TOKEN = "token-from-env";
      const { default: abstractClient } = require("./");
      expect(abstractClient().abstractToken).toBe("token-from-env");
    });

    test("prefers options.abstractToken over process.env.ABSTRACT_TOKEN", () => {
      process.env.ABSTRACT_TOKEN = "token-from-env";
      const { default: abstractClient } = require("./");
      expect(
        abstractClient({
          abstractToken: "token-from-options"
        }).abstractToken
      ).toBe("token-from-options");
    });
  });
});
