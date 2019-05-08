// @flow
import type { ObjectDescriptor } from "../types";
import Endpoint from "./Endpoint";

export default class Descriptors extends Endpoint {
  async getLatestDescriptor<T: ObjectDescriptor>(descriptor: T): Promise<T> {
    if (descriptor.sha !== "latest") return descriptor;

    const [commit] = await this.client.commits.list((descriptor: any), {
      limit: 1
    });

    let latestDescriptor: any = {
      ...descriptor,
      commitSha: commit.sha,
      sha: commit.sha
    };

    if (
      latestDescriptor.projectId &&
      latestDescriptor.branchId &&
      latestDescriptor.sha &&
      latestDescriptor.fileId &&
      latestDescriptor.layerId
    ) {
      const layer = await this.client.layers.info(latestDescriptor);
      latestDescriptor = {
        ...descriptor,
        commitSha: layer.lastChangedAtSha,
        sha: layer.lastChangedAtSha
      };
    }

    return latestDescriptor;
  }
}
