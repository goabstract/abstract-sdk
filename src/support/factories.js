// @flow
import type {
  ProjectDescriptor,
  CommitDescriptor,
  BranchDescriptor,
  FileDescriptor,
  PageDescriptor,
  LayerDescriptor,
  CollectionDescriptor,
  CommentDescriptor
} from "../";

export function buildOptions(options: *) {
  return {
    accessToken: "abstract-token",
    ...options
  };
}

export function buildOrganizationDescriptor(organizationDescriptor: *) {
  return {
    organizationId: "organization-id",
    ...organizationDescriptor
  };
}

export function buildProjectDescriptor(
  projectDescriptor: *
): ProjectDescriptor {
  return {
    projectId: "project-id",
    ...projectDescriptor
  };
}

export function buildCommitDescriptor(objectDescriptor: *): CommitDescriptor {
  return {
    projectId: "project-id",
    branchId: "branch-id",
    sha: "commit-sha",
    ...objectDescriptor
  };
}

export function buildBranchDescriptor(branchDescriptor: *): BranchDescriptor {
  return {
    projectId: "project-id",
    branchId: "branch-id",
    ...branchDescriptor
  };
}

export function buildFileDescriptor(fileDescriptor: *): FileDescriptor {
  return {
    projectId: "project-id",
    branchId: "branch-id",
    fileId: "file-id",
    ...fileDescriptor
  };
}

export function buildPageDescriptor(pageDescriptor: *): PageDescriptor {
  return {
    projectId: "project-id",
    branchId: "branch-id",
    fileId: "file-id",
    pageId: "page-id",
    ...pageDescriptor
  };
}

export function buildLayerDescriptor(layerDescriptor: *): LayerDescriptor {
  return {
    projectId: "project-id",
    branchId: "branch-id",
    sha: "layer-sha",
    fileId: "file-id",
    pageId: "page-id",
    layerId: "layer-id",
    ...layerDescriptor
  };
}

export function buildCollectionDescriptor(
  collectionDescriptor: *
): CollectionDescriptor {
  return {
    projectId: "project-id",
    branchId: "branch-id",
    collectionId: "collection-id",
    ...collectionDescriptor
  };
}

export function buildActivityDescriptor(activityDescriptor: *) {
  return {
    activityId: "activity-id",
    ...activityDescriptor
  };
}

export function buildNotificationDescriptor(notificationDescriptor: *) {
  return {
    notificationId: "notification-id",
    ...notificationDescriptor
  };
}

export function buildCommentDescriptor(
  commentDescriptor: *
): CommentDescriptor {
  return {
    commentId: "comment-id",
    ...commentDescriptor
  };
}
