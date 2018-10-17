// @flow
import type {
  BranchDescriptor,
  PageDescriptor,
  FileDescriptor,
  LayerDescriptor
} from "./";

export function ref(
  objectDescriptor:
    | BranchDescriptor
    | FileDescriptor
    | PageDescriptor
    | LayerDescriptor
) {
  return objectDescriptor.sha || objectDescriptor.branchId;
}

export function fileBranchDescriptor(
  fileDescriptor: FileDescriptor
): BranchDescriptor {
  return {
    projectId: fileDescriptor.projectId,
    branchId: fileDescriptor.branchId,
    sha: fileDescriptor.sha || "latest"
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
