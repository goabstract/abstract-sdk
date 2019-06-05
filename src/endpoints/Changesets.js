// @flow
import type { Changeset, CommitDescriptor } from "../types";
import Endpoint from "./Endpoint";

export default class Changesets extends Endpoint {
  async info(descriptor: CommitDescriptor) {
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

      cache: {
        key: `changeset:${descriptor.sha}`,
        disabled: descriptor.sha === "latest"
      }
    });
  }
}
