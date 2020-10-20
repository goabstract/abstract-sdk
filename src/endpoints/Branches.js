// @flow
import invariant from "invariant";
import querystring from "query-string";
import type {
  Branch,
  BranchDescriptor,
  BranchMergeState,
  ListOptions,
  ProjectDescriptor,
  RequestOptions,
  UpdatedBranch,
  UserDescriptor,
  User
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
    descriptor?: ProjectDescriptor | UserDescriptor,
    options: {
      ...ListOptions,
      filter?: "active" | "archived" | "mine",
      search?: string
    } = {}
  ) {
    const { limit, offset, filter, search, ...requestOptions } = options;

    return this.configureRequest<Promise<Branch[]>>("list", {
      api: async () => {
        let queryOptions = { limit, offset, filter, search };
        let response = null;

        if (descriptor && descriptor.userId) {
          queryOptions = {
            ...queryOptions,
            userId: descriptor.userId
          };
        }

        const query = querystring.stringify(queryOptions);

        if (descriptor && descriptor.projectId) {
          response = await this.apiRequest(
            `projects/${descriptor.projectId}/branches/?${query}`,
            { headers }
          );
        } else {
          response = await this.apiRequest(`branches/?${query}`, {
            headers
          });
        }

        return wrap(response.data.branches, response);
      },

      cli: async () => {
        if (!descriptor || (descriptor && !descriptor.projectId)) {
          throw new BranchSearchCLIError();
        }

        let normalizedFilter = filter;
        if (filter === "active") {
          normalizedFilter = "workedOn";
        }
        const response = await this.cliRequest([
          "branches",
          "list",
          `--project-id=${descriptor.projectId}`,
          ...(normalizedFilter ? ["--filter", normalizedFilter] : [])
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

  update(
    descriptor: BranchDescriptor,
    branch: UpdatedBranch,
    options?: {
      ...RequestOptions,
      user?: User
    } = {}
  ) {
    const { name, description, status } = branch;
    const { user, ...requestOptions } = options;

    return this.configureRequest<Promise<Branch>>("update", {
      api: async () => {
        let requestUrl = `projects/${descriptor.projectId}/branches/${descriptor.branchId}`;

        const response = await this.apiRequest(requestUrl, {
          headers,
          method: "PUT",
          body: {
            name,
            description,
            status
          }
        });

        return wrap(response.data, response);
      },

      cli: async () => {
        invariant(user, "user option required for cli");

        const args = [
          "branches",
          "update",
          descriptor.branchId,
          `--project-id=${descriptor.projectId}`,
          `--user-id=${user.id}`,
          `--user-name=${user.name}`
        ];

        if (name) {
          args.push(`--name=${name}`);
        }

        if (status) {
          args.push(`--status=${status}`);
        }

        if (description) {
          args.push(`--description=${description}`);
        }

        const response = await this.cliRequest(args);

        return wrap(response.data, response);
      },

      requestOptions
    });
  }
}
