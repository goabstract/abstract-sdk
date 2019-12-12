// @flow
import querystring from "query-string";
import type {
  Branch,
  BranchDescriptor,
  ProjectDescriptor,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";

export default class Branches extends Endpoint {
  info(descriptor: BranchDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Branch>>(
      {
        api: () => {
          return this.apiRequest(
            `projects/${descriptor.projectId}/branches/${descriptor.branchId}`
          );
        },

        cli: () => {
          return this.cliRequest([
            "branch",
            "load",
            descriptor.projectId,
            descriptor.branchId
          ]);
        }
      },
      requestOptions
    );
  }

  list(
    descriptor: ProjectDescriptor,
    options: {
      ...RequestOptions,
      filter?: "active" | "archived" | "mine"
    } = {}
  ) {
    const { filter, ...requestOptions } = options;

    return this.configureRequest<Promise<Branch[]>>(
      {
        api: async () => {
          const query = querystring.stringify({ filter });

          const response = await this.apiRequest(
            `projects/${descriptor.projectId}/branches/?${query}`
          );

          return response.data.branches;
        },

        cli: async () => {
          const response = await this.cliRequest([
            "branches",
            descriptor.projectId,
            ...(filter ? ["--filter", filter] : [])
          ]);

          return response.branches;
        }
      },
      requestOptions
    );
  }
}
