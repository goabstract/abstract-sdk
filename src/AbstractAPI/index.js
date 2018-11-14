// @flow
/* global fetch */
import "cross-fetch/polyfill";
import queryString from "query-string";
import find from "lodash/find";
import { version } from "../../package.json";
import {
  objectBranchDescriptor,
  fileBranchDescriptor,
  layerBranchDescriptor,
  pageFileDescriptor
} from "../utils";
import { log } from "../debug";
import type {
  AbstractInterface,
  OrganizationDescriptor,
  ProjectDescriptor,
  CommitDescriptor,
  BranchDescriptor,
  PageDescriptor,
  FileDescriptor,
  LayerDescriptor,
  CollectionDescriptor,
  ActivityDescriptor,
  Comment,
  Layer,
  ListOptions
} from "../";
import randomTraceId from "./randomTraceId";

const minorVersion = version.split(".", 2).join(".");
const logStatusError = log.extend("AbstractAPI:status:error");
const logStatusSuccess = log.extend("AbstractAPI:status:success");
const logFetch = log.extend("AbstractAPI:fetch");

export type Options = {
  accessToken: string,
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
  accessToken: string;
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

    this.accessToken = accessToken;
    this.apiUrl = apiUrl;
    this.previewsUrl = previewsUrl;
  }

  async fetch(input: string | URL, init: Object = {}, hostname?: string) {
    init.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": `Abstract SDK ${minorVersion}`,
      Authorization: `Bearer ${this.accessToken}`,
      "X-Amzn-Trace-Id": randomTraceId(),
      "Abstract-Api-Version": "7",
      ...(init.headers || {})
    };

    if (init.body) {
      init.body = JSON.stringify(init.body);
    }

    hostname = hostname || this.apiUrl;
    const fetchArgs = [`${hostname}/${input.toString()}`, init];

    logFetch(fetchArgs);
    const request = fetch(...fetchArgs);
    const response = await request;

    if (!response.ok) {
      if (logStatusError.enabled) {
        logStatusError(
          await response.clone().json() // Clone the response as response.body can only be used once
        );
      }

      throw new Error(`Received status "${response.status}", expected 2XX`);
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

  async fetchPreview(input: string | URL, init?: Object = {}) {
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

  activities = {
    list: async (
      objectDescriptor: $Shape<
        BranchDescriptor & OrganizationDescriptor & ProjectDescriptor
      > = {},
      options: ListOptions = {}
    ) => {
      const query = queryString.stringify({
        limit: options.offset,
        offset: options.offset,
        branchId: objectDescriptor.branchId,
        organizationId: objectDescriptor.organizationId,
        projectId: objectDescriptor.projectId
      });
      const response = await this.fetch(`activities?${query}`);
      const { activities } = await unwrapEnvelope(response.json());
      return activities;
    },
    info: async ({ activityId }: ActivityDescriptor) => {
      const response = await this.fetch(`activities/${activityId}`);
      return response.json();
    }
  };

  organizations = {
    list: async () => {
      const response = await this.fetch("organizations");
      return unwrapEnvelope(response.json());
    }
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
      const response = await this.fetch(
        // prettier-ignore
        "comments",
        {
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
        }
      );

      return response.json();
    }
  };

  commits = {
    list: async (
      objectDescriptor: BranchDescriptor | FileDescriptor | LayerDescriptor
    ) => {
      const query = queryString.stringify({
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
      if (objectDescriptor.sha !== undefined) {
        const commits = await this.commits.list(
          objectBranchDescriptor(objectDescriptor)
        );

        return find(commits, { sha: objectDescriptor.sha });
      } else {
        const commits = await this.commits.list(objectDescriptor);
        return commits[0];
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
      const response = await this.fetch(
        // prettier-ignore
        `projects/${branchDescriptor.projectId}/branches/${branchDescriptor.branchId}/files`
      );

      const data = await response.json();
      return data.files;
    },
    info: async (fileDescriptor: FileDescriptor) => {
      const files = await this.files.list(fileBranchDescriptor(fileDescriptor));
      return find(files, { id: fileDescriptor.fileId });
    }
  };

  pages = {
    list: async (fileOrBranchDescriptor: FileDescriptor) => {
      const response = await this.fetch(
        // prettier-ignore
        `projects/${fileOrBranchDescriptor.projectId}/branches/${fileOrBranchDescriptor.branchId}/files/${fileOrBranchDescriptor.fileId}/pages`
      );

      const data = await response.json();
      return data.pages;
    },
    info: async (pageDescriptor: PageDescriptor) => {
      const pages = await this.files.info(pageFileDescriptor(pageDescriptor));
      return find(pages, { id: pageDescriptor.pageId });
    }
  };

  layers = {
    list: async (
      objectDescriptor: FileDescriptor | PageDescriptor,
      options: ListOptions = {}
    ) => {
      const query = queryString.stringify({
        pageId: objectDescriptor.pageId ? objectDescriptor.pageId : undefined,
        ...options
      });

      const response = await this.fetch(
        // prettier-ignore
        `projects/${objectDescriptor.projectId}/branches/${objectDescriptor.branchId}/files/${objectDescriptor.fileId}/layers?${query}`
      );

      const data = await response.json();
      return data.layers;
    },
    info: async (layerDescriptor: LayerDescriptor) => {
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
    info: (layerDescriptor: LayerDescriptor) => {
      // prettier-ignore
      return {
        webUrl: `${this.previewsUrl}/projects/${layerDescriptor.projectId}/commits/${layerDescriptor.sha}/files/${layerDescriptor.fileId}/layers/${layerDescriptor.layerId}`
      };
    },
    raw: async (layerDescriptor: LayerDescriptor, options: *) => {
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
        ...options
      });

      const response = await this.fetch(
        // prettier-ignore
        `projects/${projectOrBranchDescriptor.projectId}/collections?${query}`
      );

      const data = await unwrapEnvelope(response.json());
      return data.collections;
    },
    info: async (
      collectionDescriptor: CollectionDescriptor,
      options?: { layersPerCollection?: number | "all" } = {}
    ) => {
      const query = queryString.stringify(options);
      const response = await this.fetch(
        // prettier-ignore
        `projects/${collectionDescriptor.projectId}/collections/${collectionDescriptor.collectionId}?${query}`
      );

      const data = await unwrapEnvelope(response.json());
      return data.collections[0];
    }
  };

  notifications = {
    list: async (
      objectDescriptor?: OrganizationDescriptor,
      options: ListOptions = {}
    ) => {
      const query = queryString.stringify({
        limit: options.offset,
        offset: options.offset,
        organizationId: objectDescriptor && objectDescriptor.organizationId
      });
      const response = await this.fetch(`notifications?${query}`);
      const notifications = await unwrapEnvelope(response.json());
      return notifications;
    }
  };

  async _denormalizeDescriptorForComment(
    objectDescriptor: BranchDescriptor | LayerDescriptor
  ): Promise<BranchNames | LayerNames> {
    const branch = await this.branches.info(
      objectDescriptor.layerId !== undefined
        ? // $FlowFixMe: objectDescriptor with a defined layerId shouldn't be considered a BranchDescriptor?
          layerBranchDescriptor(objectDescriptor)
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
