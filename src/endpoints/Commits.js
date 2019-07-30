// @flow
import querystring from "query-string";
import type {
  BranchDescriptor,
  Commit,
  CommitDescriptor,
  FileDescriptor,
  LayerDescriptor
} from "../types";
import Endpoint from "./Endpoint";

export default class Commits extends Endpoint {
  info(descriptor: CommitDescriptor | FileDescriptor | LayerDescriptor) {
    return this.request<Promise<Commit>>({
      api: () => {
        return this.apiRequest(
          `projects/${descriptor.projectId}/branches/${descriptor.branchId}/commits/${descriptor.sha}`
        );
      },

      cli: async () => {
        const response = await this.cliRequest([
          "commit",
          descriptor.projectId,
          descriptor.sha
        ]);
        return response.commit;
      },

      cache: {
        key: `commit:${descriptor.sha}`
      }
    });
  }

  list(
    descriptor: BranchDescriptor,
    options: {
      fileId?: string,
      layerId?: string,
      startSHA?: string,
      endSHA?: string,
      limit?: number
    } = {}
  ) {
    return this.request<Promise<Commit[]>>({
      api: async () => {
        const query = querystring.stringify({
          fileId: options.fileId,
          layerId: options.layerId,
          startSHA: options.startSHA,
          endSHA: options.endSHA,
          limit: options.limit
        });
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/branches/${descriptor.branchId}/commits?${query}`
        );
        return response.commits;
      },

      cli: async () => {
        const response = await this.cliRequest([
          "commits",
          descriptor.projectId,
          descriptor.branchId,
          ...(options.fileId ? ["--file-id", options.fileId] : []),
          ...(options.layerId ? ["--layer-id", options.layerId] : []),
          ...(options.startSHA ? ["--file-id", options.startSHA] : []),
          ...(options.endSHA ? ["--layer-id", options.endSHA] : []),
          ...(options.limit ? ["--limit", options.limit.toString()] : [])
        ]);
        return response.commits;
      }
    });
  }
}
