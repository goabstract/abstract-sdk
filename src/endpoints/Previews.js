// @flow
import type { LayerDescriptor, PreviewMeta } from "../types";
import BaseEndpoint from "./BaseEndpoint";

export default class Previews extends BaseEndpoint {
  info(descriptor: LayerDescriptor): Promise<PreviewMeta> {
    return this.request<Promise<PreviewMeta>>({
      api: async () => ({
        webUrl: `${this.previewsUrl}/projects/${descriptor.projectId}/commits/${
          descriptor.sha
        }/files/${descriptor.fileId}/layers/${descriptor.layerId}`
      })
    });
  }

  raw(descriptor: LayerDescriptor): Promise<ArrayBuffer> {
    return this.request<Promise<ArrayBuffer>>({
      api: () => {
        return this.apiRawRequest(
          `projects/${descriptor.projectId}/commits/${descriptor.sha}/files/${descriptor.fileId}/layers/${descriptor.layerId}`,
          {
            headers: {
              Accept: undefined,
              "Content-Type": undefined,
              "Abstract-Api-Version": undefined
            }
          }
        );
      }
    });
  }
}
