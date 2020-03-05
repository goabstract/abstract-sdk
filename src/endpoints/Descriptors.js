// @flow
import type { ObjectDescriptor, RequestOptions } from "../types";
import Endpoint from "../endpoints/Endpoint";

/**
 *
 * Descriptors Desc
 * @export
 * @class Descriptors
 * @extends {Endpoint}
 */
export default class Descriptors extends Endpoint {
  async getLatestDescriptor<T: ObjectDescriptor>(
    descriptor: T,
    requestOptions: RequestOptions = {}
  ): Promise<T> {
    if (descriptor.sha !== "latest") return descriptor;

    const [commit] = await this.client.commits.list((descriptor: any), {
      ...requestOptions,
      limit: 1
    });

    return {
      ...descriptor,
      commitSha: commit.sha,
      sha: commit.sha
    };
  }
}
