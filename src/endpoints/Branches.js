// @flow
import querystring from "query-string";
import type {
  Branch,
  BranchDescriptor,
  BranchMergeState,
  ListOptions,
  ProjectDescriptor,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";
import { BranchSearchCLIError } from "../errors";

// Version 17 returns policies for branches
const headers = {
  "Abstract-Api-Version": "17"
};

export default class Branches extends Endpoint {
  name = "branches";

  info(descriptor: BranchDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Branch>>("info", {
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/branches/${descriptor.branchId}`,
          {
            headers
          }
        );
        return wrap(response.data, response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "branches",
          "get",
          descriptor.branchId,
          `--project-id=${descriptor.projectId}`
        ]);
        return wrap(response);
      },

      requestOptions
    });
  }

  list(
    descriptor?: ProjectDescriptor,
    options: {
      ...ListOptions,
      filter?: "active" | "archived" | "mine",
      search?: string
    } = {}
  ) {
    const { limit, offset, filter, search, ...requestOptions } = options;

    return this.configureRequest<Promise<Branch[]>>("list", {
      api: async () => {
        const query = querystring.stringify({ limit, offset, filter, search });
        const requestUrl = descriptor
          ? `projects/${descriptor.projectId}/branches/?${query}`
          : `branches/?${query}`;

        const response = await this.apiRequest(requestUrl, { headers });
        return wrap(response.data.branches, response);
      },

      cli: async () => {
        if (!descriptor) {
          throw new BranchSearchCLIError();
        }
        const response = await this.cliRequest([
          "branches",
          "list",
          `--project-id=${descriptor.projectId}`,
          ...(filter ? ["--filter", filter] : [])
        ]);

        return wrap(response.branches, response);
      },

      requestOptions
    });
  }

  mergeState(
    descriptor: BranchDescriptor,
    options?: { ...RequestOptions, parentId?: string } = {}
  ) {
    const { parentId, ...requestOptions } = options;

    return this.configureRequest<Promise<BranchMergeState>>("mergeState", {
      api: async () => {
        let requestUrl = `projects/${descriptor.projectId}/branches/${descriptor.branchId}/merge_state`;
        if (parentId) {
          const query = querystring.stringify({ parentId });
          requestUrl = `${requestUrl}?${query}`;
        }
        const response = await this.apiRequest(requestUrl, { headers });
        return wrap(response.data, response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "branches",
          "merge-state",
          descriptor.branchId,
          `--project-id=${descriptor.projectId}`
        ]);

        return wrap(response.data, response);
      },

      requestOptions
    });
  }
}
