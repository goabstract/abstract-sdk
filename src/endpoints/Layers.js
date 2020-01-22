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
import { wrap } from "../util/helpers";

type LayersListOptions = {
  ...ListOptions,
  fromLibraries?: "include" | "exclude" | "only"
};

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

        return wrap(response.layer, response);
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

        return wrap(response.layer, response);
      },

      requestOptions
    });
  }

  async list(
    descriptor: FileDescriptor | PageDescriptor,
    options: LayersListOptions = {}
  ) {
    const { limit, offset, fromLibraries, ...requestOptions } = options;
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<Layer[]>>({
      api: async () => {
        const query = querystring.stringify({
          ...latestDescriptor,
          limit,
          offset,
          fromLibraries
        });

        const response = await this.apiRequest(
          `projects/${latestDescriptor.projectId}/branches/${latestDescriptor.branchId}/files/${latestDescriptor.fileId}/layers?${query}`
        );

        return wrap(response.layers, response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "layers",
          latestDescriptor.projectId,
          latestDescriptor.sha,
          latestDescriptor.fileId
        ]);

        return wrap(response.layers, response);
      },

      requestOptions
    });
  }
}
