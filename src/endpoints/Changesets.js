// @flow
import type { BranchDescriptor, Changeset, CommitDescriptor } from "../types";
import Endpoint from "./Endpoint";

export default class Changesets extends Endpoint {
  async commit(descriptor: CommitDescriptor) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );
    return this.request<Promise<Changeset>>({
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
      },

      cache: {
        key: `changeset-commit:${descriptor.sha}`,
        disabled: descriptor.sha === "latest"
      }
    });
  }

  async branch(descriptor: BranchDescriptor) {
    return this.request<Promise<Changeset>>({
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
    });
  }
}
