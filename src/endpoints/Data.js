// @flow
import type {
  LayerDataset,
  LayerVersionDescriptor,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../response";

export default class Data extends Endpoint {
  async info(
    descriptor: LayerVersionDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<LayerDataset>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${latestDescriptor.projectId}/branches/${latestDescriptor.branchId}/commits/${latestDescriptor.sha}/files/${latestDescriptor.fileId}/layers/${latestDescriptor.layerId}/data`
        );
        return wrap(response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "layer",
          "data",
          latestDescriptor.projectId,
          latestDescriptor.sha,
          latestDescriptor.fileId,
          latestDescriptor.layerId
        ]);
        return wrap(response);
      },

      requestOptions
    });
  }
}
