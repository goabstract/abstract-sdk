// @flow
import type { ShareDescriptor } from "./types";

function parseShareURL(url: string): ?string {
  return url.split("share.goabstract.com/")[1];
}

export function inferShareId(shareDescriptor: ShareDescriptor): string {
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
