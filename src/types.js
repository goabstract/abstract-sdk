// @flow

export type OrganizationDescriptor = {|
  organizationId: string
|};

export type ProjectDescriptor = {|
  projectId: string
|};

export type CommentDescriptor = {|
  commentId: string
|};

export type CollectionDescriptor = {|
  projectId: string,
  branchId: string,
  collectionId: string
|};

export type ActivityDescriptor = {|
  activityId: string
|};

export type NotificationDescriptor = {|
  notificationId: string
|};

type ObjectDescriptor = {|
  projectId: string,
  branchId: string | "master",
  sha: string
|};

export type CommitDescriptor = {|
  ...ObjectDescriptor
|};

export type BranchDescriptor = {|
  ...ObjectDescriptor,
  sha: $PropertyType<ObjectDescriptor, "sha"> | "latest"
|};

export type FileDescriptor = {|
  ...ObjectDescriptor,
  sha: $PropertyType<ObjectDescriptor, "sha"> | "latest",
  fileId: string
|};

export type PageDescriptor = {|
  ...ObjectDescriptor,
  fileId: string,
  pageId: string
|};

export type LayerDescriptor = {|
  ...ObjectDescriptor,
  sha: $PropertyType<ObjectDescriptor, "sha"> | "latest",
  fileId: string,
  pageId: string,
  layerId: string
|};

export type ShareDescriptor = {| url: string |} | {| shareId: string |};

export type ListOptions = {
  limit?: number,
  offset?: number
};

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
    commentFileId: ?string,
    commentFileName: ?string,
    commentId: string,
    commentLayerId: ?string,
    commentLayerName: ?string,
    commentPageId: ?string,
    commentPageName: ?string,
    commentParentId: ?string,
    commitBranchId: string,
    commitBranchName: string,
    commitSha: ?string,
    commitMessage: ?string
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

export type User = {
  id: string,
  email: string,
  primaryEmailId: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string,
  username: string,
  name: ?string,
  releaseChannel: ?string,
  avatarUrl: ?string
};

export type Organization = {
  id: string,
  name: string
};

export type Project = {
  id: string,
  name: string,
  about: ?string,
  description: ?string,
  color: ?string,
  createdAt: string,
  updatedAt: string,
  organizationId: string,
  createdByUser: User,
  deletedAt: ?string,
  archivedAt: ?string,
  firstPushedAt: string,
  pushedAt: ?string,
  repoCreatedAt: string,
  visibility: "organization" | "project",
  sizeInBytes: number,
  userIds: [string]
};

type BaseShare = {
  id: string,
  url: string,
  appUrl: string,
  userId: string
};

export type ProjectShare = {
  ...BaseShare,
  kind: "project",
  descriptor: ProjectDescriptor
};

export type CommitShare = {
  ...BaseShare,
  kind: "commit",
  descriptor: CommitDescriptor
};

export type BranchShare = {
  ...BaseShare,
  kind: "branch",
  descriptor: BranchDescriptor
};

export type FileShare = {
  ...BaseShare,
  kind: "file",
  descriptor: FileDescriptor
};

export type PageShare = {
  ...BaseShare,
  kind: "page",
  descriptor: PageDescriptor
};

export type LayerShare = {
  ...BaseShare,
  kind: "layer",
  descriptor: LayerDescriptor
};

export type CommentShare = {
  ...BaseShare,
  kind: "comment",
  descriptor: CommentDescriptor
};

export type CollectionShare = {
  ...BaseShare,
  kind: "collection",
  descriptor: CollectionDescriptor
};

export type Share =
  | ProjectShare
  | CommitShare
  | BranchShare
  | FileShare
  | PageShare
  | LayerShare
  | CommentShare
  | CollectionShare;

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

export type CollectionLayer = {
  id: string,
  collectionId: string,
  projectId: string,
  fileId: string,
  pageId: string,
  layerId: string,
  sha: string,
  isPinned: boolean,
  order: number
};

export type Collection = {
  id: string,
  userId: string,
  projectId: string,
  branchId: string,
  name: string,
  description: string,
  createdAt: string,
  publishedAt: string,
  layers: string[]
};

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
  description: ?string,
  userName: ?string,
  userId: ?string,
  fileIds: string[],
  parents: string[],
  destinationBranchId: ?string,
  destinationBranchName: ?string,
  sourceBranchId: ?string,
  sourceBranchName: ?string
};

export type Branch = {
  id: string,
  name: string,
  description: ?string,
  userName: ?string,
  userId: ?string,
  createdAt: string,
  updatedAt: string,
  status: ?string,
  parent: ?string,
  startedAtSha: ?string,
  head: string,
  mergeSha: ?string,
  mergedIntoBranchId: ?string,
  divergedFromBranchId: ?string,
  projectId: string,
  user: User
};

export type ChangesetStatus =
  | "added"
  | "deleted"
  | "edited"
  | "edited-indirectly"
  | "none";

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

export type ChangesetChange =
  | ChangesetFileChange
  | ChangesetPageChange
  | ChangesetLayerChange
  | ChangesetColorsChange
  | ChangesetGradientChange
  | ChangesetLayerStyleChange
  | ChangesetTextStyleChange;

export type Changeset = {
  id: string,
  sha: string,
  compareToSha: string,
  changes: ChangesetChange[],
  projectId: string,
  branchId: string
};

export type Page = {
  id: string,
  name: string,
  type: "" | "library",
  projectId: string,
  sha: string,
  fileId: string,
  order: number
};

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

export type LayerDataProperties = {
  styleName?: string,
  name: string,
  isVisible: boolean,
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
  imageId?: string,
  textContent?: string,
  backgroundColor?: LayerColor,
  borderRadius?: LayerBorderRadius,
  text?: LayerTextStyle,
  fills?: LayerFill[],
  borders?: LayerBorder[],
  shadows?: LayerShadows,
  resizingConstraint?: LayerResizingConstraint,
  overrides?: LayerOverrideData
};

export type LayerData = {
  id: string,
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

export type LayerDataset = {
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

export type NotificationBranchArchived = NotificationBase & {
  messageType: "BRANCH_ARCHIVED",
  payload: {
    branchName: string,
    previousStatus: string
  }
};

export type NotificationBranchCreated = NotificationBase & {
  messageType: "BRANCH_CREATED",
  payload: {
    branchName: string,
    branchDescription?: string
  }
};

export type NotificationBranchDeleted = NotificationBase & {
  messageType: "BRANCH_DELETED",
  payload: {
    branchName: string,
    previousStatus: string
  }
};

export type NotificationBranchDescriptionUpdated = NotificationBase & {
  messageType: "BRANCH_DESCRIPTION_UPDATED",
  payload: {
    branchName: string,
    branchDescription: string,
    previousDescription: string
  }
};

export type NotificationBranchRenamed = NotificationBase & {
  messageType: "BRANCH_RENAMED",
  payload: {
    branchName: string,
    previousName: string
  }
};

export type NotificationBranchStatusUpdated = NotificationBase & {
  messageType: "BRANCH_STATUS_UPDATED",
  payload: {
    branchName: string,
    previousStatus: string,
    status: string
  }
};

export type NotificationBranchUnarchived = NotificationBase & {
  messageType: "BRANCH_UNARCHIVED",
  payload: {
    branchName: string,
    status: string
  }
};

export type NotificationCollectionPublished = NotificationBase & {
  messageType: "COLLECTION_PUBLISHED",
  payload: {
    collectionId: string,
    name: string
  }
};

export type NotificationProjectArchived = NotificationBase & {
  messageType: "PROJECT_ARCHIVED",
  payload: {
    projectName: string
  }
};

export type NotificationProjectCreated = NotificationBase & {
  messageType: "PROJECT_CREATED",
  payload: {
    projectName: string
  }
};

export type NotificationProjectDeleted = NotificationBase & {
  messageType: "PROJECT_DELETED",
  payload: {
    projectName: string
  }
};

export type NotificationProjectDescriptionChanged = NotificationBase & {
  messageType: "PROJECT_DESCRIPTION_CHANGED",
  payload: {
    projectName: string
  }
};

export type NotificationProjectRenamed = NotificationBase & {
  messageType: "PROJECT_RENAMED",
  payload: {
    previousName: string,
    newName: string
  }
};

export type NotificationProjectUnarchived = NotificationBase & {
  messageType: "PROJECT_UNARCHIVED",
  payload: {
    projectName: string
  }
};

export type NotificationProjectTransferred = NotificationBase & {
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

export type NotificationCommit = NotificationBase & {
  messageType: "COMMIT",
  payload: NotificationCommitCommon
};

export type NotificationMergeCommit = NotificationBase & {
  messageType: "MERGE_COMMIT",
  payload: NotificationCommitCommon & {
    sourceBranchId: string,
    sourceBranchName: string,
    destinationBranchId: string,
    destinationBranchName: string
  }
};

export type NotificationUpdateCommit = NotificationBase & {
  messageType: "UPDATE_COMMIT",
  payload: NotificationCommitCommon & {
    sourceBranchId: string,
    sourceBranchName: string
  }
};

export type NotificationCommentCreated = NotificationBase & {
  messageType: "COMMENT_CREATED",
  payload: {
    reviewId?: string,
    reviewStatus?: ReviewStatus,
    commentFileId: ?string,
    commentFileName: ?string,
    commentId: string,
    commentLayerId: ?string,
    commentLayerName: ?string,
    commentPageId: ?string,
    commentPageName: ?string,
    commentParentId: ?string,
    commitBranchId: string,
    commitBranchName: string,
    commitSha: ?string,
    commitMessage: ?string
  }
};

export type NotificationReviewRequested = NotificationBase & {
  messageType: "REVIEW_REQUESTED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string
  }
};

export type NotificationReviewDismissed = NotificationBase & {
  messageType: "REVIEW_DISMISSED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string
  }
};

export type NotificationReviewerRemoved = NotificationBase & {
  messageType: "REVIEWER_REMOVED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string
  }
};

export type NotificationReviewCompleted = NotificationBase & {
  messageType: "REVIEW_COMPLETED",
  payload: {
    branchName: string,
    reviewerName: string,
    reviewerId: string,
    status: string
  }
};

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

export interface AbstractInterface {
  accessToken: string;

  activities?: {
    list: (
      objectDescriptor?:
        | BranchDescriptor
        | OrganizationDescriptor
        | ProjectDescriptor,
      options?: ListOptions
    ) => Promise<Activity[]>,
    info: (activityDescriptor: ActivityDescriptor) => Promise<Activity>
  };

  organizations?: {
    list: () => Promise<Branch[]>
  };

  shares?: {
    info: (shareDescriptor: ShareDescriptor) => Promise<Share>
  };

  projects?: {
    list: (
      organizationDescriptor?: OrganizationDescriptor,
      options: { filter?: "active" | "archived" }
    ) => Promise<Project[]>,
    info: (projectDescriptor: ProjectDescriptor) => Promise<Project>
  };

  collections: {
    list: (
      ProjectDescriptor | BranchDescriptor,
      options?: Object
    ) => Promise<Collection[]>,
    info: (CollectionDescriptor, options?: Object) => Promise<Collection>
  };

  comments?: {
    create: (
      BranchDescriptor | LayerDescriptor,
      comment: Comment
    ) => Promise<Comment>,
    list: (
      {
        projectId: $PropertyType<ProjectDescriptor, "projectId">
      } & $Shape<
        BranchDescriptor & CommitDescriptor & PageDescriptor & LayerDescriptor
      >,
      options?: ListOptions
    ) => Promise<Comment[]>,
    info: (commentDescriptor: CommentDescriptor) => Promise<Comment>
  };

  commits: {
    list: (
      BranchDescriptor | FileDescriptor | LayerDescriptor,
      options?: { limit?: number }
    ) => Promise<Commit[]>,
    info: (
      BranchDescriptor | FileDescriptor | CommitDescriptor | LayerDescriptor
    ) => Promise<Commit>
  };

  branches?: {
    list: (
      ProjectDescriptor,
      options: { filter?: "active" | "archived" | "mine" }
    ) => Promise<Branch[]>,
    info: BranchDescriptor => Promise<Branch>
  };

  changesets: {
    info: CommitDescriptor => Promise<Changeset>
  };

  files: {
    list: BranchDescriptor => Promise<File[]>,
    info: FileDescriptor => Promise<File>
  };

  pages: {
    list: FileDescriptor => Promise<Page[]>,
    info: PageDescriptor => Promise<Page>
  };

  layers: {
    list: (FileDescriptor, ListOptions) => Promise<Layer[]>,
    info: LayerDescriptor => Promise<Layer>
  };

  previews?: {
    raw: LayerDescriptor => Promise<ArrayBuffer>,
    info: LayerDescriptor => *
  };

  data: {
    info: LayerDescriptor => Promise<LayerData>
  };

  notifications?: {
    list: (
      objectDescriptor?: OrganizationDescriptor,
      options?: ListOptions
    ) => Promise<Notification[]>,
    info: (
      notificationDescriptor: NotificationDescriptor
    ) => Promise<Notification>
  };
}
