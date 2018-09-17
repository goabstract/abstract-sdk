// @flow
import Client from "./";

describe(Client, () => {
  describe("without module cache to reset process.env", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("configures options.abstractToken from process.env.ABSTRACT_TOKEN", () => {
      process.env.ABSTRACT_TOKEN = "token-from-env";
      const { default: Client } = require("./");
      expect(Client().abstractToken).toBe("token-from-env");
    });

    test("prefers options.abstractToken over process.env.ABSTRACT_TOKEN", () => {
      process.env.ABSTRACT_TOKEN = "token-from-env";
      const { default: Client } = require("./");
      expect(
        Client({
          abstractToken: "token-from-options"
        }).abstractToken
      ).toBe("token-from-options");
    });
  });
});
