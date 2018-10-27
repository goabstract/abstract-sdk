declare module 'abstract-sdk' {
  namespace AbstractSdk {
    export function Client(params: {
      accessToken: string;
      transport: TRANSPORTS;
    }): AbstractClient;

    export enum TRANSPORTS {
      API,
      CLI
    }

    export type AbstractClient = {
      branches: {
        list: (
          description: ProjectDescriptor,
          filter?: {filter?: 'active' | 'archived' | 'mine'}
        ) => Promise<Branch[]>;

        info: (descripiton: BranchDescriptor) => Promise<Branch>;
      };

      collections: {
        list: (
          descriptor: ProjectDescriptor | BranchDescriptor,
          filter?: {layersPerCollection?: number}
        ) => Promise<Collection[]>;

        info: (descriptor: CollectionDescriptor) => Promise<Collection>;
      };

      comments: {
        create: (
          descriptor: BranchDescriptor | CommitDescriptor | LayerDescriptor,
          comment: Comment
        ) => Promise<Comment>;
      };

      commits: {
        list: (descriptor: BranchDescriptor) => Promise<Commit[]>;
        info: (descriptor: CommitDescriptor) => Promise<Commit>;
      };

      data: {info: (descriptor: LayerDescriptor) => Promise<Data>};

      files: {
        list: (descriptor: BranchDescriptor) => Promise<File[]>;
        info: (descriptor: FileDescriptor) => Promise<File>;
      };

      layers: {
        list: (
          descriptor: FileDescriptor | PageDescriptor,
          filter?: {limit?: number; offset?: number}
        ) => Promise<Layer[]>;

        info: (descriptor: LayerDescriptor) => Promise<Layer>;
      };

      organizations: {
        list: () => Promise<Organization[]>;
      };

      pages: {
        list: (descriptor: FileDescriptor) => Promise<Page[]>;
        info: (descriptor: PageDescriptor) => Promise<Page>;
      };

      previews: {
        raw: (descriptor: LayerDescriptor) => Promise<ArrayBuffer>;
        info: (descriptor: LayerDescriptor) => Promise<Preview>;
      };

      projects: {
        list: (descriptor?: OrganizationDescriptor) => Promise<Project[]>;
      };
    };

    export type Branch = {
      createdAt: string;
      description: string;
      divergedFromBranchId: string;
      head: string;
      id: string;
      mergeSha: string;
      mergedIntoBranchId: string;
      name: string;
      parent: string;
      projectId: string;
      startedAtSha: string;
      status: BranchStatus;
      updatedAt: string;
      userId: string;
      userName: string;
    };

    export type BranchStatus =
      | 'active'
      | 'wip'
      | 'feedback'
      | 'review'
      | 'merged'
      | 'archived'
      | 'deleted'
      | 'diverged';

    export type Collection = {
      branchId: string;
      createdAt: string;
      description: string;
      id: string;
      layers: any[];
      name: string;
      projectId: string;
      publishedAt: string;
      user: any;
      userId: string;
    };

    export type Commit = {
      description: string;
      destinationBranchId: string;
      destinationBranchName: string;
      fileIds: string[];
      parents: string[];
      projectId: string;
      sha: string;
      sourceBranchId: string;
      sourceBranchName: string;
      time: string;
      title: string;
      type: CommitType;
      userId: string;
      userName: string;
    };

    export type CommitType =
      | 'NORMAL'
      | 'PROJECT_CREATED'
      | 'FILE_ADDED'
      | 'FILE_RENAMED'
      | 'FILE_DELETED'
      | 'FILE_REPLACED'
      | 'LIBRARY_ADDED'
      | 'LIBRARY_REMOVED'
      | 'RESTORE'
      | 'UPDATE'
      | 'MERGE';

    export type Comment = {
      annotation?: Annotation;
      body: string;
      branchId: string;
      commitSha: string;
      createdAt: string;
      deletedAt: string;
      editedAt: string;
      fileId: string;
      id: string;
      layerId: string;
      pageId: string;
      parentId: string;
      projectId: string;
      replyIds: string[];
      reviewStatus: CommentReviewStatus;
      updatedAt: string;
      user: any;
      userId: string;
    };

    export type Annotation = {
      width: number;
      height: number;
      x: number;
      y: number;
    };

    export type CommentReviewStatus = 'APPROVED' | 'REJECTED';

    export type Data = {
      branchId: string;
      fileId: string;
      layerId: string;
      layers: {[key: string]: LayerData};
      projectId: string;
      sha: string;
    };

    export type LayerData = {
      childIds: string[];
      id: string;
      libraryId: string;
      libraryName: string;
      parentId: string;
      properties: any;
      symbolId: string;
      type: LayerDataType;
    };

    export type LayerDataType =
      | 'artboard'
      | 'layer'
      | 'symbolMaster'
      | 'symbolInstance'
      | 'group'
      | 'text'
      | 'bitmap'
      | 'shapeGroup'
      | 'shapePath'
      | 'rectangle'
      | 'oval'
      | 'polygon'
      | 'triangle'
      | 'star'
      | 'page'
      | 'slice'
      | 'hotspot';

    export type File = {
      applicationDocumentVersion: number;
      applicationVersion: string;
      id: string;
      isLibrary: boolean;
      lastChangedAtSha: string;
      name: string;
      projectId: string;
      sha: string;
      type: string;
    };

    export type Layer = {
      fileId: string;
      height: number;
      id: string;
      lastChangedAtSha: string;
      libraryId: string;
      name: string;
      order: number;
      pageId: string;
      projectId: string;
      sha: string;
      type: string;
      updatedAt: string;
      width: number;
      x: number;
      y: number;
    };

    export type Organization = {
      createdAt: string;
      hasBillingInfo: boolean;
      id: string;
      isUsernameOrganization: boolean;
      isWithinSubscriptionTerm: boolean;
      logoUrl: string;
      name: string;
      restrictedToDomains: string[];
      trialEndsAt: string;
      updatedAt: string;
      userId: string;
    };

    export type Page = {
      fileId: string;
      id: string;
      name: string;
      order: number;
      projectId: string;
      sha: string;
      type: string;
    };

    export type Preview = {
      webUrl: string;
    };

    export type Project = {
      about: string;
      archivedAt: string;
      color: string;
      createdAt: string;
      createdByUser: any;
      description: string;
      firstPushedAt: string;
      id: string;
      name: string;
      organizationId: string;
      pushedAt: string;
      repoCreatedAt: string;
      sizeInBytes: number;
      updatedAt: string;
      visibility: ProjectVisibility;
    };

    export type ProjectVisibility = 'organization' | 'specific';

    export type OrganizationDescriptor = {
      organizationId: string;
    };

    export type ProjectDescriptor = {
      projectId: string;
    };

    export type BranchDescriptor = {
      projectId: string;
      branchId: string;
    };

    export type CommitDescriptor = {
      projectId: string;
      branchId: string;
      sha?: string;
    };

    export type FileDescriptor = {
      projectId: string;
      branchId: string;
      fileId: string;
      sha?: string;
    };

    export type PageDescriptor = {
      projectId: string;
      branchId: string;
      fileId: string;
      pageId: string;
      sha?: string;
    };

    export type LayerDescriptor = {
      projectId: string;
      branchId: string;
      fileId: string;
      pageId: string;
      layerId: string;
      sha?: string;
    };

    export type CollectionDescriptor = {
      projectId: string;
      branchId: string;
      collectionId: string;
    };
  }

  export = AbstractSdk;
}
