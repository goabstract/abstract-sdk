// @flow
import type {
  CommitDescriptor,
  BranchDescriptor,
  PageDescriptor,
  FileDescriptor,
  LayerDescriptor
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
