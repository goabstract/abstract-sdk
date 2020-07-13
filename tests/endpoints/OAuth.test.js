import { API_CLIENT } from "../../src/util/testing";

describe("oauth", () => {
  describe("generateAuthUrl", () => {
    test("options are passed", () => {
      const [clientId, redirectUri, state] = [
        "clientId",
        "redirectUri",
        "state"
      ];

      const url = API_CLIENT.oauth.generateAuthorizeUrl({
        clientId,
        redirectUri,
        state
      });

      expect(url).toEqual(
        `https://app.abstract.com/signin/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=all&state=${state}`
      );
    });

    test("options are not passed", () => {
      expect(() => API_CLIENT.oauth.generateAuthorizeUrl({})).toThrowError();
    });
  });
});
