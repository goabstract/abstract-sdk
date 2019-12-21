// @flow
import type {
  BranchDescriptor,
  ChangesetResponse,
  BranchCommitDescriptor,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";

const headers = {
  "Abstract-Api-Version": "19"
};

export default class Changesets extends Endpoint {
  async commit(
    descriptor: BranchCommitDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<ChangesetResponse>>({
      api: () => {
        return this.apiRequest(
          `projects/${latestDescriptor.projectId}/branches/${latestDescriptor.branchId}/commits/${latestDescriptor.sha}/changeset`,
          { headers }
        );
      },

      cli: () => {
        return this.cliRequest([
          "changeset",
          latestDescriptor.projectId,
          "--commit",
          latestDescriptor.sha,
          "--branch",
          latestDescriptor.branchId
        ]);
      },

      requestOptions
    });
  }

  async branch(
    descriptor: BranchDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<ChangesetResponse>>({
      api: () => {
        return this.apiRequest(
          `projects/${descriptor.projectId}/branches/${descriptor.branchId}/changeset`,
          { headers }
        );
      },

      cli: () => {
        return this.cliRequest([
          "changeset",
          descriptor.projectId,
          "--branch",
          descriptor.branchId
        ]);
      },

      requestOptions
    });
  }
}
