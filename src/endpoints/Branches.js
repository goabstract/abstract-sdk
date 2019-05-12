// @flow
import querystring from "query-string";
import type { Branch, BranchDescriptor, ProjectDescriptor } from "../types";
import Endpoint from "./Endpoint";

export default class Branches extends Endpoint {
  info(descriptor: BranchDescriptor) {
    return this.request<Promise<Branch>>({
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
      },

      cache: {
        key: `branch:${descriptor.branchId}`
      }
    });
  }

  list(
    descriptor: ProjectDescriptor,
    options: { filter?: "active" | "archived" | "mine" } = {}
  ) {
    return this.request<Promise<Branch[]>>({
      api: async () => {
        const query = querystring.stringify({ ...options });
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/branches/?${query}`
        );
        return response.data.branches;
      },

      cli: async () => {
        const response = await this.cliRequest([
          "branches",
          descriptor.projectId,
          ...(options.filter ? ["--filter", options.filter] : [])
        ]);
        return response.branches;
      }
    });
  }
}
