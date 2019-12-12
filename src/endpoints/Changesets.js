// @flow
import type {
  BranchDescriptor,
  Changeset,
  CommitDescriptor,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";

export default class Changesets extends Endpoint {
  async commit(
    descriptor: CommitDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<Changeset>>(
      {
        api: async () => {
          const response = await this.apiRequest(
            `projects/${latestDescriptor.projectId}/branches/${latestDescriptor.branchId}/commits/${latestDescriptor.sha}/changeset`
          );

          return response.changeset;
        },

        cli: async () => {
          const response = await this.cliRequest([
            "changeset",
            latestDescriptor.projectId,
            "--commit",
            latestDescriptor.sha,
            "--branch",
            latestDescriptor.branchId
          ]);

          return response.changeset;
        }
      },
      requestOptions
    );
  }

  async branch(
    descriptor: BranchDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Changeset>>(
      {
        api: async () => {
          const response = await this.apiRequest(
            `projects/${descriptor.projectId}/branches/${descriptor.branchId}/changeset`
          );

          return response.changeset;
        },

        cli: async () => {
          const response = await this.cliRequest([
            "changeset",
            descriptor.projectId,
            "--branch",
            descriptor.branchId
          ]);

          return response.changeset;
        }
      },
      requestOptions
    );
  }
}
