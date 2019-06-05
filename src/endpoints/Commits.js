// @flow
import querystring from "query-string";
import type {
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
    descriptor: CommitDescriptor | FileDescriptor | LayerDescriptor,
    options: { limit?: number } = {}
  ) {
    return this.request<Promise<Commit[]>>({
      api: async () => {
        const query = querystring.stringify({
          ...options,
          fileId: descriptor.fileId && descriptor.fileId,
          layerId: descriptor.layerId && descriptor.layerId
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
          ...(descriptor.fileId ? ["--file-id", descriptor.fileId] : []),
          ...(descriptor.layerId ? ["--layer-id", descriptor.layerId] : []),
          ...(options.limit ? ["--limit", options.limit.toString()] : [])
        ]);
        return response.commits;
      }
    });
  }
}
