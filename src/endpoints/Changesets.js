// @flow
import querystring from "query-string";
import type { Changeset, CommitDescriptor } from "../types";
import BaseEndpoint from "./BaseEndpoint";

export default class Changesets extends BaseEndpoint {
  info(descriptor: CommitDescriptor): Promise<Changeset> {
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
