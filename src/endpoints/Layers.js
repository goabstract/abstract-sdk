// @flow
import querystring from "query-string";
import type {
  FileDescriptor,
  Layer,
  LayerVersionDescriptor,
  ListOptions,
  PageDescriptor,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";

export default class Layers extends Endpoint {
  async info(
    descriptor: LayerVersionDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<Layer>>({
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

      requestOptions
    });
  }

  async list(
    descriptor: FileDescriptor | PageDescriptor,
    options: ListOptions = {}
  ) {
    const { limit, offset, ...requestOptions } = options;
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<Layer[]>>({
      api: async () => {
        const query = querystring.stringify({
          ...latestDescriptor,
          limit,
          offset
        });

        const response = await this.apiRequest(
          `projects/${latestDescriptor.projectId}/branches/${latestDescriptor.branchId}/files/${latestDescriptor.fileId}/layers?${query}`
        );

        return response.layers;
      },

      cli: async () => {
        const response = await this.cliRequest([
          "layers",
          latestDescriptor.projectId,
          latestDescriptor.sha,
          latestDescriptor.fileId
        ]);

        return response.layers;
      },

      requestOptions
    });
  }
}
