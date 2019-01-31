// @flow
/* global fetch URL */
import "cross-fetch/polyfill";
import queryString from "query-string";
import find from "lodash/find";
import omitBy from "lodash/omitBy";
import { version } from "../../package.json";
import {
  objectBranchDescriptor,
  objectFileDescriptor,
  inferShareId
} from "../utils";
import { log } from "../debug";
import type {
  AbstractInterface,
  ShareDescriptor,
  OrganizationDescriptor,
  ProjectDescriptor,
  CommitDescriptor,
  BranchDescriptor,
  PageDescriptor,
  FileDescriptor,
  LayerDescriptor,
  CollectionDescriptor,
  ActivityDescriptor,
  NotificationDescriptor,
  CommentDescriptor,
  UserDescriptor,
  AssetDescriptor,
  Share,
  Comment,
  Layer,
  ListOptions,
  AccessTokenOption,
  AccessToken,
  Activity,
  Notification,
  ShareInput,
  UpdatedCollection,
  NewCollection
} from "../types";
import { throwAPIError } from "../errors";
import randomTraceId from "./randomTraceId";
import Cursor from "./Cursor";

const minorVersion = version.split(".", 2).join(".");
const logStatusSuccess = log.extend("AbstractAPI:status:success");
const logFetch = log.extend("AbstractAPI:fetch");

export type Options = {
  accessToken: AccessTokenOption,
  apiUrl?: string,
  previewsUrl?: string
};

type BranchNames = {
  branchName: string
};

type LayerNames = {
  branchName: string,
  fileName: string,
  pageName: string,
  layerName: string
};

async function unwrapEnvelope<T>(
  response: Promise<{
    data: T,
    policies: *
  }>
): Promise<T> {
  return (await response).data;
}

export default class AbstractAPI implements AbstractInterface {
  _optionAccessToken: AccessTokenOption;
  apiUrl: string;
  previewsUrl: string;

  constructor({
    accessToken,
    apiUrl = "https://api.goabstract.com",
    previewsUrl = "https://previews.goabstract.com"
  }: Options = {}) {
    if (!accessToken) {
      throw new Error(
        "options.accessToken or ABSTRACT_TOKEN set as an environment variable is required"
      );
    }

    this._optionAccessToken = accessToken;
    this.apiUrl = apiUrl;
    this.previewsUrl = previewsUrl;
  }

  accessToken = async (): Promise<AccessToken> =>
    typeof this._optionAccessToken === "function"
      ? this._optionAccessToken()
      : this._optionAccessToken;

  async tokenHeader() {
    const accessToken = await this.accessToken();

    if (!accessToken) return {}; // No auth headers

    if (typeof accessToken === "object") {
      return { "Abstract-Share-Id": inferShareId(accessToken) };
    } else {
      return { Authorization: `Bearer ${accessToken}` };
    }
  }

  async fetch(input: string, init: Object = {}, hostname?: ?string) {
    const tokenHeader = await this.tokenHeader();

    init.headers = omitBy(
      {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": `Abstract SDK ${minorVersion}`,
        "X-Amzn-Trace-Id": randomTraceId(),
        "Abstract-Api-Version": "8",
        ...tokenHeader,
        ...(init.headers || {})
      },
      // Omit undefined headers or fetch will String(undefined)
      header => header === undefined
    );

    if (init.body) {
      init.body = JSON.stringify(init.body);
    }

    const root = hostname || this.apiUrl;
    const fetchArgs = [
      hostname === null ? input : `${root.toString()}/${input.toString()}`,
      init
    ];

    logFetch(fetchArgs);
    const request = fetch(...fetchArgs);
    const response = await request;

    if (!response.ok) {
      await throwAPIError(response, input, init.body);
    }

    if (logStatusSuccess.enabled) {
      if (
        (response.headers.get("content-type") || "").includes(
          "application/json"
        )
      ) {
        logStatusSuccess(await response.clone().json());
      }
    }

    return request;
  }

  async fetchPreview(input: string, init?: Object = {}) {
    return this.fetch(
      input,
      {
        ...init,
        headers: {
          Accept: undefined,
          "Content-Type": undefined,
          "Abstract-Api-Version": undefined,
          ...init.headers
        }
      },
      this.previewsUrl
    );
  }

  async resolveDescriptor<T: *>(objectDescriptor: T): Promise<T> {
    if (objectDescriptor.sha !== "latest") return objectDescriptor;

    const commits = await this.commits.list(objectDescriptor, { limit: 1 });

    try {
      return {
        ...objectDescriptor,
        sha: commits[0].sha
      };
    } catch (error) {
      throw new Error(
        `Could not resolve sha "latest" for ${JSON.stringify(objectDescriptor)}`
      );
    }
  }

  activities = {
    list: (
      objectDescriptor: $Shape<
        BranchDescriptor & OrganizationDescriptor & ProjectDescriptor
      > = {},
      options: ListOptions = {}
    ) => {
      return new Cursor<Activity[]>(
        async (meta = { nextOffset: options.offset }) => {
          const query = queryString.stringify({
            limit: options.limit,
            offset: meta.nextOffset,
            branchId: objectDescriptor.branchId,
            organizationId: objectDescriptor.organizationId,
            projectId: objectDescriptor.projectId
          });
          const response = await this.fetch(`activities?${query}`);
          const {
            data: { activities },
            meta: newMeta
          } = await response.json();
          return {
            data: activities,
            meta: newMeta
          };
        }
      );
    },
    info: async ({ activityId }: ActivityDescriptor) => {
      const response = await this.fetch(`activities/${activityId}`);
      return response.json();
    }
  };

  organizations = {
    info: async ({ organizationId }: OrganizationDescriptor) => {
      const response = await this.fetch(`organizations/${organizationId}`);
      return unwrapEnvelope(response.json());
    },
    list: async () => {
      const response = await this.fetch("organizations");
      return unwrapEnvelope(response.json());
    }
  };
  shares = {
    // Using an anonymous function instead of a fat arrow function
    // to avoid throwing some syntax error caused by the placeholder
    // https://github.com/babel/babylon/issues/235
    create: async function<T: Share>(
      organizationDescriptor: OrganizationDescriptor,
      shareInput: ShareInput
    ): Promise<T> {
      const response = await this.fetch("share_links", {
        method: "POST",
        body: {
          ...shareInput,
          organizationId: organizationDescriptor.organizationId,
          // Mirror sha -> commitSha
          commitSha: shareInput.sha ? shareInput.sha : undefined
        }
      });

      return await response.json();
    }.bind(this),
    info: async function<T: Share>(
      shareDescriptor: ShareDescriptor
    ): Promise<T> {
      const response = await this.fetch(
        `share_links/${inferShareId(shareDescriptor)}`
      );

      return response.json();
    }.bind(this)
  };

  projects = {
    list: async (
      organizationDescriptor?: OrganizationDescriptor,
      options: { filter?: "active" | "archived" } = {}
    ) => {
      const query = queryString.stringify({
        organizationId:
          organizationDescriptor && organizationDescriptor.organizationId
            ? organizationDescriptor.organizationId
            : undefined,
        filter: options.filter
      });

      const response = await this.fetch(`projects?${query}`);

      return unwrapEnvelope(response.json());
    },
    info: async (projectDescriptor: ProjectDescriptor) => {
      const response = await this.fetch(
        `projects/${projectDescriptor.projectId}`
      );

      return unwrapEnvelope(response.json());
    }
  };

  comments = {
    create: async (
      objectDescriptor: BranchDescriptor | LayerDescriptor,
      comment: Comment
    ) => {
      objectDescriptor = await this.resolveDescriptor(objectDescriptor);

      const response = await this.fetch("comments", {
        method: "POST",
        body: {
          projectId: objectDescriptor.projectId,
          branchId: objectDescriptor.branchId,
          commitSha: objectDescriptor.sha,
          fileId: objectDescriptor.layerId
            ? objectDescriptor.fileId
            : undefined,
          pageId: objectDescriptor.layerId
            ? objectDescriptor.pageId
            : undefined,
          layerId: objectDescriptor.layerId
            ? objectDescriptor.layerId
            : undefined,
          body: comment.body,
          annotation: comment.annotation
            ? {
                x: comment.annotation.x,
                y: comment.annotation.y,
                width: comment.annotation.width,
                height: comment.annotation.height
              }
            : undefined,
          ...(await this._denormalizeDescriptorForComment(objectDescriptor))
        }
      });

      return response.json();
    },
    list: (
      objectDescriptor: {
        projectId: $PropertyType<ProjectDescriptor, "projectId">
      } & $Shape<
        BranchDescriptor & CommitDescriptor & PageDescriptor & LayerDescriptor
      >,
      options: ListOptions = {}
    ) => {
      return new Cursor<Comment[]>(
        async (meta = { nextOffset: options.offset }) => {
          const query = queryString.stringify({
            limit: options.limit,
            offset: meta.nextOffset,
            branchId: objectDescriptor.branchId,
            commitSha: objectDescriptor.sha,
            fileId: objectDescriptor.fileId,
            layerId: objectDescriptor.layerId,
            pageId: objectDescriptor.pageId,
            projectId: objectDescriptor.projectId
          });
          const response = await this.fetch(`comments?${query}`);
          return await response.json();
        }
      );
    },
    info: async ({ commentId }: CommentDescriptor) => {
      const response = await this.fetch(`comments/${commentId}`);
      return response.json();
    }
  };

  commits = {
    list: async (
      objectDescriptor: BranchDescriptor | FileDescriptor | LayerDescriptor,
      options?: { limit?: number } = {}
    ) => {
      const query = queryString.stringify({
        limit: options.limit ? options.limit : undefined,
        fileId: objectDescriptor.fileId ? objectDescriptor.fileId : undefined,
        layerId: objectDescriptor.layerId ? objectDescriptor.layerId : undefined
      });

      const response = await this.fetch(
        // prettier-ignore
        `projects/${objectDescriptor.projectId}/branches/${objectDescriptor.branchId}/commits?${query}`
      );

      const data = await response.json();
      return data.commits;
    },
    info: async (
      objectDescriptor:
        | BranchDescriptor
        | FileDescriptor
        | CommitDescriptor
        | LayerDescriptor
    ) => {
      // Avoid using resolveDescriptor to prevent extra request
      if (objectDescriptor.sha === "latest") {
        const commits = await this.commits.list(objectDescriptor, { limit: 1 });
        return commits[0];
      } else {
        const commits = await this.commits.list(
          objectBranchDescriptor(objectDescriptor),
          { limit: 1 }
        );

        const commit = find(commits, { sha: objectDescriptor.sha });
        if (!commit) throw new Error("Commit not found");

        return commit;
      }
    }
  };

  branches = {
    info: async (branchDescriptor: BranchDescriptor) => {
      const response = await this.fetch(
        // prettier-ignore
        `projects/${branchDescriptor.projectId}/branches/${branchDescriptor.branchId}`
      );
      return response.json();
    },
    list: async (
      projectDescriptor: ProjectDescriptor,
      options: { filter?: "active" | "archived" | "mine" } = {}
    ) => {
      const query = queryString.stringify({ filter: options.filter });
      const response = await this.fetch(
        // prettier-ignore
        `projects/${projectDescriptor.projectId}/branches/?${query}`
      );

      const data = await unwrapEnvelope(response.json());
      return data.branches;
    }
  };

  changesets = {
    info: async (commitDescriptor: CommitDescriptor) => {
      const response = await this.fetch(
        // prettier-ignore
        `projects/${commitDescriptor.projectId}/branches/${commitDescriptor.branchId}/commits/${commitDescriptor.sha}/changeset`
      );

      const data = await response.json();
      return data.changeset;
    }
  };

  files = {
    list: async (branchDescriptor: BranchDescriptor) => {
      branchDescriptor = await this.resolveDescriptor(branchDescriptor);

      const response = await this.fetch(
        // prettier-ignore
        `projects/${branchDescriptor.projectId}/branches/${branchDescriptor.branchId}/files`
      );

      const data = await response.json();
      return data.files;
    },
    info: async (fileDescriptor: FileDescriptor) => {
      fileDescriptor = await this.resolveDescriptor(fileDescriptor);

      const files = await this.files.list(
        objectBranchDescriptor(fileDescriptor)
      );

      const file = find(files, { id: fileDescriptor.fileId });
      if (!file) throw new Error("File not found");

      return file;
    }
  };

  pages = {
    list: async (fileDescriptor: FileDescriptor) => {
      const response = await this.fetch(
        // prettier-ignore
        `projects/${fileDescriptor.projectId}/branches/${fileDescriptor.branchId}/files/${fileDescriptor.fileId}/pages`
      );

      const data = await response.json();
      return data.pages;
    },
    info: async (pageDescriptor: PageDescriptor) => {
      const pages = await this.pages.list(objectFileDescriptor(pageDescriptor));

      const page = find(pages, { id: pageDescriptor.pageId });
      if (!page) throw new Error("Page not found");

      return page;
    }
  };

  layers = {
    list: async (
      objectDescriptor: FileDescriptor | PageDescriptor,
      options: ListOptions = {}
    ) => {
      const { sha } = await this.resolveDescriptor(
        objectFileDescriptor(objectDescriptor)
      );

      const query = queryString.stringify({
        ...options,
        pageId: objectDescriptor.pageId ? objectDescriptor.pageId : undefined,
        sha
      });

      const response = await this.fetch(
        // prettier-ignore
        `projects/${objectDescriptor.projectId}/branches/${objectDescriptor.branchId}/files/${objectDescriptor.fileId}/layers?${query}`
      );

      const data = await response.json();
      return data.layers;
    },
    info: async (layerDescriptor: LayerDescriptor) => {
      layerDescriptor = await this.resolveDescriptor(layerDescriptor);

      const response = await this.fetch(
        // prettier-ignore
        `projects/${layerDescriptor.projectId}/branches/${layerDescriptor.branchId}/commits/${layerDescriptor.sha}/files/${layerDescriptor.fileId}/layers/${layerDescriptor.layerId}`
      );

      const data = await response.json();

      // for comments.create
      // TODO: Create cache so that files.info and pages.info can be used instead
      const layer = {
        ...data.layer,
        _file: data.file,
        _page: data.page
      };

      return layer;
    }
  };

  previews = {
    info: async (layerDescriptor: LayerDescriptor) => {
      layerDescriptor = await this.resolveDescriptor(layerDescriptor);

      // prettier-ignore
      return {
        webUrl: `${this.previewsUrl}/projects/${layerDescriptor.projectId}/commits/${layerDescriptor.sha}/files/${layerDescriptor.fileId}/layers/${layerDescriptor.layerId}`
      };
    },
    raw: async (layerDescriptor: LayerDescriptor, options: *) => {
      layerDescriptor = await this.resolveDescriptor(layerDescriptor);

      const response = await this.fetchPreview(
        // prettier-ignore
        `projects/${layerDescriptor.projectId}/commits/${layerDescriptor.sha}/files/${layerDescriptor.fileId}/layers/${layerDescriptor.layerId}`,
        options
      );

      return response.arrayBuffer();
    }
  };

  data = {
    info: async (layerDescriptor: LayerDescriptor) => {
      layerDescriptor = await this.resolveDescriptor(layerDescriptor);

      const response = await this.fetch(
        // prettier-ignore
        `projects/${layerDescriptor.projectId}/branches/${layerDescriptor.branchId}/commits/${layerDescriptor.sha}/files/${layerDescriptor.fileId}/layers/${layerDescriptor.layerId}/data`
      );

      return response.json();
    }
  };

  collections = {
    list: async (
      projectOrBranchDescriptor: ProjectDescriptor | BranchDescriptor,
      options?: { layersPerCollection?: number | "all" } = {}
    ) => {
      const query = queryString.stringify({
        branch_id: projectOrBranchDescriptor.branchId
          ? projectOrBranchDescriptor.branchId
          : undefined,
        layersPerCollection: options.layersPerCollection
      });

      const response = await this.fetch(
        // prettier-ignore
        `projects/${projectOrBranchDescriptor.projectId}/collections?${query}`
      );

      return await unwrapEnvelope(response.json());
    },
    info: async (
      collectionDescriptor: CollectionDescriptor,
      options: { layersPerCollection?: number | "all" } = {
        layersPerCollection: "all"
      }
    ) => {
      const query = queryString.stringify({
        layersPerCollection: options.layersPerCollection
      });

      const response = await this.fetch(
        // prettier-ignore
        `projects/${collectionDescriptor.projectId}/collections/${collectionDescriptor.collectionId}?${query}`
      );

      return await unwrapEnvelope(response.json());
    },
    create: async (
      objectDescriptor: ProjectDescriptor,
      collection: NewCollection
    ) => {
      const response = await this.fetch(
        `projects/${objectDescriptor.projectId}/collections`,
        {
          method: "POST",
          body: collection
        }
      );

      return response.json();
    },
    update: async (
      collectionDescriptor: CollectionDescriptor,
      collection: UpdatedCollection
    ) => {
      const response = await this.fetch(
        // prettier-ignore
        `projects/${collectionDescriptor.projectId}/collections/${collectionDescriptor.collectionId}`,
        {
          method: "PUT",
          body: collection
        }
      );

      return response.json();
    }
  };

  notifications = {
    list: (
      objectDescriptor?: OrganizationDescriptor,
      options: ListOptions = {}
    ) => {
      return new Cursor<Notification[]>(
        async (meta = { nextOffset: options.offset }) => {
          const query = queryString.stringify({
            limit: options.offset,
            offset: meta.nextOffset,
            organizationId: objectDescriptor
              ? objectDescriptor.organizationId
              : null
          });
          const response = await this.fetch(`notifications?${query}`);
          return await response.json();
        }
      );
    },
    info: async ({ notificationId }: NotificationDescriptor) => {
      const response = await this.fetch(`notifications/${notificationId}`);
      return response.json();
    }
  };

  users = {
    list: async (
      objectDescriptor: OrganizationDescriptor | ProjectDescriptor
    ) => {
      let url = "";
      if (objectDescriptor.organizationId) {
        url = `organizations/${objectDescriptor.organizationId}/memberships`;
      } else if (objectDescriptor.projectId) {
        url = `projects/${objectDescriptor.projectId}/memberships`;
      }
      const response = await this.fetch(url);
      const memberships = await unwrapEnvelope(response.json());
      return memberships.map(membership => membership.user);
    },
    info: async ({ userId }: UserDescriptor) => {
      const response = await this.fetch(`users/${userId}`);
      return response.json();
    }
  };

  assets = {
    info: async ({ assetId, projectId }: AssetDescriptor) => {
      const response = await this.fetch(
        `projects/${projectId}/assets/${assetId}`
      );
      return response.json();
    },
    list: async (objectDescriptor: BranchDescriptor) => {
      objectDescriptor = await this.resolveDescriptor(objectDescriptor);
      const query = queryString.stringify({
        sha: objectDescriptor && objectDescriptor.sha
      });
      const response = await this.fetch(
        `projects/${objectDescriptor.projectId}/assets?${query}`
      );
      const { assets } = await unwrapEnvelope(response.json());
      return assets;
    },
    raw: async (assetDescriptor: AssetDescriptor) => {
      const asset = await this.assets.info(assetDescriptor);
      const response = await this.fetch(
        asset.url,
        {
          headers: {
            Accept: undefined,
            "Content-Type": undefined,
            "Abstract-Api-Version": undefined
          }
        },
        null
      );
      return response.arrayBuffer();
    }
  };

  async _denormalizeDescriptorForComment(
    objectDescriptor: BranchDescriptor | LayerDescriptor
  ): Promise<BranchNames | LayerNames> {
    const branch = await this.branches.info(
      objectDescriptor.layerId !== undefined
        ? objectBranchDescriptor(objectDescriptor)
        : objectDescriptor
    );

    if (objectDescriptor.layerId) {
      const layer: Layer = await this.layers.info(objectDescriptor);

      return {
        branchName: branch.name,
        // $FlowFixMe _file not in type
        fileName: layer._file.name,
        // $FlowFixMe _file not in type
        pageName: layer._page.name,
        // $FlowFixMe _page not in type
        pageId: layer._page.id,
        layerName: layer.name
      };
    } else {
      return { branchName: branch.name };
    }
  }
}
