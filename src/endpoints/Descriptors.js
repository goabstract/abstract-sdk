// @flow
import type { ObjectDescriptor } from "../types";
import Endpoint from "./Endpoint";

export default class Descriptors extends Endpoint {
  async getLatestDescriptor<T: ObjectDescriptor>(descriptor: T): Promise<T> {
    if (descriptor.sha !== "latest") return descriptor;
    const [commit] = await this.client.commits.list((descriptor: any), {
      limit: 1
    });
    return {
      ...descriptor,
      commitSha: commit.sha,
      sha: commit.sha
    };
  }
}
