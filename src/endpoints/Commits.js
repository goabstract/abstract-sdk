// @flow
import querystring from "query-string";
import type {
  BranchDescriptor,
  Commit,
  FileDescriptor,
  LayerDescriptor
} from "../types";
import BaseEndpoint from "./BaseEndpoint";

export default class Commits extends BaseEndpoint {
  info(
    descriptor: BranchDescriptor | FileDescriptor | LayerDescriptor
  ): Promise<Commit> {
    return this.request<Promise<Commit>>({
      api: async () => {
        const commits = await this.list(descriptor, { limit: 1 });
        return commits[0];
      },

      cli: async () => {
        const response = await this.cliRequest([
          "commit",
          descriptor.projectId,
          descriptor.sha
        ]);
        return response.commit;
      }
    });
  }

  list(
    descriptor: BranchDescriptor | FileDescriptor | LayerDescriptor,
    options: { limit?: number } = {}
  ): Promise<Commit[]> {
    return this.request<Promise<Commit[]>>({
      api: async () => {
        const query = querystring.stringify({
          ...options,
          fileId: descriptor.fileId && descriptor.fileId,
          layerId: descriptor.layerId && descriptor.layerId
        });
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/branches/${
            descriptor.branchId
          }/commits?${query}`
        );
        return response.commits;
      },

      cli: async () => {
        const response = await this.cliRequest([
          "commits",
          descriptor.projectId,
          descriptor.branchId,
          ...(descriptor.fileId ? ["--file-id", descriptor.fileId] : []),
          ...(descriptor.layerId ? ["--layer-id", descriptor.layerId] : []),
          ...(options.limit ? ["--limit", options.limit.toString()] : [])
        ]);
        return response.commits;
      }
    });
  }
}
