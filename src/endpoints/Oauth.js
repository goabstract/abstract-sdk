// @flow
import { BaseError } from "../errors";
import type { OAuthURLqueries } from "../types";
import Endpoint from "../endpoints/Endpoint";

export default class OAuth extends Endpoint {
  name = "oauth";

  generateUrl(descriptor: OAuthURLqueries) {
    const clientId = descriptor.clientId || this.options.clientId;
    const state = descriptor.state;
    let redirectUri = descriptor.redirectUri || this.options.redirectUri;

    if (!clientId || !state || !redirectUri) {
      throw new BaseError(
        "Client credentials are missing. Please doublecheck clientId, redirectUri and state"
      );
    }

    redirectUri = encodeURIComponent(redirectUri);

    return `https://app.abstract.com/signin/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=all&state=${state}`;
  }
}
