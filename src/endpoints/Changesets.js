// @flow
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";
import type {
  ProjectDescriptor,
  BranchDescriptor,
  Changeset,
  BranchCommitDescriptor,
  RequestOptions
} from "../types";

const headers = {
  "Abstract-Api-Version": "19"
};

export default class Changesets extends Endpoint {
  name = "changesets";

  async commit(
    descriptor: BranchCommitDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<Changeset>>("commit", {
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

  branch(descriptor: BranchDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Changeset>>("branch", {
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
    return this.configureRequest<Promise<Changeset>>("project", {
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
