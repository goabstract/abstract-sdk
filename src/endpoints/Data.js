// @flow
import type {
  LayerDataset,
  LayerVersionDescriptor,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

/**
 *
 * @export
 * @class Data
 * @extends {Endpoint}
 */
export default class Data extends Endpoint {
  /**
   *
   *
   * @param {LayerVersionDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<LayerDataset>}
   * @example
   * abstract.data.info({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
   *  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
   *  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a" // or sha: "latest"
   * });
   * @memberof Data
   */
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
