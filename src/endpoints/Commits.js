// @flow
import querystring from "query-string";
import type {
  BranchDescriptor,
  Commit,
  CommitDescriptor,
  FileDescriptor,
  LayerDescriptor,
  LayerVersionDescriptor
} from "../types";
import Endpoint from "./Endpoint";

export default class Commits extends Endpoint {
  info(descriptor: CommitDescriptor | FileDescriptor | LayerVersionDescriptor) {
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
    descriptor: BranchDescriptor | FileDescriptor | LayerDescriptor,
    options: {
      limit?: number,
      startSHA?: string,
      endSHA?: string
    } = {}
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
          ...(options.startSHA ? ["--start-sha", options.startSHA] : []),
          ...(options.endSHA ? ["--end-sha", options.endSHA] : []),
          ...(options.limit ? ["--limit", options.limit.toString()] : [])
        ]);
        return response.commits;
      }
    });
  }
}
