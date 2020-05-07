// @flow
import type { ShareDescriptor, ShareUrlDescriptor } from "../types";

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
