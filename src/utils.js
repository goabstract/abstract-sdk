// @flow
import type {
  CommitDescriptor,
  BranchDescriptor,
  PageDescriptor,
  FileDescriptor,
  LayerDescriptor,
  ShareDescriptor
} from "./";

export function objectBranchDescriptor(
  objectDescriptor:
    | BranchDescriptor
    | FileDescriptor
    | CommitDescriptor
    | LayerDescriptor
): BranchDescriptor {
  return {
    projectId: objectDescriptor.projectId,
    branchId: objectDescriptor.branchId,
    sha: objectDescriptor.sha
  };
}

export function objectFileDescriptor(
  objectDescriptor: PageDescriptor | FileDescriptor
): FileDescriptor {
  return {
    projectId: objectDescriptor.projectId,
    branchId: objectDescriptor.branchId,
    fileId: objectDescriptor.fileId,
    sha: objectDescriptor.sha
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
