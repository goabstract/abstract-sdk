import { mockAuth, API_CLIENT } from "../../src/util/testing";

describe("oauth", () => {
  describe("getToken", () => {
    const [clientId, clientSecret, redirectUri, authorizationCode] = [
      "client_id",
      "client_secret",
      "redirect_uri",
      "authorization_code"
    ];
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

    test("api - without clientId", async () => {
      expect(() =>
        API_CLIENT.oauth.getToken({
          clientSecret,
          redirectUri,
          authorizationCode
        })
      ).toThrowError();
    });

    test("api - without clientSecret", async () => {
      expect(() =>
        API_CLIENT.oauth.getToken({
          clientId,
          redirectUri,
          authorizationCode
        })
      ).toThrowError();
    });

    test("api - without redirectUri", async () => {
      expect(() =>
        API_CLIENT.oauth.getToken({
          clientId,
          clientSecret,
          authorizationCode
        })
      ).toThrowError();
    });

    test("api - without authorizationCode", async () => {
      expect(() =>
        API_CLIENT.oauth.getToken({
          clientId,
          clientSecret,
          redirectUri
        })
      ).toThrowError();
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
        `https://app.abstract.com/signin/auth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=all&state=${state}`
      );
    });

    test("options are not passed", () => {
      expect(() => API_CLIENT.oauth.generateAuthorizeUrl({})).toThrowError();
    });
  });
});
