// @flow
import querystring from "query-string";
import type {
  BaseCommitDescriptor,
  Commit,
  CommitDescriptor,
  FileDescriptor,
  LayerDescriptor
} from "../types";
import { NotFoundError } from "../errors";
import BaseEndpoint from "./BaseEndpoint";

export default class Commits extends BaseEndpoint {
  info(
    descriptor: CommitDescriptor | FileDescriptor | LayerDescriptor
  ): Promise<Commit> {
    return this.request<Promise<Commit>>({
      api: async () => {
        const commits = await this.list(descriptor, { limit: 1 });
        if (!commits[0]) {
          throw new NotFoundError(`commitId=${descriptor.sha}`);
        }
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
    descriptor: CommitDescriptor | FileDescriptor | LayerDescriptor,
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

  async getLatestDescriptor<T: BaseCommitDescriptor>(
    descriptor: T
  ): Promise<T> {
    if (descriptor.sha !== "latest") return descriptor;
    const [commit] = await this.list((descriptor: any), { limit: 1 });
    return {
      ...descriptor,
      commitSha: commit.sha,
      sha: commit.sha
    };
  }
}
