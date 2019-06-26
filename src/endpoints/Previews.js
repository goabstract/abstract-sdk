/* @flow */
/* global Blob */
import { promises as fs } from "fs";
import { FileAPIError } from "../errors";
import type { LayerDescriptor, PreviewMeta, RawOptions } from "../types";
import { isNodeEnvironment } from "../utils";
import Endpoint from "./Endpoint";

export default class Previews extends Endpoint {
  async info(descriptor: LayerDescriptor) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );
    return this.request<Promise<PreviewMeta>>({
      api: async () => ({
        webUrl: `${await this.webUrl}/projects/${
          latestDescriptor.projectId
        }/commits/${latestDescriptor.sha}/files/${
          latestDescriptor.fileId
        }/layers/${latestDescriptor.layerId}`
      })
    });
  }

  async raw(descriptor: LayerDescriptor, options: RawOptions = {}) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );
    return this.request<Promise<ArrayBuffer>>({
      api: async () => {
        const arrayBuffer = await this.apiRawRequest(
          `projects/${latestDescriptor.projectId}/commits/${latestDescriptor.sha}/files/${latestDescriptor.fileId}/layers/${latestDescriptor.layerId}`,
          {
            headers: {
              Accept: undefined,
              "Content-Type": undefined,
              "Abstract-Api-Version": undefined
            }
          },
          await this.previewsUrl
        );

        /* istanbul ignore if */
        if (isNodeEnvironment() && !options.disableWrite) {
          const filename =
            options.filename || `${latestDescriptor.layerId}.png`;
          fs.writeFile(filename, Buffer.from(arrayBuffer));
        }

        return arrayBuffer;
      },

      cache: {
        key: `preview-raw:${descriptor.layerId}`,
        disable: descriptor.sha === "latest"
      }
    });
  }

  async url(descriptor: LayerDescriptor) {
    if (typeof Blob === "undefined") {
      throw new FileAPIError();
    }

    const buffer = await this.raw(descriptor);

    return URL.createObjectURL(
      new Blob([new DataView(buffer)], { type: "image/png" })
    );
  }
}
