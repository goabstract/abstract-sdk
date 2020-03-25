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

/**
 * @class Branches
 * @description
 * A branch is where design work and commits happen.
 * A branch acts as a personal workspace for contributors,
 * we encourage branches to be created for logical chunks of work
 * – for example designing a new feature.
 * @extends {Endpoint}
 */
export default class Branches extends Endpoint {
  /**
   * @memberof Branches
   * @param {BranchDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @description
   * Retrieve a branch
   * @returns {Promise<Branch>}
   * @example
   * // Load the info for a specific branch in a project
   * abstract.branches.info({
   *   projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *   branchId: "master"
   * });
   */
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

  /**
   * @memberof Branches
   * @param {ProjectDescriptor} [descriptor]
   * @param {object} options
   * @param {object} options.RequestOptions - spread operator
   * @param {("active" | "archived" | "mine")} options.filter
   * @param {string} options.search
   * @returns {Promise<Branch[]>}
   * @description
   * List all branches
   * <div class="banner banner-warning">
   *  Note: Searching for branches is only available when using the API transport.
   * </div>
   * @returns {Promise<Branch[]>}
   * @example
   * // List the active branches for a project
   * abstract.branches.list({
   *   projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   * }, {
   *   filter: "active"
   * });
   *
   * @example
   * // Search for a branch by name across all projects
   * abstract.branches.list(undefined, {
   *   search: "branch name"
   * });
   */
  list(
    descriptor?: ProjectDescriptor,
    options: {
      ...ListOptions,
      filter?: "active" | "archived" | "mine",
      search?: string
    } = {}
  ) {
    const { limit, offset, filter, search, ...requestOptions } = options;

    return this.configureRequest<Promise<Branch[]>>({
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

    return this.configureRequest<Promise<BranchMergeState>>({
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
