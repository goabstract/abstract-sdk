// @flow
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";
import type {
  Dataset,
  LayerVersionDescriptor,
  FileDescriptor,
  RequestOptions
} from "../types";

export default class Data extends Endpoint {
  name = "data";

  async info(
    descriptor: LayerVersionDescriptor | FileDescriptor,
    requestOptions: RequestOptions = {}
  ): Promise<Dataset> {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest("info", {
      api: async () => {
        if (latestDescriptor.layerId) {
          const response = await this.apiRequest(
            `projects/${latestDescriptor.projectId}/branches/${latestDescriptor.branchId}/commits/${latestDescriptor.sha}/files/${latestDescriptor.fileId}/layers/${latestDescriptor.layerId}/data`
          );

          return wrap(response);
        } else {
          const { layerId, ...fileDescriptor } = latestDescriptor;
          const layers = await this.client.layers.list(fileDescriptor);
          const layerDatasets = await Promise.all(
            layers.map(layer =>
              this.client.data.info({
                projectId: layer.projectId,
                fileId: layer.fileId,
                layerId: layer.id,
                sha: layer.sha,
                branchId: latestDescriptor.branchId
              })
            )
          );

          const layerStyles = [];
          const textStyles = [];

          layerDatasets.forEach(layerDataset => {
            if (!layerDataset.layers) return;
            const rootLayer = layerDataset.layers[layerDataset.layerId];

            if (rootLayer.properties.textStyleIndex) {
              textStyles.push(...rootLayer.properties.textStyleIndex);
            }
          });

          return {
            ...fileDescriptor,
            layerStyles,
            textStyles
          };
        }
      },

      cli: async () => {
        if (latestDescriptor.layerId) {
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
        } else {
          const { layerId, ...fileDescriptor } = latestDescriptor;
          throw Error("Not support yet");
        }
      },

      requestOptions
    });
  }
}
