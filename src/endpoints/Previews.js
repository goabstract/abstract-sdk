/* @flow */
/* global Blob */
import { promises as fs } from "fs";
import { FileAPIError } from "../errors";
import { isNodeEnvironment } from "../util/helpers";
import Endpoint from "../endpoints/Endpoint";
import type {
  LayerVersionDescriptor,
  PreviewMeta,
  RawOptions,
  RequestOptions
} from "../types";

export default class Previews extends Endpoint {
  name = "previews";

  async info(
    descriptor: LayerVersionDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<PreviewMeta>>("info", {
      api: async () => ({
        webUrl: `${await this.options.webUrl}/projects/${
          latestDescriptor.projectId
        }/commits/${latestDescriptor.sha}/files/${
          latestDescriptor.fileId
        }/layers/${latestDescriptor.layerId}`
      }),
      requestOptions
    });
  }

  async raw(descriptor: LayerVersionDescriptor, options: RawOptions = {}) {
    const { disableWrite, filename, ...requestOptions } = options;
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<ArrayBuffer>>("raw", {
      api: async () => {
        const previewUrl = await this.options.previewUrl;
        const arrayBuffer = await this.apiRequest(
          `projects/${latestDescriptor.projectId}/commits/${latestDescriptor.sha}/files/${latestDescriptor.fileId}/layers/${latestDescriptor.layerId}`,
          {
            headers: {
              Accept: undefined,
              "Content-Type": undefined,
              "Abstract-Api-Version": undefined
            }
          },
          {
            customHostname: previewUrl,
            raw: true
          }
        );

        /* istanbul ignore if */
        if (isNodeEnvironment() && !disableWrite) {
          const diskLocation = filename || `${latestDescriptor.layerId}.png`;
          fs.writeFile(diskLocation, Buffer.from(arrayBuffer));
        }

        return arrayBuffer;
      },
      requestOptions
    });
  }

  async url(
    descriptor: LayerVersionDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    if (typeof Blob === "undefined") {
      throw new FileAPIError();
    }

    const buffer = await this.raw(descriptor, { ...requestOptions });

    return URL.createObjectURL(
      new Blob([new DataView(buffer)], { type: "image/png" })
    );
  }
}
