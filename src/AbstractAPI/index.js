// @flow
/* global fetch */
import "cross-fetch/polyfill";
import queryString from "query-string";
import find from "lodash/find";
import { version } from "../../package.json";
import {
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
  Comment
} from "../";
import randomTraceId from "./randomTraceId";

const minorVersion = version.split(".", 2).join(".");
const logStatusError = log.extend("AbstractAPI:status:error");
const logStatusSuccess = log.extend("AbstractAPI:status:success");
const logFetch = log.extend("AbstractAPI:fetch");

type Options = {
  abstractToken: string
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
  abstractToken: string;

  constructor({ abstractToken }: Options) {
    this.abstractToken = abstractToken;
  }

  async fetch(
    input: string | URL,
    init: Object = {},
    hostname: string = process.env.ABSTRACT_API_URL ||
      "https://api.goabstract.com"
  ) {
    init.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": `Abstract SDK ${minorVersion}`,
      Authorization: `Bearer ${this.abstractToken}`,
      "X-Amzn-Trace-Id": randomTraceId(),
      "Abstract-Api-Version": "7",
      ...(init.headers || {})
    };

    if (init.body) {
      init.body = JSON.stringify(init.body);
    }

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
      logStatusSuccess(await response.clone().json());
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
      process.env.ABSTRACT_PREVIEWS_URL || "https://previews.goabstract.com"
    );
  }

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
    }
  };

  comments = {
    create: async (
      objectDescriptor: BranchDescriptor | LayerDescriptor,
      comment: Comment
    ) => {
      const response = await this.fetch(
        // prettier-ignore
        `comments`,
        {
          method: "POST",
          body: JSON.stringify({
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
          })
        }
      );

      return response.json();
    }
  };

  branches = {
    info: async (branchDescriptor: BranchDescriptor) => {
      const response = await this.fetch(
        // prettier-ignore
        `projects/${branchDescriptor.projectId}/branches/${branchDescriptor.branchId}`
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

      return unwrapEnvelope(response.json());
    },
    info: async (
      objectDescriptor: BranchDescriptor | FileDescriptor | LayerDescriptor
    ) => {
      const { commits } = await this.commits.list(objectDescriptor);
      return commits[0];
    }
  };

  changesets = {
    info: async (commitDescriptor: CommitDescriptor) => {
      const response = await this.fetch(
        // prettier-ignore
        `projects/${commitDescriptor.projectId}/branches/${commitDescriptor.branchId}/commits/${commitDescriptor.sha}/changeset`
      );

      return response.json();
    }
  };

  files = {
    list: async (branchDescriptor: BranchDescriptor) => {
      const response = await this.fetch(
        // prettier-ignore
        `projects/${branchDescriptor.projectId}/branches/${branchDescriptor.branchId}/files`
      );

      return unwrapEnvelope(response.json());
    },
    info: async (fileDescriptor: FileDescriptor) => {
      const { files } = await this.files.list(
        fileBranchDescriptor(fileDescriptor)
      );

      return find(files, { id: fileDescriptor.fileId });
    }
  };

  pages = {
    list: async (fileOrBranchDescriptor: FileDescriptor) => {
      const response = await this.fetch(
        // prettier-ignore
        `projects/${fileOrBranchDescriptor.projectId}/branches/${fileOrBranchDescriptor.branchId}/files/${fileOrBranchDescriptor.fileId}/pages`
      );

      return unwrapEnvelope(response.json());
    },
    info: async (pageDescriptor: PageDescriptor) => {
      const { pages } = await this.files.info(
        pageFileDescriptor(pageDescriptor)
      );

      return find(pages, { id: pageDescriptor.pageId });
    }
  };

  layers = {
    list: async (
      fileDescriptor: FileDescriptor,
      options: { pageId?: string, limit?: number, offset?: number } = {}
    ) => {
      const query = queryString.stringify(options);
      const response = await this.fetch(
        // prettier-ignore
        `projects/${fileDescriptor.projectId}/branches/${fileDescriptor.branchId}/files/${fileDescriptor.fileId}/layers?${query}`
      );

      return response.json();
    },
    info: async (layerDescriptor: LayerDescriptor) => {
      const response = await this.fetch(
        // prettier-ignore
        `projects/${layerDescriptor.projectId}/branches/${layerDescriptor.branchId}/commits/${layerDescriptor.sha}/files/${layerDescriptor.fileId}/layers/${layerDescriptor.layerId}`
      );

      return response.json();
    }
  };

  previews = {
    blob: async (layerDescriptor: LayerDescriptor, options: *) => {
      const response = await this.fetchPreview(
        // prettier-ignore
        `projects/${layerDescriptor.projectId}/branches/${layerDescriptor.branchId}/commits/${layerDescriptor.sha}/files/${layerDescriptor.fileId}/layers/${layerDescriptor.layerId}`,
        options
      );

      return response.blob();
    }
  };

  data = {
    layer: (layerDescriptor: LayerDescriptor) => {
      return this.fetch(
        // prettier-ignore
        `projects/${layerDescriptor.projectId}/branches/${layerDescriptor.branchId}/commits/${layerDescriptor.sha}/files/${layerDescriptor.fileId}/layers/${layerDescriptor.layerId}/data`
      );
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

      return unwrapEnvelope(response.json());
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

      return unwrapEnvelope(response.json());
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
      const { layer, page, file } = await this.layers.info(objectDescriptor);

      return {
        branchName: branch.name,
        fileName: file.name,
        pageName: page.name,
        pageId: page.id,
        layerName: layer.name
      };
    } else {
      return { branchName: branch.name };
    }
  }
}
