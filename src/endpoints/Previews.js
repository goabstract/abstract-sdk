/* @flow */
/* global Blob */
import { FileAPIError } from "../errors";
import type { LayerDescriptor, PreviewMeta } from "../types";
import Endpoint from "./Endpoint";

export default class Previews extends Endpoint {
  async info(descriptor: LayerDescriptor): Promise<PreviewMeta> {
    descriptor = await this.client.commits.getLatestDescriptor(descriptor);
    return this.request<Promise<PreviewMeta>>({
      api: async () => ({
        webUrl: `${this.webUrl}/projects/${descriptor.projectId}/commits/${
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

  async url(descriptor: LayerDescriptor): Promise<string> {
    if (typeof Blob === "undefined") {
      throw new FileAPIError();
    }

    const buffer = await this.raw(descriptor);

    return URL.createObjectURL(
      new Blob([new DataView(buffer)], { type: "image/png" })
    );
  }
}
