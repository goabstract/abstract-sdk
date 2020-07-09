// @flow
import { API_CLIENT } from "../../src/util/testing";

describe("organizations", () => {
  describe("generateUrl - with client options", () => {
    test("api", async () => {
      const [clientId, redirectUri, state] = [
        "clientId",
        "redirectUri",
        "state"
      ];

      const url = API_CLIENT.oauth.generateUrl({
        clientId,
        redirectUri,
        state
      });

      expect(url).toEqual(
        `https://app.abstract.com/signin/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=all&state=${state}`
      );
    });
  });
});
