// @flow
import Client from "./";

describe(Client, () => {
  describe("without module cache to reset process.env", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("configures options.accessToken from process.env.ABSTRACT_TOKEN", () => {
      process.env.ABSTRACT_TOKEN = "token-from-env";
      const { default: Client } = require("./");
      expect(Client().accessToken).toBe("token-from-env");
    });

    test("prefers options.accessToken over process.env.ABSTRACT_TOKEN", () => {
      process.env.ABSTRACT_TOKEN = "token-from-env";
      const { default: Client } = require("./");
      expect(
        Client({
          accessToken: "token-from-options"
        }).accessToken
      ).toBe("token-from-options");
    });
  });
});
