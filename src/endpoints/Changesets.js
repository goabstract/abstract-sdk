// @flow
import type { Changeset, CommitDescriptor } from "../types";
import Endpoint from "./Endpoint";

export default class Changesets extends Endpoint {
  async info(descriptor: CommitDescriptor): Promise<Changeset> {
    descriptor = await this.client.commits.getLatestDescriptor(descriptor);
    return this.request<Promise<Changeset>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/branches/${
            descriptor.branchId
          }/commits/${descriptor.sha}/changeset`
        );
        return response.changeset;
      },

      cli: () => {
        return this.cliRequest([
          "changeset",
          descriptor.projectId,
          "--commit",
          descriptor.sha,
          "--branch",
          descriptor.branchId
        ]);
      }
    });
  }
}
