import { mockAuth, API_CLIENT } from "../../src/util/testing";

describe("oauth", () => {
  describe("getToken", () => {
    test("api - with data", async () => {
      mockAuth(
        "/auth/tokens",
        {
          access_token: "access_token",
          client_id: "client_id",
          created_at: "created_at",
          id: "id",
          scope: "scope",
          user_id: "user_id"
        },
        200,
        "post"
      );

      const response = await API_CLIENT.oauth.getToken({
        clientId: "client_id",
        clientSecret: "client_secret",
        redirectUri: "redirect_uri",
        authorizationCode: "authorization_code"
      });

      expect(response).toEqual("access_token");
    });

    test("api - without data", async () => {
      expect(() =>
        API_CLIENT.oauth.getToken({
          clientSecret: "client_secret",
          redirectUri: "redirect_uri",
          authorizationCode: "authorization_code"
        })
      ).toThrowError();
    });
  });

  describe("setToken", () => {
    test("set Client with new accessToken", () => {
      const client = API_CLIENT.oauth.setToken("accessToken");
      expect(client).toEqual(API_CLIENT);
    });
  });

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
