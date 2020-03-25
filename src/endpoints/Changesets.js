// @flow
import type {
  ProjectDescriptor,
  BranchDescriptor,
  Changeset,
  BranchCommitDescriptor,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

const headers = {
  "Abstract-Api-Version": "19"
};

/**
 * @class Changesets
 * @see [BranchCommitDescriptor](#branchCommitDescriptor)
 * @see [BranchDescriptor](#branchDescriptor)
 * @see [ProjectDescriptor](#projectDescriptor)
 * @description
 * A changeset is a group of changes that together form a single,
 * indivisible modification to a project.
 * Changesets include data on all visual and nonvisual changes
 * and provide insight into the differences between two versions of a project.
 * @extends {Endpoint}
 */
export default class Changesets extends Endpoint {
  /**
   * @memberof Changesets
   * @param {BranchCommitDescriptor} descriptor
   * @param {RequestOptions} requestOptions
   * @returns {Promise<Changeset>}
   * @description
   * Retrieve a changeset for a commit
   * @example
   * // Load a changeset for a commit
   * abstract.changesets.commit({
   *  branchId: "master",
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  sha: "e2a0a301c4a530ec16024cbb339dfc135c841b10"
   * });
   */
  async commit(
    descriptor: BranchCommitDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<Changeset>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${latestDescriptor.projectId}/branches/${latestDescriptor.branchId}/commits/${latestDescriptor.sha}/changeset`,
          { headers }
        );
        return wrap(response.changeset, response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "commits",
          "changeset",
          latestDescriptor.sha,
          `--project-id=${latestDescriptor.projectId}`
        ]);
        return wrap(response.changeset, response);
      },

      requestOptions
    });
  }

  /**
   * @memberof Changesets
   * @param {BranchDescriptor} descriptor
   * @param {RequestOptions} requestOptions
   * @returns {Promise<Changeset>}
   * @description
   * Retrieve a changeset for a branch
   * @example
   * // Load a changeset for a branch
   * abstract.changesets.branch({
   *  branchId: "c426d0a6-e039-43d7-b7b3-e685a25e4cfb",
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
   * });
   *
   */
  branch(descriptor: BranchDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Changeset>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/branches/${descriptor.branchId}/changeset`,
          { headers }
        );
        return wrap(response.changeset, response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "branches",
          "changeset",
          descriptor.branchId,
          `--project-id=${descriptor.projectId}`
        ]);
        return wrap(response.changeset, response);
      },

      requestOptions
    });
  }

  project(descriptor: ProjectDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Changeset>>({
      cli: async () => {
        const response = await this.cliRequest([
          "projects",
          "changeset",
          descriptor.projectId
        ]);
        return wrap(response.changeset, response);
      },
      requestOptions
    });
  }
}
