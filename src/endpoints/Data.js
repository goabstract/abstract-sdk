// @flow
import type { LayerData, LayerDescriptor } from "../types";
import Endpoint from "./Endpoint";

export default class Data extends Endpoint {
  async info(descriptor: LayerDescriptor): Promise<LayerData> {
    descriptor = await this.client.descriptors.getLatestDescriptor(descriptor);
    return this.request<Promise<LayerData>>({
      api: () => {
        return this.apiRequest(
          `projects/${descriptor.projectId}/branches/${
            descriptor.branchId
          }/commits/${descriptor.sha}/files/${descriptor.fileId}/layers/${
            descriptor.layerId
          }/data`
        );
      },

      cli: () => {
        return this.cliRequest([
          "layer",
          "data",
          descriptor.projectId,
          descriptor.sha,
          descriptor.fileId,
          descriptor.layerId
        ]);
      }
    });
  }
}
