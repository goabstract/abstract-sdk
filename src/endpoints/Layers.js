// @flow
import querystring from "query-string";
import type {
  FileDescriptor,
  Layer,
  LayerDescriptor,
  ListOptions,
  PageDescriptor
} from "../types";
import Endpoint from "./Endpoint";

export default class Layers extends Endpoint {
  async info(descriptor: LayerDescriptor) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );
    return this.request<Promise<Layer>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${latestDescriptor.projectId}/branches/${latestDescriptor.branchId}/commits/${latestDescriptor.sha}/files/${latestDescriptor.fileId}/layers/${latestDescriptor.layerId}`
        );
        return {
          ...response.layer,
          _file: response.file,
          _page: response.page
        };
      },

      cli: async () => {
        const response = await this.cliRequest([
          "layer",
          "meta",
          latestDescriptor.projectId,
          latestDescriptor.sha,
          latestDescriptor.fileId,
          latestDescriptor.layerId
        ]);
        return response.layer;
      },

      cache: {
        key: `layer:${descriptor.layerId}`,
        disable: descriptor.sha === "latest"
      }
    });
  }

  async list(
    descriptor: FileDescriptor | PageDescriptor,
    options: ListOptions = {}
  ) {
    descriptor = await this.client.descriptors.getLatestDescriptor(descriptor);
    return this.request<Promise<Layer[]>>({
      api: async () => {
        const query = querystring.stringify({ ...options, ...descriptor });
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/branches/${descriptor.branchId}/files/${descriptor.fileId}/layers?${query}`
        );
        return response.layers;
      },

      cli: async () => {
        const response = await this.cliRequest([
          "layers",
          descriptor.projectId,
          descriptor.sha,
          descriptor.fileId
        ]);
        return response.layers;
      }
    });
  }
}
