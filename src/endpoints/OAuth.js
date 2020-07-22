// @flow
import { BaseError } from "../errors";
import type {
  OAuthAuthorizeInput,
  OAuthTokenInput,
  TokenResponseData
} from "../types";
import Endpoint from "../endpoints/Endpoint";

export default class OAuth extends Endpoint {
  name = "oauth";

  getToken(input: OAuthTokenInput) {
    const clientId = input.clientId || this.options.clientId;
    const clientSecret = input.clientSecret || this.options.clientSecret;
    const redirectUri = input.redirectUri || this.options.redirectUri;
    const { authorizationCode } = input;

    const body = new URLSearchParams();

    if (!clientId || !clientSecret || !redirectUri || !authorizationCode) {
      throw new Error("OAuthTokenInput required");
    }

    body.append("client_id", clientId);
    body.append("client_secret", clientSecret);
    body.append("redirect_uri", redirectUri);

    body.append("code", authorizationCode);
    body.append("grant_type", "authorization_code");

    return this.configureRequest<Promise<TokenResponseData>>("getToken", {
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

        return response.access_token;
      }
    });
  }

  generateAuthorizeUrl(input: OAuthAuthorizeInput): string {
    const clientId = input.clientId || this.options.clientId;
    const state = input.state;
    const redirectUri = input.redirectUri || this.options.redirectUri;

    if (!clientId || !state || !redirectUri) {
      throw new BaseError(
        "Client credentials are missing. Please double check clientId, redirectUri and state"
      );
    }

    return `https://app.abstract.com/signin/auth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=all&state=${state}`;
  }
}
