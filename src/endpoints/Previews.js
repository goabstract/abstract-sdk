// @flow
import type { LayerDescriptor, PreviewMeta } from "../types";
import Endpoint from "./Endpoint";

export default class Previews extends Endpoint {
  async info(descriptor: LayerDescriptor): Promise<PreviewMeta> {
    descriptor = await this.client.commits.getLatestDescriptor(descriptor);
    return this.request<Promise<PreviewMeta>>({
      api: async () => ({
        webUrl: `${this.previewsUrl}/projects/${descriptor.projectId}/commits/${
          descriptor.sha
        }/files/${descriptor.fileId}/layers/${descriptor.layerId}`
      })
    });
  }

  async raw(descriptor: LayerDescriptor): Promise<ArrayBuffer> {
    descriptor = await this.client.commits.getLatestDescriptor(descriptor);
    return this.request<Promise<ArrayBuffer>>({
      api: () => {
        return this.apiRawRequest(
          `projects/${descriptor.projectId}/commits/${descriptor.sha}/files/${
            descriptor.fileId
          }/layers/${descriptor.layerId}`,
          {
            headers: {
              Accept: undefined,
              "Content-Type": undefined,
              "Abstract-Api-Version": undefined
            }
          },
          this.previewsUrl
        );
      }
    });
  }
}
