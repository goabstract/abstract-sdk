// @flow
import querystring from "query-string";
import type {
  BranchDescriptor,
  Commit,
  BranchCommitDescriptor,
  CommitDescriptor,
  FileDescriptor,
  LayerDescriptor,
  LayerVersionDescriptor,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

export default class Commits extends Endpoint {
  info(
    descriptor:
      | BranchCommitDescriptor
      | CommitDescriptor
      | FileDescriptor
      | LayerVersionDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Commit>>({
      api: async () => {
        // loading commits with a share token requires a branchId so this
        // route is maintained for that circumstance
        const response = descriptor.branchId
          ? this.apiRequest(
              `projects/${descriptor.projectId}/branches/${descriptor.branchId}/commits/${descriptor.sha}`
            )
          : this.apiRequest(
              `projects/${descriptor.projectId}/commits/${descriptor.sha}`
            );
        return wrap(response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "commit",
          descriptor.projectId,
          descriptor.sha
        ]);

        return wrap(response.commit, response);
      },

      requestOptions
    });
  }

  list(
    descriptor: BranchDescriptor | LayerDescriptor,
    options: {
      ...RequestOptions,
      limit?: number,
      startSha?: string,
      endSha?: string
    } = {}
  ) {
    const { limit, startSha, endSha, ...requestOptions } = options;

    return this.configureRequest<Promise<Commit[]>>({
      api: async () => {
        const query = querystring.stringify({
          limit,
          startSha,
          endSha,
          fileId: descriptor.fileId && descriptor.fileId,
          layerId: descriptor.layerId && descriptor.layerId
        });

        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/branches/${descriptor.branchId}/commits?${query}`
        );

        return wrap(response.commits, response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "commits",
          descriptor.projectId,
          descriptor.branchId,
          ...(descriptor.fileId ? ["--file-id", descriptor.fileId] : []),
          ...(descriptor.layerId ? ["--layer-id", descriptor.layerId] : []),
          ...(options.startSha ? ["--start-sha", options.startSha] : []),
          ...(options.endSha ? ["--end-sha", options.endSha] : []),
          ...(options.limit ? ["--limit", options.limit.toString()] : [])
        ]);

        return wrap(response.commits, response);
      },

      requestOptions
    });
  }
}
