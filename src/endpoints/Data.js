// @flow
import type {
  LayerDataset,
  LayerVersionDescriptor,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

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
          "layers",
          "inspect",
          latestDescriptor.layerId,
          `--project-id=${latestDescriptor.projectId}`,
          `--branch-id=${latestDescriptor.branchId}`,
          `--sha=${latestDescriptor.sha}`,
          `--file-id=${latestDescriptor.fileId}`
        ]);
        return wrap(response);
      },

      requestOptions
    });
  }
}
