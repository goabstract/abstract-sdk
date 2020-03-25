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

/**
 *
 * @export
 * @class Commits
 * @extends {Endpoint}
 * @see [Commit](#commit)
 * @see [BranchCommitDescriptor](#branchCommitDescriptor)
 * @see [CommitDescriptor](#commitDescriptor)
 * @see [FileDescriptor](#fileDescriptor)
 * @see [LayerVersionDescriptor](#layerVersionDescriptor)
 * @description
 * A commit represents a point in time – contributors can create commits
 * in the desktop app to save their work at different stages.
 * When loading data from the Abstract SDK you will almost always need
 * to provide a commit <strong>SHA</strong> to identify
 * which version of the object you would like.
 */
export default class Commits extends Endpoint {
  /**
   *
   *
   * @param {(BranchCommitDescriptor
   *       | CommitDescriptor
   *       | FileDescriptor
   *       | LayerVersionDescriptor)} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Commit>}
   * @example
   * abstract.commits.info({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  sha: "fb7e9b50da6c330fc43ffb369616f0cd1fa92cc2"
   * });
   * @memberof Commits
   */
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

  /**
  *
  *
  * @param {(BranchDescriptor | LayerDescriptor)} descriptor
  * @param {{ ...RequestOptions, limit?: number,
      startSha?: string,
      endSha?: string} = {}} options
  * @memberof Commits
   * @example
   * // List the commits for a specific branch
   * abstract.commits.list({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master"
   * });
   * 
   * @example
   * // or, get a list of commits for a layer – this query
   * // will only return commits where the referenced layer was changed…
   * abstract.commits.list({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
   *  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19"
   * });
   * @returns {Promise<Commit[]>}
  */
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
