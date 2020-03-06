// @flow
/* istanbul ignore file */

/**
 * @name OrganizationDescriptor
 * @property {string} organizationId
 */
export type OrganizationDescriptor = {|
  organizationId: string
|};

/**
 * @name ProjectDescriptor
 * @property {string} projectId
 */
export type ProjectDescriptor = {|
  projectId: string
|};

/**
 * @name CommentDescriptor
 * @property {string} commentId
 */
export type CommentDescriptor = {|
  commentId: string
|};

/**
 * @name CollectionDescriptor
 * @property {string} projectId
 * @property {string} collectionId
 */
export type CollectionDescriptor = {|
  projectId: string,
  collectionId: string
|};

/**
 * @name CollectionLayerDescriptor
 * @property {string} projectId
 * @property {string} collectionLayerId
 */
export type CollectionLayerDescriptor = {|
  projectId: string,
  collectionLayerId: string
|};

/**
 * @name ActivityDescriptor
 * @property {string} activityId
 */
export type ActivityDescriptor = {|
  activityId: string
|};

/**
 * @name NotificationDescriptor
 * @property {string} notificationId
 */
export type NotificationDescriptor = {|
  notificationId: string
|};

/**
 * @name ObjectDescriptor
 * @property {"latest" | string} sha
 * @property {string} projectId
 * @property {string | "master"} branchId
 */
export type ObjectDescriptor = {
  sha: "latest" | string,
  projectId: string,
  branchId: string | "master"
};

/**
 * @name BranchCommitDescriptor
 * @property {string} sha
 * @property {string} projectId
 * @property {string | "master"} branchId
 */
export type BranchCommitDescriptor = {|
  sha: string,
  projectId: string,
  branchId: string | "master"
|};

/**
 * @name CommitDescriptor
 * @property {string} sha
 * @property {string} projectId
 */
export type CommitDescriptor = {|
  sha: string,
  projectId: string
|};

/**
 * @name BranchDescriptor
 * @property {string} projectId
 * @property {string | "master"} brachId
 */
export type BranchDescriptor = {|
  projectId: string,
  branchId: string | "master"
|};

/**
 * @name FileDescriptor
 * @property {"latest" | string} sha
 * @property {string} projectId
 * @property {string | "master"} branchId
 * @property {string} fileId
 */
export type FileDescriptor = {|
  ...$Exact<ObjectDescriptor>,
  fileId: string
|};

/**
 * @name PageDescriptor
 * @property {"latest" | string} sha
 * @property {string} projectId
 * @property {string | "master"} branchId
 * @property {string} fileId
 * @property {pageId} string
 */
export type PageDescriptor = {|
  ...$Exact<ObjectDescriptor>,
  fileId: string,
  pageId: string
|};

/**
 * @name LayerDescriptor
 * @property {string} projectId
 * @property {string | "master"} branchId
 * @property {string} fileId
 * @property {string} layerId
 */
export type LayerDescriptor = {|
  projectId: string,
  branchId: string | "master",
  fileId: string,
  layerId: string
|};

/**
 * @name LayerVersionDescriptor
 * @property {"latest" | string} sha
 * @property {string} projectId
 * @property {string | "master"} branchId
 * @property {string} fileId
 * @property {string} layerId
 */
export type LayerVersionDescriptor = {|
  ...$Exact<ObjectDescriptor>,
  fileId: string,
  layerId: string
|};

export type ShareDescriptor = {| url: string |} | {| shareId: string |};

export type ErrorData = {|
  path: string,
  body: mixed
|};

export type ErrorMap = {
  [mode: string]: Error
};

export type ProgressCallback = (
  receivedBytes: number,
  totalBytes: number
) => void;

export type ApiRequestOptions = {
  customHostname?: string,
  raw?: boolean,
  onProgress?: ProgressCallback
};

/**
 * @name RequestOptions
 * @param {("api" | "cli")} transportMode
 */
export type RequestOptions = {
  transportMode?: ("api" | "cli")[],
  _version?: number
};

export type RequestConfig<T> = {
  api?: () => T,
  cli?: () => T,
  requestOptions?: RequestOptions
};

/**
 * @name ListOptions
 * @property {("api" | "cli")} transportMode
 * @property {number} limit
 * @property {number} offset
 */
export type ListOptions = {
  ...RequestOptions,
  limit?: number,
  offset?: number
};

/**
 * @name RawOptions
 * @property {("api" | "cli")} transportMode
 * @property {boolean} disableWrite
 * @property {string} filename
 */
export type RawOptions = {
  ...RequestOptions,
  disableWrite?: boolean,
  filename?: string
};

/**
 * @name RawProgressOptions
 * @property {("api" | "cli")} transportMode
 * @property {ProgressCallback} onProgress
 */
export type RawProgressOptions = {
  ...RawOptions,
  onProgress?: ProgressCallback
};

/**
 * @name CollectionsListOptions
 */
export type CollectionsListOptions = {
  ...ListOptions,
  branchStatus?: string,
  layersPerCollection?: number | "all",
  search?: string,
  sortBy?: string,
  sortDir?: string,
  userId?: string
};

export type AccessToken = ?string | ShareDescriptor;
export type AccessTokenOption =
  | AccessToken // TODO: Deprecate?
  | (() => AccessToken) // TODO: Deprecate
  | (() => Promise<AccessToken>);

/**
 * @name CommandOptions
 */
export type CommandOptions = {
  accessToken: AccessTokenOption,
  apiUrl: string | Promise<string>,
  objectUrl: string | Promise<string>,
  previewUrl: string | Promise<string>,
  transportMode: ("api" | "cli")[],
  webUrl: string | Promise<string>
};

export type Star = {
  starrableId: string,
  starrableType: "Project" | "Section",
  starredAt: string
};

export type SectionDescriptor = {
  sectionId: string
};

export type UserDescriptor = {|
  userId: string
|};

/**
 * @name AssetDescriptor
 */
export type AssetDescriptor = {|
  assetId: string,
  projectId: string
|};

export type ReviewStatus = "REQUESTED" | "REJECTED" | "APPROVED";

type ActivityBase = {
  id: string,
  createdAt: string,
  projectId: string,
  branchId: string,
  userId: string
};

export type ActivityBranchArchived = ActivityBase & {
  type: "BRANCH_ARCHIVED",
  payload: {
    branchName: string,
    previousStatus: string
  }
};

export type ActivityBranchCreated = ActivityBase & {
  type: "BRANCH_CREATED",
  payload: {
    branchName: string,
    branchDescription?: string
  }
};

export type ActivityBranchDeleted = ActivityBase & {
  type: "BRANCH_DELETED",
  payload: {
    branchName: string,
    previousStatus: string
  }
};

export type ActivityBranchDescriptionUpdated = ActivityBase & {
  type: "BRANCH_DESCRIPTION_UPDATED",
  payload: {
    branchName: string,
    branchDescription: string,
    previousDescription: string
  }
};

export type ActivityBranchRenamed = ActivityBase & {
  type: "BRANCH_RENAMED",
  payload: {
    branchName: string,
    previousName: string
  }
};

export type ActivityBranchStatusUpdated = ActivityBase & {
  type: "BRANCH_STATUS_UPDATED",
  payload: {
    branchName: string,
    previousStatus: string,
    status: string
  }
};

export type ActivityBranchUnarchived = ActivityBase & {
  type: "BRANCH_UNARCHIVED",
  payload: {
    branchName: string,
    status: string
  }
};

export type ActivityCollectionPublished = ActivityBase & {
  type: "COLLECTION_PUBLISHED",
  payload: {
    collectionId: string,
    name: string
  }
};

export type ActivityProjectArchived = ActivityBase & {
  type: "PROJECT_ARCHIVED",
  payload: {
    projectName: string
  }
};

export type ActivityProjectCreated = ActivityBase & {
  type: "PROJECT_CREATED",
  payload: {
    projectName: string
  }
};

export type ActivityProjectDeleted = ActivityBase & {
  type: "PROJECT_DELETED",
  payload: {
    projectName: string
  }
};

export type ActivityProjectDescriptionChanged = ActivityBase & {
  type: "PROJECT_DESCRIPTION_CHANGED",
  payload: {
    projectName: string
  }
};

export type ActivityProjectRenamed = ActivityBase & {
  type: "PROJECT_RENAMED",
  payload: {
    previousName: string,
    newName: string
  }
};

export type ActivityProjectUnarchived = ActivityBase & {
  type: "PROJECT_UNARCHIVED",
  payload: {
    projectName: string
  }
};

export type ActivityProjectTransferred = ActivityBase & {
  type: "PROJECT_TRANSFERRED",
  payload: {
    projectName: string,
    previousOrganizationName: string,
    newOrganizationName: string
  }
};

type ActivityCommitCommon = {
  pushActivityId: string,
  sha: string,
  title: string,
  description: string,
  branchName: string
};

export type ActivityCommit = ActivityBase & {
  type: "COMMIT",
  payload: ActivityCommitCommon
};

export type ActivityMergeCommit = ActivityBase & {
  type: "MERGE_COMMIT",
  payload: ActivityCommitCommon & {
    sourceBranchId: string,
    sourceBranchName: string,
    destinationBranchId: string,
    destinationBranchName: string
  }
};

export type ActivityUpdateCommit = ActivityBase & {
  type: "UPDATE_COMMIT",
  payload: ActivityCommitCommon & {
    sourceBranchId: string,
    sourceBranchName: string
  }
};

export type ActivityCommentCreated = ActivityBase & {
  type: "COMMENT_CREATED",
  payload: {
    reviewId?: string,
    reviewStatus?: ReviewStatus,
    commentFileId: string,
    commentFileName: string,
    commentId: string,
    commentLayerId: string,
    commentLayerName: string,
    commentPageId: string,
    commentPageName: string,
    commentParentId: string,
    commitBranchId: string,
    commitBranchName: string,
    commitSha: string,
    commitMessage: string
  }
};

export type ActivityReviewRequested = ActivityBase & {
  type: "REVIEW_REQUESTED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string
  }
};

export type ActivityReviewDismissed = ActivityBase & {
  type: "REVIEW_DISMISSED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string
  }
};

export type ActivityReviewerRemoved = ActivityBase & {
  type: "REVIEWER_REMOVED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string
  }
};

export type ActivityReviewCompleted = ActivityBase & {
  type: "REVIEW_COMPLETED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string,
    status: string
  }
};

/**
 * @property {string} branchId UUID of the branch that this activity was triggered on
 * @property {string} createdAt UUID of the branch that this activity was triggered on
 * @property {string} id UUID of the branch that this activity was triggered on
 * @property {string} payload UUID of the branch that this activity was triggered on
 * @property {string} type The type of this activity, may be one of
 * `BRANCH_ARCHIVED`, `BRANCH_CREATED`, `BRANCH_DELETED`,
 * `BRANCH_DESCRIPTION_UPDATED`, `BRANCH_RENAMED`, `BRANCH_STATUS_UPDATED`,
 * `BRANCH_UNARCHIVED`, `COLLECTION_PUBLISHED`, `COMMENT_CREATED`, `COMMIT`,
 * `MERGE_COMMIT`, `PROJECT_ARCHIVED`, `PROJECT_CREATED`, `PROJECT_DELETED`,
 * `PROJECT_DESCRIPTION_CHANGED`, `PROJECT_RENAMED`, `PROJECT_TRANSFERRED`,
 * `PROJECT_UNARCHIVED`, `REVIEWER_REMOVED`, `REVIEW_COMPLETED`,
 * `REVIEW_DISMISSED`,`REVIEW_REQUESTED`, `UPDATE_COMMIT`
 * @property {string} userId UUID of the user that triggered this activity
 */
export type Activity =
  | ActivityBranchArchived
  | ActivityBranchCreated
  | ActivityBranchDeleted
  | ActivityBranchDescriptionUpdated
  | ActivityBranchRenamed
  | ActivityBranchStatusUpdated
  | ActivityBranchUnarchived
  | ActivityCollectionPublished
  | ActivityCommentCreated
  | ActivityCommit
  | ActivityMergeCommit
  | ActivityProjectArchived
  | ActivityProjectCreated
  | ActivityProjectDeleted
  | ActivityProjectDescriptionChanged
  | ActivityProjectRenamed
  | ActivityProjectTransferred
  | ActivityProjectUnarchived
  | ActivityReviewCompleted
  | ActivityReviewDismissed
  | ActivityReviewRequested
  | ActivityReviewerRemoved
  | ActivityUpdateCommit;

/**
 * @name User
 * @property {string} avatarUrl URL of the avatar for this user
 * @property {string} createdAt Timestamp indicating when this account was created
 * @property {string} deletedAt Timestamp indicating when this account was deleted
 * @property {string} id UUID identifier for the user
 * @property {string} name The name of the page
 * @property {string} primaryEmailId ID of the primary email for this user
 * @property {string} updatedAt Timestamp indicating when this account was updated
 * @property {string} username Username associated with this user
 */
export type User = {
  id: string,
  primaryEmailId: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string,
  username: string,
  name: string,
  avatarUrl: string
};

/**
 * @name ProjectMembershipDescriptor
 */
export type ProjectMembershipDescriptor = {|
  userId: string,
  projectId: string
|};

/**
 * @name OrganizationMembershipDescriptor
 */
export type OrganizationMembershipDescriptor = {|
  userId: string,
  organizationId: string
|};

/**
 * @name Membership
 * @property {string} createdAt Timestamp indicating when this membership was created
 * @property {string} organizationId UUID of the organization this membership belongs to
 * @property {string} projectId UUID of the project this membership belongs to
 * @property {string} role Type of this membership
 * @property {string} userId UUID of the user that this membership represents
 * @property {User} user The user that this membership represents
 */
export type Membership = {
  createdAt: string,
  organizationId: string,
  projectId?: string,
  role: string,
  user: User,
  userId: string
};

/**
 * @name Organization
 * @property {{ [feature: string]: boolean }} features Map of feature flags enabled for this organization
 * @property {boolean} hasBillingInfo Whether this organization has billing information on file
 * @property {string} id UUID
 * @property {boolean} isUsernameOrganization A username organization is a free organization included with every user account
 * @property {boolean} isWithinSubscriptionTerm Whether the organizations subscription is in good standing
 * @property {string} logoUrl A url for the organization logo
 * @property {string} name The name of the organization
 * @property {boolean} privateProjectPublicSharingEnabled Flag indicating if this organization has sharing of private projects enabled
 * @property {boolean} publicSharingEnabled Flag indicating if this organization has sharing of public projects enabled
 * @property {string[]} restrictedToDomains An optional list of domain names that invitations to this organization are restricted to
 * @property {string} trialEndsAt Timestamp of when the trial ends, if within trial period
 * @property {string} userId UUID of the user that created the organization
 */
export type Organization = {
  features: { [feature: string]: boolean },
  hasBillingInfo?: boolean,
  id: string,
  isUsernameOrganization?: boolean,
  isWithinSubscriptionTerm?: boolean,
  logoUrl?: string,
  name: string,
  privateProjectPublicSharingEnabled?: boolean,
  publicSharingEnabled?: boolean,
  restrictedToDomains: string[],
  trialEndsAt?: string,
  userId: string
};

export type AssetAutoGenerationOption = "all" | "master" | "off";

/**
 * @name Project
 * @property {string} about A longer description of the project (May optionally include markdown tags)
 * @property {string} archivedAt Timestamp that the project was archived
 * @property {string} color A hex value that represents a custom project color
 * @property {string} createdAt Timestamp that the project was created
 * @property {User} createdByUser The user that created the project
 * @property {string} firstPushedAt Timestamp that the project first received data
 * @property {string} id UUID
 * @property {boolean} isNew True if nobody has committed in this project yet
 * @property {string} name The name of the project
 * @property {string} organizationId UUID of the organization this project belongs to
 * @property {string} pushedAt Timestamp that data was last received
 * @property {string} repoCreatedAt Timestamp that the backend storage was created
 * @property {number} sizeInBytes The size of the project on disk in bytes
 * @property {string} updatedAt Timestamp that the project was last updated
 * @property {string} visibility Either "organization" for a team project, or "specific" for a private project
 */
export type Project = {
  id: string,
  name: string,
  about: string,
  color: string,
  createdAt: string,
  updatedAt: string,
  organizationId: string,
  createdByUser: User,
  deletedAt: string,
  archivedAt: string,
  firstPushedAt: string,
  pushedAt: string,
  isNew: boolean,
  repoCreatedAt: string,
  visibility: "organization" | "project",
  sizeInBytes: number,
  assetAutoGeneration: AssetAutoGenerationOption
};

export type NewProject = {
  name: string,
  organizationId: string,
  about?: string,
  color?: string,
  sectionId?: string,
  createdAt?: string,
  visibility?: "organization" | "project",
  assetAutoGeneration?: AssetAutoGenerationOption
};

/**
 * @name BaseShare
 * @property {string} id
 * @property {string} url
 * @property {string} appUrl
 * @property {string} userId
 * @property {object} options
 */
type BaseShare = {|
  id: string,
  url: string,
  appUrl: string,
  userId: string,
  options: {}
|};

/**
 * @name ProjectShare
 * @property {string} id
 * @property {string} url
 * @property {string} appUrl
 * @property {string} userId
 * @property {object} options
 * @property {string} kind "project"
 * @property {ProjectDescriptor} descriptor
 */
export type ProjectShare = {
  ...BaseShare,
  kind: "project",
  descriptor: ProjectDescriptor
};

/**
 * @name CommitShare
 * @property {string} id
 * @property {string} url
 * @property {string} appUrl
 * @property {string} userId
 * @property {object} options
 * @property {string} kind "commit"
 * @property {BranchCommitDescriptor}
 */
export type CommitShare = {
  ...BaseShare,
  kind: "commit",
  descriptor: BranchCommitDescriptor
};

/**
 * @name BranchShare
 * @property {string} id
 * @property {string} url
 * @property {string} appUrl
 * @property {string} userId
 * @property {object} options
 * @property {string} kind "branch"
 * @property {BranchDescriptor} descriptor
 */
export type BranchShare = {
  ...BaseShare,
  kind: "branch",
  descriptor: BranchDescriptor
};

/**
 * @name FileShare
 * @property {string} id
 * @property {string} url
 * @property {string} appUrl
 * @property {string} userId
 * @property {object} options
 * @property {string} kind "file"
 * @property {FileDescriptor} descriptor
 */
export type FileShare = {
  ...BaseShare,
  kind: "file",
  descriptor: FileDescriptor
};

/**
 * @name PageShare
 * @property {string} id
 * @property {string} url
 * @property {string} appUrl
 * @property {string} userId
 * @property {object} options
 * @property {string} kind "page"
 * @property {PageDescriptor} descriptor
 */
export type PageShare = {
  ...BaseShare,
  kind: "page",
  descriptor: PageDescriptor
};

/**
 * @name LayerShare
 * @property {string} id
 * @property {string} url
 * @property {string} appUrl
 * @property {string} userId
 * @property {object} options
 * @property {string} kind "layer"
 * @property {LayerVersionDescriptor} descriptor
 * @property {object} descriptor
 * @property {string} descriptor.mode
 * @property {boolean} descriptor.public
 * @property {boolean} descriptor.historyEnabled
 * @property {boolean} descriptor.inspectEnabled
 */
export type LayerShare = {
  ...BaseShare,
  kind: "layer",
  descriptor: LayerVersionDescriptor,
  options: {
    mode?: "design" | "compare" | "build",
    public?: boolean,
    historyEnabled?: boolean,
    inspectEnabled?: boolean
  }
};

/**
 * @name CommentShare
 * @property {string} id
 * @property {string} url
 * @property {string} appUrl
 * @property {string} userId
 * @property {object} options
 * @property {string} kind "comment"
 * @property {CollectionDescriptor} descriptor
 */
export type CommentShare = {
  ...BaseShare,
  kind: "comment",
  descriptor: CommentDescriptor
};

/**
 * @name CollectionShare
 * @property {string} id
 * @property {string} url
 * @property {string} appUrl
 * @property {string} userId
 * @property {object} options
 * @property {string} kind "collection"
 * @property {CollectionDescriptor} descriptor
 */
export type CollectionShare = {
  ...BaseShare,
  kind: "collection",
  descriptor: CollectionDescriptor
};

/**
 * @name Share
 * @property {Descriptor} descriptor A descriptor for the shared object
 * @property {string} appUrl A url that can be used to open the desktop app
 * @property {string} userId UUID of the user that created the share
 * @property {string} id UUID
 * @description
 * <div class="banner banner-warning">
 *  Note: The descriptor property can be used as the first argument for many of the SDK methods
 * </div>
 */
export type Share =
  | ProjectShare
  | CommitShare
  | BranchShare
  | FileShare
  | PageShare
  | LayerShare
  | CommentShare
  | CollectionShare;

type BaseShareInput = {|
  organizationId: string
|};

export type ProjectShareInput = {
  kind: "project",
  ...BaseShareInput,
  ...ProjectDescriptor
};

export type CommitShareInput = {
  kind: "commit",
  ...BaseShareInput,
  ...BranchCommitDescriptor
};

export type BranchShareInput = {
  kind: "branch",
  ...BaseShareInput,
  ...BranchDescriptor
};

export type FileShareInput = {
  kind: "file",
  ...BaseShareInput,
  ...FileDescriptor
};

export type PageShareInput = {
  kind: "page",
  ...BaseShareInput,
  ...PageDescriptor
};

export type LayerShareInput = {
  kind: "layer",
  ...BaseShareInput,
  ...LayerVersionDescriptor,
  options: {
    public: boolean,
    canInspect: boolean,
    canShowHistory: boolean,
    mode: "design" | "compare" | "build"
  }
};

export type CommentShareInput = {
  kind: "comment",
  ...BaseShareInput,
  ...CommentDescriptor
};

export type CollectionShareInput = {
  kind: "collection",
  ...BaseShareInput,
  ...CollectionDescriptor
};

export type ShareInput =
  | ProjectShareInput
  | CommitShareInput
  | BranchShareInput
  | FileShareInput
  | PageShareInput
  | LayerShareInput
  | CommentShareInput
  | CollectionShareInput;

export type Annotation = {
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  editing: boolean,
  scale: number,
  number: number
};

/**
 * @name Comment
 * @property {Annotation} annotation The optional bounding box for the comment on the layer
 * @property {string} body The body of the comment
 * @property {string} branchId UUID of the branch this comment is on, or the string "master"
 * @property {string} commitSha SHA of the commit this comment was left on
 * @property {string} createdAt Timestamp of the comment creation time
 * @property {string} deletedAt Timestamp of the comment deletion time
 * @property {string} editedAt Timestamp of when the comment was last edited
 * @property {string} fileId UUID of the file that this comment is on
 * @property {string} id UUID identifier of the comment
 * @property {string} layerId UUID of the layer that this comment is on
 * @property {string} pageId UUID of the page that this comment is on
 * @property {string} parentId UUID of the parent comment if this is a reply
 * @property {string} projectId UUID of the project that this comment is contained within
 * @property {string[]} replyIds An array of comment UUID's that are replies to this comment
 * @property {string} annotation If the comment was a review this may be one of
 * <code>APPROVED</code> or <code>REJECTED</code>
 * @property {string} annotation Timestamp of when the comment was last updated
 * @property {User} annotation The user that created the comment
 * @property {string} annotation UUID of the user this commit was created by
 */
export type Comment = {
  id: string,
  annotation?: Annotation,
  body: string,
  createdAt: string,
  updatedAt: string,
  editedAt: string,
  deletedAt?: string,
  projectId: string,
  userId: string,
  branchId: string,
  commitSha: string,
  fileId: string,
  layerId: string,
  pageId: string,
  parentId?: string,
  reviewId?: string,
  reviewStatus?: ReviewStatus,
  replyIds: string[]
};

/**
 * @name NewComment
 */
export type NewComment = {
  annotation?: Annotation,
  body: string
};

/**
 * @name NewCollectionLayer
 * @property {string} fileId - UUID of the file that the underlying layer is part of
 * @property {string} pageId - UUID of the page that the underlying layer is part of
 * @property {string} layerId  - UUID of the underlying layer that this collection layer represents
 * @property {boolean} isPinned - SHA of the commit introducing changes in this changeset
 * @property {boolean} useLatestCommit - Determines if this collection layer
 * should always point to the latest version of its underlying layer
 * @property {number} order - SHA of the commit that the underlying layer should point to
 * @property {string} sha - SHA of the commit that the underlying layer should point to
 */
export type NewCollectionLayer = {
  fileId: string,
  isPinned?: boolean,
  layerId: string,
  order?: number,
  pageId: string,
  sha: "latest" | string,
  useLatestCommit?: boolean
};

/**
 * @name UpdatedCollectionLayer
 */
export type UpdatedCollectionLayer = {
  fileId?: string,
  isPinned?: boolean,
  layerId?: string,
  order?: number,
  pageId?: string,
  sha?: "latest" | string,
  useLatestCommit?: boolean
};

/**
 * @name CollectionLayer
 * @property {string} collectionId - UUID of the collection that this collection layer is part of
 * @property {string} fileId - UUID of the file that the underlying layer is part of
 * @property {string} pageId - UUID of the page that the underlying layer is part of
 * @property {string} layerId - UUID of the underlying layer that this collection layer represents
 * @property {string} projectId - UUID of the project that this collection layer is contained within
 * @property {boolean} isPinned - SHA of the commit introducing changes in this changeset
 * @property {boolean} useLatestCommit - Determines if this collection layer should always point to
 * the latest version of its underlying layer
 * @property {string} id - UUID identifier of this collection layer
 * @property {number} order - SHA of the commit that the underlying layer should point to
 * @property {string} sha - SHA of the commit that the underlying layer should point to
 */
export type CollectionLayer = {
  collectionId: string,
  fileId: string,
  id: string,
  isPinned: boolean,
  layerId: string,
  order: number,
  pageId: string,
  projectId: string,
  sha: "latest" | string,
  useLatestCommit: boolean
};

/**
 * @name File
 * @property {number} applicationDocumentVersion The application (eg Sketch's) version of the file
 * @property {string} applicationVersion The version of the application the file was created with
 * @property {string} id UUID identifier for the file
 * @property {boolean} isLibrary Is this file a library file or not
 * @property {string} lastChangedAtSha SHA that represents the commit where this file was last changed
 * @property {string} name The name of the file
 * @property {string} projectId UUID of the project this file belongs to
 * @property {string} sha SHA that this file was loaded at
 * @property {string} type The application that the file was created in
 * @property {string} updatedAt The timestamp of the last change to the file
 */
export type File = {
  applicationDocumentVersion: number,
  applicationVersion: string,
  id: string,
  isLibrary: boolean,
  lastChangedAtSha: string,
  name: string,
  projectId: string,
  sha: string,
  type: string
};

/**
 * @name Collection
 * @property {string} branchId UUID of the branch that this collection belongs to, or the string "master"
 * @property {string} createdAt Timestamp that the collection was created
 * @property {string} description A description of the collection
 * @property {string} id UUID identifier of the collection
 * @property {CollectionLayer[]} layers An ordered array of collection layers.
 * Note: These are not the same as <strong>Layer</strong> objects.
 * @property {string} name The name of the collection
 * @property {string} projectId UUID of the project this commit belongs to
 * @property {string} publishedAt Timestamp that the collection was published
 * @property {User} user The user that created the collection
 * @property {string} userId UUID of the user that created the collection
 */
export type Collection = {
  id: string,
  userId: string,
  projectId: string,
  branchId: string,
  name: string,
  description: string,
  createdAt: string,
  publishedAt: string,
  layers: CollectionLayer[]
};

/**
 * @name UpdatedCollection
 */
export type UpdatedCollection = {
  name?: string,
  description?: string,
  published?: boolean
};

/**
 * @name NewCollection
 */
export type NewCollection = {
  name: string,
  branchId: string,
  description?: string,
  published?: boolean
};

/**
 * @name Commit
 * @property {string} description The body of the commit comment
 * @property {string} destinationBranchId For merge commits
 * this points to the merged into branch
 * @property {string} destinationBranchName For merge commits this is
 * the name of the branch that was merged into
 * @property {string[]} fileIds For system commits like file upgrades
 * this represents the file UUID's that were changed
 * @property {string[]} parents SHA(s) of the parent commits
 * @property {string} projectId UUID of the project this commit belongs to
 * @property {string} sha SHA of the hashed content of the commit.
 * This acts as the unique identifer.
 * @property {string} sourceBranchId For merge commits this points to the merged from branch
 * @property {string} sourceBranchName For merge commits this is the name
 * of the branch that was merged from
 * @property {string} time Timestamp of the commit
 * @property {string} title The title of the commit
 * @property {string} type The type of the commit, may be one of
 * <code>NORMAL</code>, <code>PROJECT_CREATED</code>,
 * <code>FILE_ADDED</code>, <code>FILE_RENAMED</code>,
 * <code>FILE_DELETED</code>, <code>FILE_REPLACED</code>,
 * <code>LIBRARY_ADDED</code>, <code>LIBRARY_REMOVED</code>,
 * <code>RESTORE</code>, <code>UPDATE</code>, <code>MERGE</code>
 * @property {string} userId UUID of the user this commit was created by
 * @property {string} userName Display name of the user this commit was created by
 */
export type Commit = {
  sha: string,
  projectId: string,
  type:
    | "PROJECT_CREATED"
    | "FILE_ADDED"
    | "FILE_RENAMED"
    | "FILE_DELETED"
    | "FILE_REPLACED"
    | "FILE_UPGRADED"
    | "LIBRARY_ADDED"
    | "LIBRARY_REMOVED"
    | "RESTORE"
    | "UPDATE"
    | "MERGE"
    | "NORMAL",
  time: string,
  title: string,
  description: string,
  userName: string,
  userId: string,
  fileIds: string[],
  parents: string[],
  destinationBranchId: string,
  destinationBranchName: string,
  sourceBranchId: string,
  sourceBranchName: string
};

/**
 * @name Branch
 * @property {string} createdAt - Timestamp that the branch was created
 * @property {string} description - A summary of the branch – this field may contain markdown.
 * @property {string} divergedFromBranchId - UUID identifier of the branch this branch diverged from
 * @property {string} head - SHA that represents the latest commit on the branch
 * @property {string} id - UUID identifier of the branch, or the string "master"
 * @property {string} mergeSha - SHA that represents the commit where this branch was merged
 * @property {string} mergedIntoBranchId - UUID identifier of the branch this branch was merged into
 * @property {string} name - The name of the branch
 * @property {string} parent - UUID identifier of the branch that this branch was created from, or the string "master"
 * @property {string} projectId - UUID of the project that this branch is contained within
 * @property {string} startedAtSha - SHA that represents the commit where this branch was created
 * @property {string} status - The current status of the branch.
 * May be one of <code>active</code>, <code>wip</code>, <code>feedback</code>,
 * <code>review</code>, <code>merged</code>, <code>archived</code>, <code>deleted</code>,
 * <code>diverged</code>
 * @property {string} updatedAt - Timestamp that the branch was last updated
 * @property {string} userId - UUID of the user that created the branch
 * @property {string} userName - The name of the user that created the branch
 */
export type Branch = {
  id: string,
  name: string,
  description: string,
  userName: string,
  userId: string,
  createdAt: string,
  updatedAt: string,
  status: string,
  parent: string,
  startedAtSha: string,
  head: string,
  mergeSha: string,
  mergedIntoBranchId: string,
  divergedFromBranchId: string,
  projectId: string,
  user: User
};

/**
 * @name ChangesetStatus
 */
export type ChangesetStatus =
  | "added"
  | "deleted"
  | "edited"
  | "edited-indirectly"
  | "none";

/**
 * @name ChangesetFileChange
 */
export type ChangesetFileChange = {
  type: "file",
  status: ChangesetStatus,
  hasPreview: false,
  meta: { [key: string]: [any, any] },
  fileId: string,
  pageId: void,
  layerId: void,
  colorsId: void,
  gradientId: void,
  layerStyleId: void,
  textStyleId: void
};

/**
 * @name ChangesetPageChange
 */
export type ChangesetPageChange = {
  type: "page",
  status: ChangesetStatus,
  hasPreview: false,
  meta: { [key: string]: [any, any] },
  fileId: string,
  pageId: string,
  layerId: void,
  colorsId: void,
  gradientId: void,
  layerStyleId: void,
  textStyleId: void
};

/**
 * @name ChangesetLayerChange
 */
export type ChangesetLayerChange = {
  type: "layer" | "symbol" | "artboard",
  status: ChangesetStatus,
  hasPreview: boolean,
  meta: { [key: string]: [any, any] },
  fileId: string,
  pageId: string,
  layerId: string,
  colorsId: void,
  gradientId: void,
  layerStyleId: void,
  textStyleId: void
};

/**
 * @name ChangesetColorsChange
 */
export type ChangesetColorsChange = {
  type: "colors",
  status: ChangesetStatus,
  hasPreview: boolean,
  meta: { [key: string]: [any, any] },
  fileId: string,
  pageId: void,
  layerId: void,
  colorsId: string,
  gradientId: void,
  layerStyleId: void,
  textStyleId: void
};

/**
 * @name ChangesetGradientChange
 */
export type ChangesetGradientChange = {
  type: "gradient",
  status: ChangesetStatus,
  hasPreview: boolean,
  meta: { [key: string]: [any, any] },
  fileId: string,
  pageId: void,
  layerId: void,
  colorsId: void,
  gradientId: string,
  layerStyleId: void,
  textStyleId: void
};

/**
 * @name ChangesetLayerStyleChange
 */
export type ChangesetLayerStyleChange = {
  type: "layer-style",
  status: ChangesetStatus,
  hasPreview: boolean,
  meta: { [key: string]: [any, any] },
  fileId: string,
  pageId: void,
  layerId: void,
  colorsId: void,
  gradientId: void,
  layerStyleId: string,
  textStyleId: void
};

/**
 * @name ChangesetTextStyleChange
 */
export type ChangesetTextStyleChange = {
  type: "text-style",
  status: ChangesetStatus,
  hasPreview: boolean,
  meta: { [key: string]: [any, any] },
  fileId: string,
  pageId: void,
  layerId: void,
  colorsId: void,
  gradientId: void,
  layerStyleId: void,
  textStyleId: string
};

/**
 * @name ChangesetChange
 * @property {string} type - Type of this change, can be one of
 * <code>file</code>, <code>page</code>, <code>layer</code>, <code>symbol</code>,
 * <code>artboard</code>, <code>colors</code>, <code>gradient</code>,
 * <code>layer-style</code>, <code>text-style</code>
 * @property {string} status - Status of this change,
 * can be one of <code>added</code>, <code>deleted</code>,
 * <code>edited</code>, <code>edited-indirectly</code>, <code>none</code>
 * @property {boolean} hasPreview - Indicates if this change has a visual preview
 * @property {{ [key: string]: [any, any] }} meta - Object
 * containing additional information about this change
 * @property {string} fileId - UUID of the file this change was made against
 * @property {string} pageId - UUID of the page this change was made against
 * @property {string} layerId - UUID of the layer this change was made against
 * @property {string} colorsId - UUID of the color associated with this change
 * @property {string} gradientId - UUID of the gradient associated with this change
 * @property {string} layerStyleId - UUID of the layer style associated with this change
 * @property {string} textStyleId - UUID of the text style associated with this change
 */
export type ChangesetChange =
  | ChangesetFileChange
  | ChangesetPageChange
  | ChangesetLayerChange
  | ChangesetColorsChange
  | ChangesetGradientChange
  | ChangesetLayerStyleChange
  | ChangesetTextStyleChange;

/**
 * @property {string} branchId - UUID of the branch that this changeset is part of, or the string "master"
 * @property {ChangesetChange} changes - List of changes that make up this changeset
 * @property {string} compareToSha - SHA of the commit introducing changes in this changeset
 * @property {string} id - UUID identifier of the changeset
 * @property {string} projectId - UUID of the project this changeset belongs to
 * @property {string} sha - SHA of the base commit in this changeset that changes are against
 */
export type Changeset = {
  id: string,
  sha: string,
  compareToSha: string,
  changes: ChangesetChange[],
  projectId: string,
  branchId: string
};

export type SharedItem = {
  fileId: string,
  id: string,
  libraryId: string,
  libraryName: string,
  name: string,
  projectId: string,
  sha: string,
  type: string,
  version: number
};

/**
 * @name Page
 * @property {string} fileId UUID of the file that this page is contained within
 * @property {string} id UUID identifier for the page
 * @property {string} name The name of the page
 * @property {number} order The order of the page in the file
 * @property {string} projectId UUID of the project this page belongs to
 * @property {string} sha SHA of the commit this page was loaded at
 * @property {string} type This field has the value "library" for virtual library pages
 */
export type Page = {
  id: string,
  name: string,
  type: "" | "library",
  projectId: string,
  sha: string,
  fileId: string,
  order: number
};

/**
 * @name Layer
 * @property {string} fileId UUID of the file that this layer is contained within
 * @property {number} height The height of the layer in pixels
 * @property {string} id UUID identifier of the layer
 * @property {string} lastChangedAtSha SHA of the commit where the layer was last changed
 * @property {string} libraryId UUID of the library file that this layer was included from
 * @property {string} name The name of the layer
 * @property {number} order The order of the layer in the page
 * @property {string} pageId UUID of the page that this layer is contained within
 * @property {string} projectId UUID of the project that this layer is contained within
 * @property {string} sha SHA of the commit this layer was loaded at
 * @property {string} type The type of the layer, eg "artboard"
 * @property {string} updatedAt Timestamp of the commit that this layer was last changed
 * @property {number} width The width of the layer in pixels
 * @property {number} x The horizontal position of the layer on the page, measured from the left
 * @property {number} y The vertical position of the layer on the page, measured from the top
 */
export type Layer = {
  id: string,
  name: string,
  type: string,
  width: number,
  height: number,
  x: number,
  y: number,
  lastChangedIn: string,
  lastChangedAtSha: string,
  projectId: string,
  sha: string,
  fileId: string,
  pageId: string,
  libraryId?: string,
  status?: string,
  updatedAt: string,
  order: number
};

export type LayerBlendModeNormal = 0;
export type LayerBlendModeDarken = 1;
export type LayerBlendModeMultiply = 2;
export type LayerBlendModeColorBurn = 3;
export type LayerBlendModeLighten = 4;
export type LayerBlendModeScreen = 5;
export type LayerBlendModeAdd = 6;
export type LayerBlendModeOverlay = 7;
export type LayerBlendModeSoftLight = 8;
export type LayerBlendModeHardLight = 9;
export type LayerBlendModeDifference = 10;
export type LayerBlendModeExclusion = 11;
export type LayerBlendModeHue = 12;
export type LayerBlendModeSaturation = 13;
export type LayerBlendModeColor = 14;
export type LayerBlendModeLuminosity = 15;
export type LayerBlendMode =
  | LayerBlendModeNormal
  | LayerBlendModeDarken
  | LayerBlendModeMultiply
  | LayerBlendModeColorBurn
  | LayerBlendModeLighten
  | LayerBlendModeScreen
  | LayerBlendModeAdd
  | LayerBlendModeOverlay
  | LayerBlendModeSoftLight
  | LayerBlendModeHardLight
  | LayerBlendModeDifference
  | LayerBlendModeExclusion
  | LayerBlendModeHue
  | LayerBlendModeSaturation
  | LayerBlendModeColor
  | LayerBlendModeLuminosity;

export type LayerBorderPositionCenter = 0;
export type LayerBorderPositionInside = 1;
export type LayerBorderPositionOutside = 2;
export type LayerBorderPosition =
  | LayerBorderPositionCenter
  | LayerBorderPositionInside
  | LayerBorderPositionOutside;

export type LayerFillTypeSolid = 0;
export type LayerFillTypeGradient = 1;
export type LayerFillTypePattern = 4;
export type LayerFillTypeNoise = 5;
export type LayerFillType =
  | LayerFillTypeSolid
  | LayerFillTypeGradient
  | LayerFillTypePattern
  | LayerFillTypeNoise;

export type LayerTextDecorationLineUnderline = "underline";
export type LayerTextDecorationLineStrikethrough = "strikethrough";
export type LayerTextDecorationLine =
  | LayerTextDecorationLineUnderline
  | LayerTextDecorationLineStrikethrough;

export type LayerTextDecorationStyleSolid = "solid";
export type LayerTextDecorationStyleDouble = "double";
export type LayerTextDecorationStyle =
  | LayerTextDecorationStyleSolid
  | LayerTextDecorationStyleDouble;

export type LayerTextDecoration = {
  line: LayerTextDecorationLine,
  style: LayerTextDecorationStyle
};

export type LayerTextTransformNone = 0;
export type LayerTextTransformUppercase = 1;
export type LayerTextTransformLowercase = 2;
export type LayerTextTransform =
  | LayerTextTransformNone
  | LayerTextTransformUppercase
  | LayerTextTransformLowercase;

export type LayerHorizontalAlignmentLeft = 0;
export type LayerHorizontalAlignmentRight = 1;
export type LayerHorizontalAlignmentCenter = 2;
export type LayerHorizontalAlignmentJustify = 3;
export type LayerHorizontalAlignmentNatural = 4;
export type LayerHorizontalAlignment =
  | LayerHorizontalAlignmentLeft
  | LayerHorizontalAlignmentRight
  | LayerHorizontalAlignmentCenter
  | LayerHorizontalAlignmentJustify
  | LayerHorizontalAlignmentNatural;

export type LayerGradientTypeLinear = 0;
export type LayerGradientTypeRadial = 1;
export type LayerGradientTypeAngular = 2;
export type LayerGradientType =
  | LayerGradientTypeLinear
  | LayerGradientTypeRadial
  | LayerGradientTypeAngular;

export type LayerColor = {
  hex8: string,
  rgba: string,
  components: {
    red: number,
    green: number,
    blue: number,
    alpha: number
  }
};

export type LayerGradientStop = {
  position: number,
  color: LayerColor
};

export type LayerGradientLinear = {
  gradientType: LayerGradientTypeLinear,
  from: [number, number],
  to: [number, number],
  stops: LayerGradientStop[]
};

export type LayerGradientRadial = {
  gradientType: LayerGradientTypeRadial,
  from: [number, number],
  to: [number, number],
  stops: LayerGradientStop[],
  ellipseLength: number
};

export type LayerGradientAngular = {
  gradientType: LayerGradientTypeAngular,
  from: [number, number],
  to: [number, number],
  stops: LayerGradientStop[]
};

export type LayerGradient =
  | LayerGradientLinear
  | LayerGradientRadial
  | LayerGradientAngular;

export type LayerBorderSolid = {|
  fillType: LayerFillTypeSolid,
  position: LayerBorderPosition,
  thickness: number,
  color: LayerColor
|};

export type LayerBorderGradient = {|
  fillType: LayerFillTypeGradient,
  position: LayerBorderPosition,
  thickness: number,
  gradient: LayerGradient
|};

export type LayerBorder = LayerBorderSolid | LayerBorderGradient;

export type LayerBorderRadius = {
  topLeft: number,
  topRight: number,
  bottomRight: number,
  bottomLeft: number
};

export type LayerFillSolid = {
  fillType: LayerFillTypeSolid,
  blendMode: LayerBlendMode,
  opacity: number,
  color: LayerColor
};

export type LayerFillGradient = {
  fillType: LayerFillTypeGradient,
  blendMode: LayerBlendMode,
  opacity: number,
  gradient: LayerGradient
};

export type LayerFillPatternTypeTile = 0;
export type LayerFillPatternTypeFill = 1;
export type LayerFillPatternTypeStretch = 2;
export type LayerFillPatternTypeFit = 3;
export type LayerFillPatternType =
  | LayerFillPatternTypeTile
  | LayerFillPatternTypeFill
  | LayerFillPatternTypeStretch
  | LayerFillPatternTypeFit;

export type LayerFillPattern = {
  fillType: LayerFillTypePattern,
  blendMode: LayerBlendMode,
  opacity: number,
  patternFillType: LayerFillPatternType,
  patternTileScale: number,
  patternWidth?: number,
  patternHeight?: number,
  imageUrl: string,
  imageId: string
};

export type LayerFillNoiseTypeBlack = 1;
export type LayerFillNoiseTypeWhite = 2;
export type LayerFillNoiseTypeColor = 3;
export type LayerFillNoiseType =
  | LayerFillNoiseTypeBlack
  | LayerFillNoiseTypeWhite
  | LayerFillNoiseTypeColor;

export type LayerFillNoise = {
  fillType: LayerFillTypeNoise,
  blendMode: LayerBlendMode,
  opacity: number,
  noiseIndex: LayerFillNoiseType,
  noiseIntensity: number
};

export type LayerFill =
  | LayerFillSolid
  | LayerFillGradient
  | LayerFillPattern
  | LayerFillNoise;

export type LayerListStyle = "" | "disc" | "numbered";

export type LayerResizingConstraint = {
  top?: boolean,
  right?: boolean,
  bottom?: boolean,
  left?: boolean,
  fixedWidth?: boolean,
  fixedHeight?: boolean
};

export type LayerShadow = {
  color: LayerColor,
  blurRadius: number,
  spread: number,
  x: number,
  y: number
};

export type LayerShadows = {
  outer?: LayerShadow[],
  inner?: LayerShadow[]
};

export type LayerTextStyle = {
  styleName?: string,
  fixed?: boolean,
  fontName?: string,
  fontSize?: number,
  lineHeight?: number,
  characterSpacing?: number,
  paragraphSpacing?: number,
  horizontalAlignment?: LayerHorizontalAlignment,
  verticalAlignment?: number, // TODO: possible values?
  color?: LayerColor,
  listStyle?: LayerListStyle,
  textTransform?: LayerTextTransform,
  textDecoration?: LayerTextDecoration
};

export type LayerOverrideProperties = {
  ...$Diff<LayerDataProperties, { overrides: * }> // eslint-disable-line no-use-before-define
};

export type LayerOverrideData = {
  symbolId?: string,
  properties?: LayerOverrideProperties,
  [layerId: string]: LayerOverrideData
};

export type LayerDataAsset = {
  fileFormat: string,
  formatName: string,
  namingScheme: string,
  scale: string
};

export type LayerDataProperties = {
  styleName?: string,
  name: string,
  isVisible: boolean,
  isLocked: boolean,
  width: number,
  height: number,
  x: number,
  y: number,
  rotation: number,
  opacity: number,
  hasClippingMask: boolean,
  underClippingMask: boolean,
  textStyleIndex: LayerTextStyle[],
  colorIndex: LayerColor[],
  blendMode: LayerBlendMode,
  hasClickThrough?: boolean,
  imageId?: string,
  textContent?: string,
  backgroundColor?: LayerColor,
  borderRadius?: LayerBorderRadius,
  text?: LayerTextStyle,
  fills?: LayerFill[],
  borders?: LayerBorder[],
  shadows?: LayerShadows,
  resizingConstraint?: LayerResizingConstraint,
  overrides?: LayerOverrideData,
  assets?: LayerDataAsset[]
};

/**
 * @name PreviewMeta
 * @property {string} webUrl
 */
export type PreviewMeta = {
  webUrl: string
};

/**
 * @name LayerData
 * @property {string[]} childIds Array of UUID's for the layers children, if any
 * @property {string} id UUID of the chid layer
 * @property {string} libraryId UUID of the library file this layer is from
 * @property {string} libraryName The name of the library file this layer is from
 * @property {string} parentId UUID of the parent layer, if any
 * @property {LayerProperties} properties Layer properties (to be documented)
 * @property {string} symbolId UUID of the parent symbol, if any
 * @property {string} type One of <code>artboard</code>, <code>layer</code>,
 * <code>symbolMaster</code>, <code>symbolInstance</code>, <code>group</code>,
 * <code>text</code>, <code>bitmap</code>, <code>shapeGroup</code>, <code>shapePath</code>,
 * <code>rectangle</code>, <code>oval</code>, <code>polygon</code>, <code>triangle</code>,
 * <code>star</code>, <code>page</code>, <code>slice</code>, <code>hotspot</code>
 */
export type LayerData = {
  id: string,
  libraryName: string,
  libraryId: string,
  symbolId?: string,
  parentId?: string,
  childIds: string[],
  type:
    | "artboard"
    | "layer"
    | "symbolMaster"
    | "symbolInstance"
    | "group"
    | "text"
    | "bitmap"
    | "shapeGroup"
    | "shapePath"
    | "rectangle"
    | "oval"
    | "polygon"
    | "triangle"
    | "star"
    | "page"
    | "slice"
    | "hotspot",
  properties: LayerDataProperties
};

/**
 * @name LayerDataset
 * @property {string} branchId UUID of the branch that this layer is contained within
 * @property {string} fileId UUID of the file that this layer is contained within
 * @property {string} layerId UUID of the layer that this data is loaded from
 * @property {{string: LayerData}} layers An object that describes the child layers
 * @property {string} projectId UUID of the project that this data is contained within
 * @property {string} branchId SHA of the commit where the layer was last changed
 */
export type LayerDataset = {
  projectId: string,
  branchId: string,
  sha: string,
  fileId: string,
  layerId: string,
  layers: { [layerId: string]: LayerData }
};

/**
 * @name NotificationBase
 * @property {string} branchId
 * @property {string} commentId
 * @property {string} createdAt
 * @property {string} id
 * @property {User} initiatingUser
 * @property {string} initiatingUserId
 * @property {Organization} organization
 * @property {string} organizationId
 * @property {Project} project
 * @property {string} projectId
 * @property {string} readAt?
 */
type NotificationBase = {
  branchId: string,
  commentId: string,
  createdAt: string,
  id: string,
  initiatingUser: User,
  initiatingUserId: string,
  organization: Organization,
  organizationId: string,
  project: Project,
  projectId: string,
  readAt?: string
};

/**
 * @name NotificationBranchArchived
 * @property {string} messageType
 * @property {object} payload
 * @property {string} payload.branchName
 * @property {string} payload.previousStatus
 */
export type NotificationBranchArchived = NotificationBase & {
  messageType: "BRANCH_ARCHIVED",
  payload: {
    branchName: string,
    previousStatus: string
  }
};

/**
 * @name NotificationBranchCreated
 * @property {string} messageType
 * @property {object} payload
 * @property {string} payload.branchName
 * @property {string} payload.branchDescription?
 */
export type NotificationBranchCreated = NotificationBase & {
  messageType: "BRANCH_CREATED",
  payload: {
    branchName: string,
    branchDescription?: string
  }
};

/**
 * @name NotificationBranchDeleted
 * @property {string} messageType
 * @property {object} payload
 * @property {string} payload.branchName
 * @property {string} payload.previousStatus
 */
export type NotificationBranchDeleted = NotificationBase & {
  messageType: "BRANCH_DELETED",
  payload: {
    branchName: string,
    previousStatus: string
  }
};

/**
 * @name NotificationBranchDescriptionUpdated
 * @property {string} messageType
 * @property {object} payload
 * @property {string} payload.branchName
 * @property {string} payload.branchDescription
 * @property {string} payload.previousDescription
 */
export type NotificationBranchDescriptionUpdated = NotificationBase & {
  messageType: "BRANCH_DESCRIPTION_UPDATED",
  payload: {
    branchName: string,
    branchDescription: string,
    previousDescription: string
  }
};

/**
 * @name NotificationBranchRenamed
 * @property {string} messageType
 * @property {object} payload
 * @property {string} payload.branchName
 * @property {string} payload.previousName
 */
export type NotificationBranchRenamed = NotificationBase & {
  messageType: "BRANCH_RENAMED",
  payload: {
    branchName: string,
    previousName: string
  }
};

/**
 * @name NotificationBranchStatusUpdated
 * @property {string} messageType
 * @property {object} payload
 * @property {string} payload.branchName
 * @property {string} payload.previousStatus
 * @property {string} payload.status
 */
export type NotificationBranchStatusUpdated = NotificationBase & {
  messageType: "BRANCH_STATUS_UPDATED",
  payload: {
    branchName: string,
    previousStatus: string,
    status: string
  }
};

/**
 * @name NotificationBranchUnarchived
 * @property {string} messageType
 * @property {object} payload
 * @property {string} payload.branchName
 * @property {string} payload.status
 */
export type NotificationBranchUnarchived = NotificationBase & {
  messageType: "BRANCH_UNARCHIVED",
  payload: {
    branchName: string,
    status: string
  }
};

/**
 * @name NotificationCollectionPublished
 * @property {string} messageType
 * @property {object} payload
 * @property {string} payload.collectionId
 * @property {string} payload.name
 */
export type NotificationCollectionPublished = NotificationBase & {
  messageType: "COLLECTION_PUBLISHED",
  payload: {
    collectionId: string,
    name: string
  }
};

/**
 * @name NotificationProjectArchived
 * @property {string} messageType
 * @property {object} payload
 * @property {string} payload.projectName
 */
export type NotificationProjectArchived = NotificationBase & {
  messageType: "PROJECT_ARCHIVED",
  payload: {
    projectName: string
  }
};

/**
 * @name NotificationProjectCreated
 * @property {string} messageType
 * @property {object} payload
 * @property {string} payload.projectName
 */
export type NotificationProjectCreated = NotificationBase & {
  messageType: "PROJECT_CREATED",
  payload: {
    projectName: string
  }
};

/**
 * @name NotificationProjectDeleted
 * @property {string} messageType
 * @property {object} payload
 * @property {string} payload.projectName
 */
export type NotificationProjectDeleted = NotificationBase & {
  messageType: "PROJECT_DELETED",
  payload: {
    projectName: string
  }
};

/**
 * @name NotificationProjectDescriptionChanged
 * @property {string} messageType
 * @property {object} payload
 * @property {string} payload.projectName
 */
export type NotificationProjectDescriptionChanged = NotificationBase & {
  messageType: "PROJECT_DESCRIPTION_CHANGED",
  payload: {
    projectName: string
  }
};

/**
 * @name NotificationProjectRenamed
 * @property {string} messageType
 * @property {object} payload
 * @property {string} payload.previousName
 * @property {string} payload.newName
 */
export type NotificationProjectRenamed = NotificationBase & {
  messageType: "PROJECT_RENAMED",
  payload: {
    previousName: string,
    newName: string
  }
};

/**
 * @name NotificationProjectUnarchived
 * @property {string} messageType
 * @property {object} payload
 * @property {string} payload.projectName
 */
export type NotificationProjectUnarchived = NotificationBase & {
  messageType: "PROJECT_UNARCHIVED",
  payload: {
    projectName: string
  }
};

/**
 * @name NotificationProjectTransferred
 * @property {string} messageType
 * @property {object} payload
 * @property {string} payload.projectName
 * @property {string} payload.previousOrganizationName
 * @property {string} payload.newOrganizationName
 */
export type NotificationProjectTransferred = NotificationBase & {
  messageType: "PROJECT_TRANSFERRED",
  payload: {
    projectName: string,
    previousOrganizationName: string,
    newOrganizationName: string
  }
};

/**
 * @name NotificationCommitCommon
 * @property {string} pushNotificationId
 * @property {object} sha
 * @property {string} title
 * @property {string} description
 * @property {string} branchName
 */
type NotificationCommitCommon = {
  pushNotificationId: string,
  sha: string,
  title: string,
  description: string,
  branchName: string
};

/**
 * @name NotificationCommit
 * @property {string} messageType
 * @property {NotificationCommitCommon} payload
 */
export type NotificationCommit = NotificationBase & {
  messageType: "COMMIT",
  payload: NotificationCommitCommon
};

/**
 * @name NotificationMergeCommit
 * @property {string} messageType
 * @property {object} payload
 * @property {string} payload.sourceBranchId
 * @property {string} payload.sourceBranchName
 * @property {string} payload.destinationBranchId
 * @property {string} payload.destinationBranchName
 */
export type NotificationMergeCommit = NotificationBase & {
  messageType: "MERGE_COMMIT",
  payload: NotificationCommitCommon & {
    sourceBranchId: string,
    sourceBranchName: string,
    destinationBranchId: string,
    destinationBranchName: string
  }
};

/**
 * @name NotificationUpdateCommit
 * @property {object} payload
 * @property {string} payload.sourceBranchId
 * @property {string} payload.sourceBranchName
 */
export type NotificationUpdateCommit = NotificationBase & {
  messageType: "UPDATE_COMMIT",
  payload: NotificationCommitCommon & {
    sourceBranchId: string,
    sourceBranchName: string
  }
};

/**
 * @name NotificationCommentCreated
 * @property {object} payload
 * @property {string} payload.reviewId?
 * @property {ReviewStatus} payload.reviewStatus?
 * @property {string} payload.commentFileId
 * @property {string} payload.commentFileName
 * @property {string} payload.commentId
 * @property {string} payload.commentLayerId
 * @property {string} payload.commentLayerName
 * @property {string} payload.commentPageId
 * @property {string} payload.commentPageName
 * @property {string} payload.commentParentId
 * @property {string} payload.commitBranchId
 * @property {string} payload.commitBranchName
 * @property {string} payload.commitSha
 * @property {string} payload.commitMessage

 */
export type NotificationCommentCreated = NotificationBase & {
  messageType: "COMMENT_CREATED",
  payload: {
    reviewId?: string,
    reviewStatus?: ReviewStatus,
    commentFileId: string,
    commentFileName: string,
    commentId: string,
    commentLayerId: string,
    commentLayerName: string,
    commentPageId: string,
    commentPageName: string,
    commentParentId: string,
    commitBranchId: string,
    commitBranchName: string,
    commitSha: string,
    commitMessage: string
  }
};

/**
 * @type NotificationReviewRequested
 * @property {string} messageType
 * @property {object} payload
 * @property {string} payload.branchName
 * @property {string} payload.reviewerName
 * @property {string} payload.reviewerId

 */
export type NotificationReviewRequested = NotificationBase & {
  messageType: "REVIEW_REQUESTED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string
  }
};

/**
 * @name NotificationReviewDismissed
 * @property {object} payload
 * @property {string} payload.branchName
 * @property {string} payload.reviewerName
 * @property {string} payload.reviewerId
 */
export type NotificationReviewDismissed = NotificationBase & {
  messageType: "REVIEW_DISMISSED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string
  }
};

/**
 * @name NotificationReviewerRemoved
 * @property {object} payload
 * @property {string} payload.branchName
 * @property {string} payload.reviewerName
 * @property {string} payload.reviewerId
 */
export type NotificationReviewerRemoved = NotificationBase & {
  messageType: "REVIEWER_REMOVED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string
  }
};

/**
 * @name NotificationReviewCompleted
 * @property {object} payload
 * @property {string} payload.branchName
 * @property {string} payload.reviewerName
 * @property {string} payload.reviewerId
 * @property {string} payload.status
 */
export type NotificationReviewCompleted = NotificationBase & {
  messageType: "REVIEW_COMPLETED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string,
    status: string
  }
};

/**
 * @name Notification
 * @property {string} branchId UUID of the branch that triggered this notification, if applicable
 * @property {string} commentId UUID of the comment that triggered this notification, if applicable
 * @property {string} createdAt Timestamp at which the notification was sent
 * @property {string} id UUID identifier of the notification
 * @property {string} initiatingUser User that triggered this notification, if applicable
 * @property {string} initiatingUserId UUID of the user that triggered this notification, if applicable
 * @property {string} messageType The type of this activity that triggered this notification,
 * may be one of
 * <code>BRANCH_ARCHIVED</code>,
 * <code>BRANCH_CREATED</code>,
 * <code>BRANCH_DELETED</code>,
 * <code>BRANCH_DESCRIPTION_UPDATED</code>,
 * <code>BRANCH_RENAMED</code>,
 * <code>BRANCH_STATUS_UPDATED</code>,
 * <code>BRANCH_UNARCHIVED</code>,
 * <code>COLLECTION_PUBLISHED</code>,
 * <code>COMMENT_CREATED</code>,
 * <code>COMMIT</code>,
 * <code>MERGE_COMMIT</code>,
 * <code>PROJECT_ARCHIVED</code>,
 * <code>PROJECT_CREATED</code>,
 * <code>PROJECT_DELETED</code>,
 * <code>PROJECT_DESCRIPTION_CHANGED</code>,
 * <code>PROJECT_RENAMED</code>,
 * <code>PROJECT_TRANSFERRED</code>,
 * <code>PROJECT_UNARCHIVED</code>,
 * <code>REVIEWER_REMOVED</code>,
 * <code>REVIEW_COMPLETED</code>,
 * <code>REVIEW_DISMISSED</code>,
 * <code>REVIEW_REQUESTED</code>,
 * <code>UPDATE_COMMIT</code>
 * @property {string} organization Organization that triggered this notification, if applicable
 * @property {string} organizationId UUID of the organization that triggered this notification, if applicable
 * @property {string} project Project that triggered this notification, if applicable
 * @property {string} projectId UUID of the project that triggered this notification, if applicable
 * @property {object} payload Object containing information specific to activity that triggered this notification
 * @property {string} readAt Timestamp at which the notification was read or dismissed

 */
export type Notification =
  | NotificationBranchArchived
  | NotificationBranchCreated
  | NotificationBranchDeleted
  | NotificationBranchDescriptionUpdated
  | NotificationBranchRenamed
  | NotificationBranchStatusUpdated
  | NotificationBranchUnarchived
  | NotificationCollectionPublished
  | NotificationCommentCreated
  | NotificationCommit
  | NotificationMergeCommit
  | NotificationProjectArchived
  | NotificationProjectCreated
  | NotificationProjectDeleted
  | NotificationProjectDescriptionChanged
  | NotificationProjectRenamed
  | NotificationProjectTransferred
  | NotificationProjectUnarchived
  | NotificationReviewCompleted
  | NotificationReviewDismissed
  | NotificationReviewRequested
  | NotificationReviewerRemoved
  | NotificationUpdateCommit;

/**
 * @property {string} createdAt - Timestamp at which the asset was created
 * @property {boolean} defaultAbstractFormat - Indicates if this asset is the default asset for a layer
 * @property {string} fileFormat - File type of this asset
 * @property {string} fileId - File ID of this asset
 * @property {string} formatName - Format of this file, e.g. "2x"
 * @property {string} id - UUID identifier of the asset
 * @property {string} layerId - UUID of the layer this asset belongs to
 * @property {string} layerName - Name of the layer this asset belongs to
 * @property {string} namingScheme - Determines how the <code>formatName</code> is
 * applied when constructing the filename for this asset.
 * "1" means the <code>formatName</code> will be used as a prefix,
 * "0" means it will be used as a suffix.
 * @property {string} nestedLayerId - ID of the nested layer this asset belongs to
 * @property {string} projectId - ID of the project this asset belongs to
 * @property {string} scale - Scale of this asset in Sketch, e.g. "1.00"
 * @property {string} sha - SHA of the commit containing the version of the file this asset belongs to
 * @property {string} url - Direct URL to the asset file
 */
export type Asset = {
  createdAt: string,
  defaultAbstractFormat: boolean,
  fileFormat: string,
  fileId: string,
  formatName: string,
  id: string,
  layerId: string,
  layerName: string,
  namingScheme: string,
  nestedLayerId: string,
  projectId: string,
  scale: string,
  sha: string,
  url: string
};

/**
 * @name Section
 * @property {string} id UUID
 * @property {string} name The name of the section
 * @property {string} organizationId UUID of the organization this section belongs to
 */
export type Section = {
  id: string,
  name: string,
  organizationId: string
};

/**
 * @name WebhookType
 * @property {boolean} active Indicates if this webhook is currently listening for new events
 * @property {string} createdAt Timestamp indicating when this webhook was created
 * @property {number} errorCount Number indicating the number of failed deliveries for this webhook
 * @property {WebhookEvent} events Array of webhook event objects configured for this webhook
 * @property {string} id UUID identifier for this webhook
 * @property {string} lastPushedAt Timestamp indicating the time of the most recent delivery for this webhook
 * @property {string} organizationId UUID of the organization this webook belongs to
 * @property {string} updatedAt Timestamp indicating when this webhook was created
 * @property {string} url URL that this webhook will <code>POST</code> deliveries to
 * @property {User} user The user that created the webhook
 */
export type Webhook = {
  active: boolean,
  createdAt: string,
  errorCount?: number,
  events: string[],
  id: string,
  lastPushedAt?: string,
  organizationId: string,
  updatedAt: string,
  url: string,
  user?: User
};

/**
 * @name WebhookGroup
 * @property {string} id UUID identifier for this webhook event group
 * @property {string} name The name of this webhook event group
 */
export type WebhookGroup = {
  id: string,
  name: string
};

/**
 * @name WebhookEvent
 * @property {string} id UUID identifier for this webhook event
 * @property {string} group Category that this webhook event belongs to
 * @property {string} name The name of this webhook event
 */
export type WebhookEvent = {
  id: string,
  group: WebhookGroup,
  name: string
};

/**
 * @name NewWebhook
 * @property {boolean} active Indicates if this webhook is currently listening for new events
 * @property {WebhookEvent} events Array of webhook event objects configured for this webhook
 * @property {string} key An optional secret used to validate deliveries for this webhook
 * @property {string} organizationId UUID of the organization this webook belongs to
 * @property {string} url URL that this webhook will <code>POST</code> deliveries to
 */
export type NewWebhook = {
  active: boolean,
  events: string[],
  key: string,
  organizationId: string,
  url: string
};

/**
 * @name WebhookDescriptor
 * @property {string} organizationId
 * @property {string} webhookId
 */
export type WebhookDescriptor = {|
  organizationId: string,
  webhookId: string
|};

/**
 * @name WebhookDescriptor
 * @property {string} deliveryId
 * @property {string} organizationId
 * @property {string} webhookId
 */
export type WebhookDeliveryDescriptor = {
  deliveryId: string,
  organizationId: string,
  webhookId: string
};

/**
 * @name WebhookDelivery
 * @property {boolean} error
 * @property {WebhookEvent} event
 * @property {string} id
 * @property {string} pushedAt
 * @property {object} request
 * @property {object} request.body
 * @property {object} request.headers
 * @property {object} response
 * @property {object} response.body
 * @property {number} response.code
 * @property {object} response.headers
 * @property {string} webhookId
 */
type WebhookDelivery = {
  error: boolean,
  event: WebhookEvent,
  id: string,
  pushedAt: string,
  request: {
    body: Object,
    headers: Object
  },
  response: {
    body: Object,
    code: number,
    headers: Object
  },
  webhookId: string
};

/**
 *
 *
 * @export
 * @interface CursorPromise
 * @template T
 */
export interface CursorPromise<T> extends Promise<T> {
  next(): CursorPromise<T>;
}

export type ReviewRequest = {
  branchId: string,
  commentId?: string,
  createdAt: string,
  id: string,
  projectId: string,
  requester: User,
  requesterId: string,
  reviewer: User,
  reviewerId: string,
  status: ReviewStatus,
  statusChangedAt: string
};
