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
  name = "commits";

  info(
    descriptor:
      | BranchCommitDescriptor
      | CommitDescriptor
      | FileDescriptor
      | LayerVersionDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Commit>>("info", {
      api: async () => {
        // loading commits with a share token requires a branchId so this
        // route is maintained for that circumstance
        const requestUrl = descriptor.branchId
          ? `projects/${descriptor.projectId}/branches/${descriptor.branchId}/commits/${descriptor.sha}`
          : `projects/${descriptor.projectId}/commits/${descriptor.sha}`;
        const response = await this.apiRequest(requestUrl);
        return wrap(response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "commits",
          "get",
          descriptor.sha,
          `--project-id=${descriptor.projectId}`
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

    return this.configureRequest<Promise<Commit[]>>("list", {
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
          "list",
          `--project-id=${descriptor.projectId}`,
          `--branch-id=${descriptor.branchId}`,
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
