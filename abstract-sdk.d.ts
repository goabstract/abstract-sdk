// errors.js
interface ErrorData {
  path: string,
  body: any
}

export class APITokenError extends BaseError {}
export class BaseError extends Error {}
export class FileAPIError extends BaseError {}

export class EndpointUndefinedError extends BaseError {
  constructor(endpoint: string | null, transport: string);
}

export class InternalServerError extends BaseError {
  data: ErrorData;
  constructor(path: string, body: any);
}

export class NotFoundError extends BaseError {
  data: ErrorData;
  constructor(path: string, body: any);
}

export class RateLimitError extends BaseError {
  data: ErrorData & { resetsAt?: number };
  constructor(path: string, body: any, response?: Response);
}

export class UnauthorizedError extends BaseError {
  data: ErrorData;
  constructor(path: string, body: any);
}

export class ForbiddenError extends BaseError {
  data: ErrorData;
  constructor(path: string, body: any);
}

export class ServiceUnavailableError extends BaseError {
  data: ErrorData;
  constructor(path: string, body: any);
}

// paginate.js
export function paginate<T>(cursor: CursorPromise<T>): AsyncIterable<T>;

// sketch.js
export namespace sketch {
  function branch(context: any): BranchDescriptor;
  function file(context: any): FileDescriptor;
  function isAbstractDocument(context: any): boolean;
  function isAbstractPluginInstalled(): boolean;
  function isSketchPlugin(): boolean;
  function project(context: any): ProjectDescriptor;
}

interface Webhooks extends Endpoint {
  list(descriptor: OrganizationDescriptor): Promise<Webhook[]>;
  info(descriptor: WebhookDescriptor): Promise<Webhook>;
  events(descriptor: OrganizationDescriptor): Promise<WebhookEvent[]>;
  create(descriptor: OrganizationDescriptor, webhook: NewWebhook): Promise<Webhook>;
  update(descriptor: OrganizationDescriptor, webhook: Webhook): Promise<Webhook>;
  delete(descriptor: WebhookDescriptor): Promise<void>;
  ping(descriptor: WebhookDescriptor): Promise<void>;
  deliveries(descriptor: WebhookDescriptor): Promise<WebhookDelivery[]>;
  redeliver(descriptor: WebhookDeliveryDescriptor): Promise<void>;
}

// Client.js
export class Client {
  activities: Activities;
  assets: Assets;
  branches: Branches;
  changesets: Changesets;
  collectionLayers: CollectionLayers;
  collections: Collections;
  comments: Comments;
  commits: Commits;
  data: Data;
  descriptors: Descriptors;
  files: Files;
  layers: Layers;
  memberships: Memberships;
  notifications: Notifications;
  organizations: Organizations;
  pages: Pages;
  previews: Previews;
  projects: Projects;
  shares: Shares;
  users: Users;
  webhooks: Webhooks;
  cache: Map<string, any>;

  constructor(options: Partial<CommandOptions>);
}

// Endpoint.js
interface CacheConfiguration {
  disable?: boolean;
  key: string;
}

interface EndpointRequest<T> {
  api?: () => T;
  cli?: () => T;
  cache?: CacheConfiguration
}

interface Endpoint {
  apiUrl: string | Promise<string>;
  assetUrl: string | Promise<string>;
  client: Client;
  lastCalledEndpoint?: string;
  maxCacheSize: number;
  previewUrl: string | Promise<string>;
  transportMode: string;
  webUrl: string | Promise<string>;

  constructor(client: Client, options: CommandOptions): Endpoint;
  accessToken: () => Promise<AccessToken>;
  cliRequest(args: string[]): Promise<any>;
  request<T>(request: EndpointRequest<T>): T;

  apiRequest(
    input: string,
    init: Object,
    overrideHostname?: string
  ): Promise<any>;

  apiRawRequest(
    input: string,
    init: Object,
    overrideHostname?: string
  ): Promise<ArrayBuffer>;
}

// Endpoints
interface Activities extends Endpoint {
  info(descriptor: ActivityDescriptor): Promise<Activity>;
  list(
    descriptor: BranchDescriptor | OrganizationDescriptor | ProjectDescriptor,
    options?: ListOptions
  ): CursorPromise<Activity[]>;
}

interface Assets extends Endpoint {
  info(descriptor: AssetDescriptor): Promise<Asset>;
  raw(descriptor: AssetDescriptor, options?: RawOptions): Promise<ArrayBuffer>;
  commit(descriptor: CommitDescriptor): Promise<Asset[]>;
  file(descriptor: FileDescriptor, options?: ListOptions): CursorPromise<Asset[]>;
}

interface Branches extends Endpoint {
  info(descriptor: BranchDescriptor): Promise<Branch>;
  list(
    descriptor: ProjectDescriptor,
    options?: { filter?: "active" | "archived" | "mine" }
  ): Promise<Branch[]>;
}

interface Changesets extends Endpoint {
  branch(descriptor: BranchDescriptor): Promise<Changeset>;
  commit(descriptor: CommitDescriptor): Promise<Changeset>;
}

interface CollectionLayers extends Endpoint {
  add(descriptor: CollectionDescriptor, layer: NewCollectionLayer): Promise<CollectionLayer>;
  addMany(descriptor: CollectionDescriptor, layers: NewCollectionLayer[]): Promise<CollectionLayer[]>;
  remove(descriptor: CollectionLayerDescriptor): Promise<void>;
  move(descriptor: CollectionLayerDescriptor, order: number): Promise<CollectionLayer[]>;
  update(descriptor: CollectionLayerDescriptor, layer: UpdatedCollectionLayer): Promise<CollectionLayer>;
}

interface Collections extends Endpoint {
  create(
    descriptor: ProjectDescriptor,
    collection: NewCollection
  ): Promise<Collection>;

  info(
    descriptor: CollectionDescriptor,
    options?: { layersPerCollection?: number | "all" }
  ): Promise<CollectionResponse>;

  list(
    descriptor: ProjectDescriptor | BranchDescriptor,
    options?: { layersPerCollection?: number | "all" }
  ): Promise<CollectionsResponse>;

  update(
    descriptor: CollectionDescriptor,
    collection: UpdatedCollection
  ): Promise<Collection>;
}

interface Comments extends Endpoint {
  info(descriptor: CommentDescriptor): Promise<Comment>;
  create(
    descriptor:
      BranchDescriptor
      | CommitDescriptor
      | PageDescriptor
      | LayerVersionDescriptor & { pageId: string },
    comment: NewComment
  ): Promise<Comment>;

  list(
    descriptor:
      BranchDescriptor
      | CommitDescriptor
      | LayerVersionDescriptor
      | PageDescriptor,
    options?: ListOptions
  ): CursorPromise<Comment[]>;
}

interface Commits extends Endpoint {
  info(
    descriptor: CommitDescriptor | FileDescriptor | LayerVersionDescriptor
  ): Promise<Commit>;

  list(
    descriptor: BranchDescriptor | FileDescriptor | LayerDescriptor,
    options?: {
      limit?: number,
      startSHA?: string,
      endSHA?: string
    }
  ): Promise<Commit[]>;
}

interface Data extends Endpoint {
  info(descriptor: LayerVersionDescriptor): Promise<LayerDataset>;
}

interface Descriptors extends Endpoint {
  getLatestDescriptor<T>(descriptor: T): Promise<T>;
}

interface Files extends Endpoint {
  info(descriptor: FileDescriptor): Promise<File>;
  list(descriptor: CommitDescriptor): Promise<File[]>;
  raw(descriptor: FileDescriptor, options?: RawOptions): Promise<void>;
}

interface Layers extends Endpoint {
  info(descriptor: LayerVersionDescriptor): Promise<Layer>;
  list(
    descriptor: FileDescriptor | PageDescriptor,
    options?: ListOptions
  ): Promise<Layer[]>;
}

interface Memberships extends Endpoint {
  info(
    descriptor: OrganizationMembershipDescriptor | ProjectMembershipDescriptor
  ): Promise<Membership>;

  list(
    descriptor: OrganizationDescriptor | ProjectDescriptor
  ): Promise<Membership[]>;
}

interface Notifications extends Endpoint {
  info(descriptor: NotificationDescriptor): Promise<Notification>;
  list(
    descriptor: OrganizationDescriptor,
    options?: ListOptions
  ): CursorPromise<Notification[]>;
}

interface Organizations extends Endpoint {
  info(descriptor: OrganizationDescriptor): Promise<Organization>;
  list(): Promise<Organization[]>;
}

interface Pages extends Endpoint {
  info(descriptor: PageDescriptor): Promise<Page>;
  list(descriptor: FileDescriptor): Promise<Page[]>;
}

interface Previews extends Endpoint {
  info(descriptor: LayerVersionDescriptor): Promise<PreviewMeta>;
  raw(descriptor: LayerVersionDescriptor, options?: RawOptions): Promise<ArrayBuffer>;
  url(descriptor: LayerVersionDescriptor): Promise<string>;
}

interface Projects extends Endpoint {
  info(descriptor: ProjectDescriptor): Promise<Project>;
  list(
    descriptor: OrganizationDescriptor,
    options?: {
      filter?: "active" | "archived",
      sectionId?: string
    }
  ): Promise<Project[]>;
}

interface Sections extends Endpoint {
  list(descriptor: OrganizationDescriptor): Promise<Section[]>;
}

interface Shares extends Endpoint {
  info<T>(descriptor: ShareDescriptor): Promise<T>;
  create<T>(
    descriptor: OrganizationDescriptor,
    shareInput: ShareInput
  ): Promise<T>;
}

interface Users extends Endpoint {
  info(descriptor: UserDescriptor): Promise<User>;
  list(descriptor: OrganizationDescriptor | ProjectDescriptor): Promise<User[]>;
}

// Supporting types

// @flow

type OrganizationDescriptor = {
  organizationId: string
};

type ProjectDescriptor = {
  projectId: string
};

type CommentDescriptor = {
  commentId: string
};

type CollectionDescriptor = {
  projectId: string,
  collectionId: string
};

type CollectionLayerDescriptor = {
  projectId: string,
  collectionLayerId: string
};

type ActivityDescriptor = {
  activityId: string
};

type NotificationDescriptor = {
  notificationId: string
};

type ObjectDescriptor = {
  sha: "latest" | string,
  projectId: string,
  branchId: string | "master"
};

type CommitDescriptor = {
  sha: string,
  projectId: string,
  branchId: string | "master"
};

type BranchDescriptor = {
  projectId: string,
  branchId: string | "master"
};

type FileDescriptor = ObjectDescriptor & {
  fileId: string
};

type PageDescriptor = ObjectDescriptor & {
  fileId: string,
  pageId: string
};

type LayerVersionDescriptor = ObjectDescriptor & {
  fileId: string,
  layerId: string
};

type LayerDescriptor = {
  projectId: string,
  branchId: string | "master"
  fileId: string,
  layerId: string
};

type ShareDescriptor = { url: string } | { shareId: string };

type UserDescriptor = {
  userId: string
};

type AssetDescriptor = {
  assetId: string,
  projectId: string
};

type ListOptions = {
  limit?: number,
  offset?: number
};

type RawOptions = {
  disableWrite?: boolean,
  filename?: string
};

type ReviewStatus = "REQUESTED" | "REJECTED" | "APPROVED";

type ActivityBase = {
  id: string,
  createdAt: string,
  projectId: string,
  branchId: string,
  userId: string
};

type ActivityBranchArchived = ActivityBase & {
  type: "BRANCH_ARCHIVED",
  payload: {
    branchName: string,
    previousStatus: string
  }
};

type ActivityBranchCreated = ActivityBase & {
  type: "BRANCH_CREATED",
  payload: {
    branchName: string,
    branchDescription?: string
  }
};

type ActivityBranchDeleted = ActivityBase & {
  type: "BRANCH_DELETED",
  payload: {
    branchName: string,
    previousStatus: string
  }
};

type ActivityBranchDescriptionUpdated = ActivityBase & {
  type: "BRANCH_DESCRIPTION_UPDATED",
  payload: {
    branchName: string,
    branchDescription: string,
    previousDescription: string
  }
};

type ActivityBranchRenamed = ActivityBase & {
  type: "BRANCH_RENAMED",
  payload: {
    branchName: string,
    previousName: string
  }
};

type ActivityBranchStatusUpdated = ActivityBase & {
  type: "BRANCH_STATUS_UPDATED",
  payload: {
    branchName: string,
    previousStatus: string,
    status: string
  }
};

type ActivityBranchUnarchived = ActivityBase & {
  type: "BRANCH_UNARCHIVED",
  payload: {
    branchName: string,
    status: string
  }
};

type ActivityCollectionPublished = ActivityBase & {
  type: "COLLECTION_PUBLISHED",
  payload: {
    collectionId: string,
    name: string
  }
};

type ActivityProjectArchived = ActivityBase & {
  type: "PROJECT_ARCHIVED",
  payload: {
    projectName: string
  }
};

type ActivityProjectCreated = ActivityBase & {
  type: "PROJECT_CREATED",
  payload: {
    projectName: string
  }
};

type ActivityProjectDeleted = ActivityBase & {
  type: "PROJECT_DELETED",
  payload: {
    projectName: string
  }
};

type ActivityProjectDescriptionChanged = ActivityBase & {
  type: "PROJECT_DESCRIPTION_CHANGED",
  payload: {
    projectName: string
  }
};

type ActivityProjectRenamed = ActivityBase & {
  type: "PROJECT_RENAMED",
  payload: {
    previousName: string,
    newName: string
  }
};

type ActivityProjectUnarchived = ActivityBase & {
  type: "PROJECT_UNARCHIVED",
  payload: {
    projectName: string
  }
};

type ActivityProjectTransferred = ActivityBase & {
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

type ActivityCommit = ActivityBase & {
  type: "COMMIT",
  payload: ActivityCommitCommon
};

type ActivityMergeCommit = ActivityBase & {
  type: "MERGE_COMMIT",
  payload: ActivityCommitCommon & {
    sourceBranchId: string,
    sourceBranchName: string,
    destinationBranchId: string,
    destinationBranchName: string
  }
};

type ActivityUpdateCommit = ActivityBase & {
  type: "UPDATE_COMMIT",
  payload: ActivityCommitCommon & {
    sourceBranchId: string,
    sourceBranchName: string
  }
};

type ActivityCommentCreated = ActivityBase & {
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

type ActivityReviewRequested = ActivityBase & {
  type: "REVIEW_REQUESTED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string
  }
};

type ActivityReviewDismissed = ActivityBase & {
  type: "REVIEW_DISMISSED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string
  }
};

type ActivityReviewerRemoved = ActivityBase & {
  type: "REVIEWER_REMOVED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string
  }
};

type ActivityReviewCompleted = ActivityBase & {
  type: "REVIEW_COMPLETED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string,
    status: string
  }
};

type Activity =
  ActivityBranchArchived
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

type User = {
  id: string,
  primaryEmailId: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string,
  username: string,
  name: string,
  avatarUrl: string
};

type ProjectMembershipDescriptor = {
  userId: string,
  projectId: string
};

type OrganizationMembershipDescriptor = {
  userId: string,
  organizationId: string
};

type Membership = {
  createdAt: string,
  organizationId: string,
  projectId?: string,
  role: string,
  user: User,
  userId: string
};

type Organization = {
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

type Project = {
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
  repoCreatedAt: string,
  visibility: "organization" | "project",
  sizeInBytes: number
};

type BaseShare = {
  id: string,
  url: string,
  appUrl: string,
  userId: string,
  options: {}
};

type ProjectShare = BaseShare & {
  kind: "project",
  descriptor: ProjectDescriptor
};

type CommitShare = BaseShare & {
  kind: "commit",
  descriptor: CommitDescriptor
};

type BranchShare = BaseShare & {
  kind: "branch",
  descriptor: BranchDescriptor
};

type FileShare = BaseShare & {
  kind: "file",
  descriptor: FileDescriptor
};

type PageShare = BaseShare & {
  kind: "page",
  descriptor: PageDescriptor
};

type LayerShare = BaseShare & {
  kind: "layer",
  descriptor: LayerVersionDescriptor,
  options: {
    mode?: "design" | "compare" | "build",
    public?: boolean,
    historyEnabled?: boolean,
    inspectEnabled?: boolean
  }
};

type CommentShare = BaseShare & {
  kind: "comment",
  descriptor: CommentDescriptor
};

type CollectionShare = BaseShare & {
  kind: "collection",
  descriptor: CollectionDescriptor
};

type Share =
  ProjectShare
  | CommitShare
  | BranchShare
  | FileShare
  | PageShare
  | LayerShare
  | CommentShare
  | CollectionShare;

type BaseShareInput = {
  organizationId: string
};

type ProjectShareInput = BaseShareInput & ProjectDescriptor & {
  kind: "project"
};

type CommitShareInput = BaseShareInput & CommitDescriptor & {
  kind: "commit"
};

type BranchShareInput = BaseShareInput & BranchDescriptor & {
  kind: "branch"
};

type FileShareInput = BaseShareInput & FileDescriptor & {
  kind: "file"
};

type PageShareInput = BaseShareInput & PageDescriptor & {
  kind: "page"
};

type LayerShareInput = BaseShareInput & LayerVersionDescriptor & {
  kind: "layer",
  options: {
    public: boolean,
    canInspect: boolean,
    canShowHistory: boolean,
    mode: "design" | "compare" | "build"
  }
};

type CommentShareInput = BaseShareInput & CommentDescriptor & {
  kind: "comment"
};

type CollectionShareInput = BaseShareInput & CollectionDescriptor & {
  kind: "collection"
};

type ShareInput =
  ProjectShareInput
  | CommitShareInput
  | BranchShareInput
  | FileShareInput
  | PageShareInput
  | LayerShareInput
  | CommentShareInput
  | CollectionShareInput;

type Annotation = {
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  editing: boolean,
  scale: number,
  number: number
};

type Comment = {
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

type NewComment = {
  annotation?: Annotation,
  body: string
};

type NewCollectionLayer = {
  fileId: string,
  isPinned?: boolean,
  layerId: string,
  order?: number,
  pageId: string,
  sha: "latest" | string,
  useLatestCommit?: boolean
};

type UpdatedCollectionLayer = {
  fileId?: string,
  isPinned?: boolean,
  layerId?: string,
  order?: number,
  pageId?: string,
  sha?: "latest" | string,
  useLatestCommit?: boolean
};

type CollectionLayer = {
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

type File = {
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

type Collection = {
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

type UpdatedCollection = {
  name?: string,
  description?: string,
  published?: boolean
};

type NewCollection = {
  name: string,
  branchId: string,
  description?: string,
  published?: boolean
};

type Commit = {
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

type Branch = {
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

type ChangesetStatus =
  "added"
  | "deleted"
  | "edited"
  | "edited-indirectly"
  | "none";

type ChangesetFileChange = {
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

type ChangesetPageChange = {
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

type ChangesetLayerChange = {
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

type ChangesetColorsChange = {
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

type ChangesetGradientChange = {
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

type ChangesetLayerStyleChange = {
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

type ChangesetTextStyleChange = {
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

type ChangesetChange =
  ChangesetFileChange
  | ChangesetPageChange
  | ChangesetLayerChange
  | ChangesetColorsChange
  | ChangesetGradientChange
  | ChangesetLayerStyleChange
  | ChangesetTextStyleChange;

type Changeset = {
  id: string,
  sha: string,
  compareToSha: string,
  changes: ChangesetChange[],
  projectId: string,
  branchId: string
};

type Page = {
  id: string,
  name: string,
  type: "" | "library",
  projectId: string,
  sha: string,
  fileId: string,
  order: number
};

type Layer = {
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

type LayerBlendModeNormal = 0;
type LayerBlendModeDarken = 1;
type LayerBlendModeMultiply = 2;
type LayerBlendModeColorBurn = 3;
type LayerBlendModeLighten = 4;
type LayerBlendModeScreen = 5;
type LayerBlendModeAdd = 6;
type LayerBlendModeOverlay = 7;
type LayerBlendModeSoftLight = 8;
type LayerBlendModeHardLight = 9;
type LayerBlendModeDifference = 10;
type LayerBlendModeExclusion = 11;
type LayerBlendModeHue = 12;
type LayerBlendModeSaturation = 13;
type LayerBlendModeColor = 14;
type LayerBlendModeLuminosity = 15;
type LayerBlendMode =
  LayerBlendModeNormal
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

type LayerBorderPositionCenter = 0;
type LayerBorderPositionInside = 1;
type LayerBorderPositionOutside = 2;
type LayerBorderPosition =
  LayerBorderPositionCenter
  | LayerBorderPositionInside
  | LayerBorderPositionOutside;

type LayerFillTypeSolid = 0;
type LayerFillTypeGradient = 1;
type LayerFillTypePattern = 4;
type LayerFillTypeNoise = 5;
type LayerFillType =
  LayerFillTypeSolid
  | LayerFillTypeGradient
  | LayerFillTypePattern
  | LayerFillTypeNoise;

type LayerTextDecorationLineUnderline = "underline";
type LayerTextDecorationLineStrikethrough = "strikethrough";
type LayerTextDecorationLine =
  LayerTextDecorationLineUnderline
  | LayerTextDecorationLineStrikethrough;

type LayerTextDecorationStyleSolid = "solid";
type LayerTextDecorationStyleDouble = "double";
type LayerTextDecorationStyle =
  LayerTextDecorationStyleSolid
  | LayerTextDecorationStyleDouble;

type LayerTextDecoration = {
  line: LayerTextDecorationLine,
  style: LayerTextDecorationStyle
};

type LayerTextTransformNone = 0;
type LayerTextTransformUppercase = 1;
type LayerTextTransformLowercase = 2;
type LayerTextTransform =
  LayerTextTransformNone
  | LayerTextTransformUppercase
  | LayerTextTransformLowercase;

type LayerHorizontalAlignmentLeft = 0;
type LayerHorizontalAlignmentRight = 1;
type LayerHorizontalAlignmentCenter = 2;
type LayerHorizontalAlignmentJustify = 3;
type LayerHorizontalAlignmentNatural = 4;
type LayerHorizontalAlignment =
  LayerHorizontalAlignmentLeft
  | LayerHorizontalAlignmentRight
  | LayerHorizontalAlignmentCenter
  | LayerHorizontalAlignmentJustify
  | LayerHorizontalAlignmentNatural;

type LayerGradientTypeLinear = 0;
type LayerGradientTypeRadial = 1;
type LayerGradientTypeAngular = 2;
type LayerGradientType =
  LayerGradientTypeLinear
  | LayerGradientTypeRadial
  | LayerGradientTypeAngular;

type LayerColor = {
  hex8: string,
  rgba: string,
  components: {
    red: number,
    green: number,
    blue: number,
    alpha: number
  }
};

type LayerGradientStop = {
  position: number,
  color: LayerColor
};

type LayerGradientLinear = {
  gradientType: LayerGradientTypeLinear,
  from: [number, number],
  to: [number, number],
  stops: LayerGradientStop[]
};

type LayerGradientRadial = {
  gradientType: LayerGradientTypeRadial,
  from: [number, number],
  to: [number, number],
  stops: LayerGradientStop[],
  ellipseLength: number
};

type LayerGradientAngular = {
  gradientType: LayerGradientTypeAngular,
  from: [number, number],
  to: [number, number],
  stops: LayerGradientStop[]
};

type LayerGradient =
  LayerGradientLinear
  | LayerGradientRadial
  | LayerGradientAngular;

type LayerBorderSolid = {
  fillType: LayerFillTypeSolid,
  position: LayerBorderPosition,
  thickness: number,
  color: LayerColor
};

type LayerBorderGradient = {
  fillType: LayerFillTypeGradient,
  position: LayerBorderPosition,
  thickness: number,
  gradient: LayerGradient
};

type LayerBorder = LayerBorderSolid | LayerBorderGradient;

type LayerBorderRadius = {
  topLeft: number,
  topRight: number,
  bottomRight: number,
  bottomLeft: number
};

type LayerFillSolid = {
  fillType: LayerFillTypeSolid,
  blendMode: LayerBlendMode,
  opacity: number,
  color: LayerColor
};

type LayerFillGradient = {
  fillType: LayerFillTypeGradient,
  blendMode: LayerBlendMode,
  opacity: number,
  gradient: LayerGradient
};

type LayerFillPatternTypeTile = 0;
type LayerFillPatternTypeFill = 1;
type LayerFillPatternTypeStretch = 2;
type LayerFillPatternTypeFit = 3;
type LayerFillPatternType =
  LayerFillPatternTypeTile
  | LayerFillPatternTypeFill
  | LayerFillPatternTypeStretch
  | LayerFillPatternTypeFit;

type LayerFillPattern = {
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

type LayerFillNoiseTypeBlack = 1;
type LayerFillNoiseTypeWhite = 2;
type LayerFillNoiseTypeColor = 3;
type LayerFillNoiseType =
  LayerFillNoiseTypeBlack
  | LayerFillNoiseTypeWhite
  | LayerFillNoiseTypeColor;

type LayerFillNoise = {
  fillType: LayerFillTypeNoise,
  blendMode: LayerBlendMode,
  opacity: number,
  noiseIndex: LayerFillNoiseType,
  noiseIntensity: number
};

type LayerFill =
  LayerFillSolid
  | LayerFillGradient
  | LayerFillPattern
  | LayerFillNoise;

type LayerListStyle = "" | "disc" | "numbered";

type LayerResizingConstraint = {
  top?: boolean,
  right?: boolean,
  bottom?: boolean,
  left?: boolean,
  fixedWidth?: boolean,
  fixedHeight?: boolean
};

type LayerShadow = {
  color: LayerColor,
  blurRadius: number,
  spread: number,
  x: number,
  y: number
};

type LayerShadows = {
  outer?: LayerShadow[],
  inner?: LayerShadow[]
};

type LayerTextStyle = {
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

type LayerOverrideData = {
  symbolId: string,
  properties: Object,
  [layerId: string]: string | Object | LayerOverrideData
};

type LayerDataAsset = {
  fileFormat: string,
  formatName: string,
  namingScheme: string,
  scale: string
};

type LayerDataProperties = {
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

type PreviewMeta = {
  webUrl: string
};

type LayerData = {
  id: string,
  libraryName: string,
  libraryId: string,
  symbolId?: string,
  parentId?: string,
  childIds: string[],
  type:
    "artboard"
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

type LayerDataset = {
  projectId: string,
  branchId: string,
  sha: string,
  fileId: string,
  layerId: string,
  layers: { [layerId: string]: LayerData }
};

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

type NotificationBranchArchived = NotificationBase & {
  messageType: "BRANCH_ARCHIVED",
  payload: {
    branchName: string,
    previousStatus: string
  }
};

type NotificationBranchCreated = NotificationBase & {
  messageType: "BRANCH_CREATED",
  payload: {
    branchName: string,
    branchDescription?: string
  }
};

type NotificationBranchDeleted = NotificationBase & {
  messageType: "BRANCH_DELETED",
  payload: {
    branchName: string,
    previousStatus: string
  }
};

type NotificationBranchDescriptionUpdated = NotificationBase & {
  messageType: "BRANCH_DESCRIPTION_UPDATED",
  payload: {
    branchName: string,
    branchDescription: string,
    previousDescription: string
  }
};

type NotificationBranchRenamed = NotificationBase & {
  messageType: "BRANCH_RENAMED",
  payload: {
    branchName: string,
    previousName: string
  }
};

type NotificationBranchStatusUpdated = NotificationBase & {
  messageType: "BRANCH_STATUS_UPDATED",
  payload: {
    branchName: string,
    previousStatus: string,
    status: string
  }
};

type NotificationBranchUnarchived = NotificationBase & {
  messageType: "BRANCH_UNARCHIVED",
  payload: {
    branchName: string,
    status: string
  }
};

type NotificationCollectionPublished = NotificationBase & {
  messageType: "COLLECTION_PUBLISHED",
  payload: {
    collectionId: string,
    name: string
  }
};

type NotificationProjectArchived = NotificationBase & {
  messageType: "PROJECT_ARCHIVED",
  payload: {
    projectName: string
  }
};

type NotificationProjectCreated = NotificationBase & {
  messageType: "PROJECT_CREATED",
  payload: {
    projectName: string
  }
};

type NotificationProjectDeleted = NotificationBase & {
  messageType: "PROJECT_DELETED",
  payload: {
    projectName: string
  }
};

type NotificationProjectDescriptionChanged = NotificationBase & {
  messageType: "PROJECT_DESCRIPTION_CHANGED",
  payload: {
    projectName: string
  }
};

type NotificationProjectRenamed = NotificationBase & {
  messageType: "PROJECT_RENAMED",
  payload: {
    previousName: string,
    newName: string
  }
};

type NotificationProjectUnarchived = NotificationBase & {
  messageType: "PROJECT_UNARCHIVED",
  payload: {
    projectName: string
  }
};

type NotificationProjectTransferred = NotificationBase & {
  messageType: "PROJECT_TRANSFERRED",
  payload: {
    projectName: string,
    previousOrganizationName: string,
    newOrganizationName: string
  }
};

type NotificationCommitCommon = {
  pushNotificationId: string,
  sha: string,
  title: string,
  description: string,
  branchName: string
};

type NotificationCommit = NotificationBase & {
  messageType: "COMMIT",
  payload: NotificationCommitCommon
};

type NotificationMergeCommit = NotificationBase & {
  messageType: "MERGE_COMMIT",
  payload: NotificationCommitCommon & {
    sourceBranchId: string,
    sourceBranchName: string,
    destinationBranchId: string,
    destinationBranchName: string
  }
};

type NotificationUpdateCommit = NotificationBase & {
  messageType: "UPDATE_COMMIT",
  payload: NotificationCommitCommon & {
    sourceBranchId: string,
    sourceBranchName: string
  }
};

type NotificationCommentCreated = NotificationBase & {
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

type NotificationReviewRequested = NotificationBase & {
  messageType: "REVIEW_REQUESTED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string
  }
};

type NotificationReviewDismissed = NotificationBase & {
  messageType: "REVIEW_DISMISSED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string
  }
};

type NotificationReviewerRemoved = NotificationBase & {
  messageType: "REVIEWER_REMOVED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string
  }
};

type NotificationReviewCompleted = NotificationBase & {
  messageType: "REVIEW_COMPLETED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string,
    status: string
  }
};

type Notification =
  NotificationBranchArchived
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

type Asset = {
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

interface CursorPromise<T> extends Promise<T> {
  next(): CursorPromise<T>;
}

type CursorMeta = {
  limit: number,
  maxCreatedAt: string,
  nextOffset?: number,
  offset: number,
  total: number
};

type CursorResponse<T> = {
  data: T,
  meta: CursorMeta
};

type CollectionsResponse = {
  collections: Collection[],
  files: File[],
  pages: Page[],
  layers: Layer[]
};

type CollectionResponse = {
  collection: Collection,
  files: File[],
  pages: Page[],
  layers: Layer[]
};

type AccessToken = string | ShareDescriptor;
type AccessTokenOption =
  AccessToken // TODO: Deprecate?
  | (() => AccessToken) // TODO: Deprecate
  | (() => Promise<AccessToken>);

type CommandOptions = {
  accessToken: AccessTokenOption,
  apiUrl: string | Promise<string>,
  assetUrl: string | Promise<string>,
  maxCacheSize: number,
  previewUrl: string | Promise<string>,
  transportMode: "auto" | "api" | "cli",
  webUrl: string | Promise<string>
};

type Section = {
  id: string,
  name: string,
  organizationId: string
};

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

export type WebhookGroup = {
  id: string,
  name: string
};

export type WebhookEvent = {
  id: string,
  group: WebhookGroup,
  name: string
};

export type NewWebhook = {
  active: boolean,
  events: string[],
  key: string,
  organizationId: string,
  url: string
};

export type WebhookDescriptor = {
  organizationId: string,
  webhookId: string
};

export type WebhookDeliveryDescriptor = {
  deliveryId: string,
  organizationId: string,
  webhookId: string
};

export type WebhookDelivery = {
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