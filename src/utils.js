// @flow
import type {
  CommitDescriptor,
  BranchDescriptor,
  FileDescriptor,
  PageDescriptor,
  LayerDescriptor,
  ShareDescriptor,
  Layer
} from "./types";

export function objectBranchDescriptor(
  objectDescriptor:
    | CommitDescriptor
    | BranchDescriptor
    | FileDescriptor
    | PageDescriptor
    | LayerDescriptor
): BranchDescriptor {
  return {
    projectId: objectDescriptor.projectId,
    branchId: objectDescriptor.branchId
  };
}

export function objectFileDescriptor(
  objectDescriptor: FileDescriptor | PageDescriptor | LayerDescriptor
): FileDescriptor {
  return {
    projectId: objectDescriptor.projectId,
    branchId: objectDescriptor.branchId,
    fileId: objectDescriptor.fileId,
    sha: objectDescriptor.sha
  };
}

export function layerPageDescriptor(
  layer: Layer,
  branchId: string
): PageDescriptor {
  return {
    projectId: layer.projectId,
    branchId: branchId, // TODO: Expose branchId on Layer
    fileId: layer.fileId,
    pageId: layer.pageId,
    sha: layer.sha
  };
}

export default function parseShareURL(url: string): ?string {
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
