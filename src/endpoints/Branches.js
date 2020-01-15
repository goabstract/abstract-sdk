// @flow
import querystring from "query-string";
import type {
  Branch,
  BranchDescriptor,
  ProjectDescriptor,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

// Version 17 returns policies for branches
const headers = {
  "Abstract-Api-Version": "17"
};

export default class Branches extends Endpoint {
  info(descriptor: BranchDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Branch>>({
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
          "branch",
          "load",
          descriptor.projectId,
          descriptor.branchId
        ]);
        return wrap(response);
      },

      requestOptions
    });
  }

  list(
    descriptor: ?ProjectDescriptor,
    options: {
      ...RequestOptions,
      filter?: "active" | "archived" | "mine",
      search?: string
    } = {}
  ) {
    const { filter, search, ...requestOptions } = options;

    return this.configureRequest<Promise<Branch[]>>({
      api: async () => {
        const projectId = descriptor ? descriptor.projectId : undefined;
        const query = querystring.stringify({ filter, search });

        const response = projectId
          ? await this.apiRequest(`projects/${projectId}/branches/?${query}`, {
              headers
            })
          : await this.apiRequest(`branches/?${query}`, {
              headers
            });

        return wrap(response.data.branches, response);
      },

      cli: async () => {
        const projectId = descriptor ? descriptor.projectId : undefined;
        if (!projectId) {
          throw new Error("projectId required with CLI transport");
        }
        if (search) {
          throw new Error("search not supported with CLI transport");
        }

        const response = await this.cliRequest([
          "branches",
          projectId,
          ...(filter ? ["--filter", filter] : [])
        ]);

        return wrap(response.branches, response);
      },

      requestOptions
    });
  }
}
