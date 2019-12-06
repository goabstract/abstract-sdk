// @flow
import querystring from "query-string";
import type {
  BranchDescriptor,
  Commit,
  CommitDescriptor,
  FileDescriptor,
  LayerDescriptor,
  LayerVersionDescriptor,
  RequestOptions
} from "@core/types";
import Endpoint from "@core/endpoints/Endpoint";

export default class Commits extends Endpoint {
  info(
    descriptor: CommitDescriptor | FileDescriptor | LayerVersionDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Commit>>(
      {
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
        }
      },
      requestOptions
    );
  }

  list(
    descriptor: BranchDescriptor | LayerDescriptor,
    options: {
      ...RequestOptions,
      limit?: number,
      startSHA?: string,
      endSHA?: string
    } = {}
  ) {
    const { limit, startSHA, endSHA, ...requestOptions } = options;

    return this.configureRequest<Promise<Commit[]>>(
      {
        api: async () => {
          const query = querystring.stringify({
            limit,
            startSHA,
            endSHA,
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
      },
      requestOptions
    );
  }
}
