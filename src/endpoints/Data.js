// @flow
import type { LayerDataset, LayerDescriptor } from "../types";
import Endpoint from "./Endpoint";

export default class Data extends Endpoint {
  async info(descriptor: LayerDescriptor) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );
    return this.request<Promise<LayerDataset>>({
      api: () => {
        return this.apiRequest(
          `projects/${latestDescriptor.projectId}/branches/${latestDescriptor.branchId}/commits/${latestDescriptor.sha}/files/${latestDescriptor.fileId}/layers/${latestDescriptor.layerId}/data`
        );
      },

      cli: () => {
        return this.cliRequest([
          "layer",
          "data",
          latestDescriptor.projectId,
          latestDescriptor.sha,
          latestDescriptor.fileId,
          latestDescriptor.layerId
        ]);
      },

      cache: {
        key: `layer-data:${descriptor.layerId}`,
        disable: descriptor.sha === "latest"
      }
    });
  }
}
