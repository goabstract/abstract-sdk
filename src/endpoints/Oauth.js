// @flow
import { BaseError } from "../errors";
import type { AuthorizeToken, TokenResponseData } from "../types";
import Endpoint from "../endpoints/Endpoint";
import Client from "../Client";

export default class Oauth extends Endpoint {
  name = "oauth";

  getToken(descriptor: AuthorizeToken) {
    const clientId = descriptor.clientId || this.options.clientId;
    const clientSecret = descriptor.clientSecret || this.options.clientSecret;
    let redirectUri = descriptor.redirectUri || this.options.redirectUri;
    const { authorizationCode } = descriptor;

    const body = new URLSearchParams();

    body.append("client_id", clientId);
    body.append("client_secret", clientSecret);
    body.append("code", authorizationCode);
    body.append("grant_type", "authorization_code");
    body.append("redirect_uri", redirectUri);

    return this.configureRequest<Promise<TokenResponseData>>("info", {
      api: async () => {
        const response = await this.apiRequest(
          `auth/tokens`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body
          },
          {
            customHostname: "https://auth.goabstract.com"
          }
        );

        if (!!response.error) {
          throw new BaseError(`Error: ${response.error}`);
        } else {
          return response.access_token;
        }
      }
    });
  }

  setToken(accessToken: string) {
    return new Client({
      ...this.options,
      accessToken
    });
  }
}
