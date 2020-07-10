// @flow
import type {
  ShareDescriptor,
  ShareUrlDescriptor,
  OAuthAuthorizeInput
} from "../types";

import { BaseError } from "../errors";

function parseShareURL(url: string): ?string {
  return url.split(/share\.(?:go)?abstract\.com\//)[1];
}

export function inferShareId(
  shareDescriptor: ShareDescriptor | ShareUrlDescriptor
): string {
  let shareId;

  if (shareDescriptor.url) {
    shareId = parseShareURL(shareDescriptor.url);
  }

  if (shareDescriptor.shareId) {
    shareId = shareDescriptor.shareId;
  }

  if (!shareId) {
    throw new Error(
      `Could not infer share id from ShareDescriptor: "${JSON.stringify(
        shareDescriptor
      )}"`
    );
  }

  return shareId;
}

export function isNodeEnvironment(): boolean {
  return (
    typeof process !== "undefined" &&
    process.versions &&
    process.versions.node !== undefined
  );
}

export function wrap(value: any, response?: any) {
  response = response || value;
  Object.defineProperty(value, "_response", {
    enumerable: false,
    value: Array.isArray(response) ? [...response] : { ...(response: {}) }
  });
  return value;
}

export function generateAuthorizeUrl(input: OAuthAuthorizeInput): string {
  const clientId = input.clientId || this.options.clientId;
  const state = input.state;
  let redirectUri = input.redirectUri || this.options.redirectUri;

  if (!clientId || !state || !redirectUri) {
    throw new BaseError(
      "Client credentials are missing. Please doublecheck clientId, redirectUri and state"
    );
  }

  redirectUri = encodeURIComponent(redirectUri);

  return `https://app.abstract.com/signin/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=all&state=${state}`;
}
