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
import { BranchSearchCLIError } from "../errors";

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
      ...RequestOptions,
      filter?: "active" | "archived" | "mine",
      search?: string
    } = {}
  ) {
    const { filter, search, ...requestOptions } = options;

    return this.configureRequest<Promise<Branch[]>>({
      api: async () => {
        const query = querystring.stringify({ filter, search });
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
}
