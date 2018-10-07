// @flow
import type {
  BranchDescriptor,
  CommitDescriptor,
  PageDescriptor,
  FileDescriptor,
  LayerDescriptor
} from ".";

export function ref(
  objectDescriptor:
    | BranchDescriptor
    | FileDescriptor
    | PageDescriptor
    | LayerDescriptor
) {
  return objectDescriptor.sha || objectDescriptor.branchId;
}

export function fileCommitDescriptor(
  fileDescriptor: FileDescriptor
): CommitDescriptor {
  return {
    projectId: fileDescriptor.projectId,
    branchId: fileDescriptor.branchId,
    sha: fileDescriptor.sha
  };
}

export function pageFileDescriptor(pageDescriptor: PageDescriptor) {
  return {
    projectId: pageDescriptor.projectId,
    branchId: pageDescriptor.branchId,
    sha: pageDescriptor.sha,
    fileId: pageDescriptor.fileId
  };
}
