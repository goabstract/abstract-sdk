/* @flow */
/* global Blob */
import { FileAPIError } from "../errors";
import type { LayerDescriptor, PreviewMeta } from "../types";
import Endpoint from "./Endpoint";

export default class Previews extends Endpoint {
  async info(descriptor: LayerDescriptor): Promise<PreviewMeta> {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );
    return this.request<Promise<PreviewMeta>>({
      api: async () => ({
        webUrl: `${this.webUrl}/projects/${
          latestDescriptor.projectId
        }/commits/${latestDescriptor.sha}/files/${
          latestDescriptor.fileId
        }/layers/${latestDescriptor.layerId}`
      })
    });
  }

  async raw(descriptor: LayerDescriptor): Promise<ArrayBuffer> {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );
    return this.request<Promise<ArrayBuffer>>({
      api: () => {
        return this.apiRawRequest(
          `projects/${latestDescriptor.projectId}/commits/${
            latestDescriptor.sha
          }/files/${latestDescriptor.fileId}/layers/${
            latestDescriptor.layerId
          }`,
          {
            headers: {
              Accept: undefined,
              "Content-Type": undefined,
              "Abstract-Api-Version": undefined
            }
          },
          this.previewsUrl
        );
      },

      cache: {
        key: `preview-raw:${descriptor.layerId}`,
        disable: descriptor.sha === "latest"
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
