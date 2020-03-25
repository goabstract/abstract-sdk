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

/**
 *
 * @export
 * @class Layers
 * @extends {Endpoint}
 * @see [Layer](#layer)
 * @see [LayerVersionDescriptor](#layerVersionDescriptor)
 * @see [LayersListOptions](#layersListOptions)
 * @see [FileDescriptor](#fileDescriptor)
 * @see [PageDescriptor](#pageDescriptor)
 * @description
 * A layer is a container for designs.
 * In Sketch a layer usually represents an artboard however
 * it can also be a non-contained layer floating on the page.
 */
export default class Layers extends Endpoint {
  /**
   *
   *
   * @param {LayerVersionDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Layer>}
   * @memberof Layers
   * @description Retrieve a layer
   * @example
   * // Load the info for a layer in a file at the latest commit on a branch
   * abstract.layers.info({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
   *  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
   *  sha: "latest"
   * });
   */
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
          "layers",
          "info",
          latestDescriptor.layerId,
          `--project-id=${latestDescriptor.projectId}`,
          `--sha=${latestDescriptor.sha}`,
          `--file-id=${latestDescriptor.fileId}`
        ]);

        return wrap(response.layer, response);
      },

      requestOptions
    });
  }

  /**
   *
   * @param {FileDescriptor | PageDescriptor} descriptor
   * @param {LayersListOptions} [options={}]
   * @memberof Layers
   * @returns {Promise<Layer[]>}
   * @description
   * - As a file can contain a lot of layers we recommend filtering by page and adding a limit…
   * - A file can also contain layers from external libraries.
   * If you'd like to only see the layers in this file and not the external
   * library elements they depend upon, use the <code>fromLibraries</code> option…
   * @example
   * // List the layers for a file at a commit
   * abstract.layers.list({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
   *  sha: "fb7e9b50da6c330fc43ffb369616f0cd1fa92cc2"
   * });
   *
   * @example
   * // As a file can contain a lot of layers
   * // we recommend filtering by page and adding a limit…
   * abstract.layers.list({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
   *  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
   *  sha: "fb7e9b50da6c330fc43ffb369616f0cd1fa92cc2"
   * }, {
   *  limit: 25,
   *  offset: 0
   * });
   *
   * @example
   * abstract.layers.list({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
   *  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
   *  sha: "fb7e9b50da6c330fc43ffb369616f0cd1fa92cc2"
   * }, {
   *  limit: 25,
   *  offset: 0,
   *  fromLibraries: "exclude"
   * });
   *
   */
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
        const args = [
          "layers",
          "list",
          `--project-id=${latestDescriptor.projectId}`,
          `--sha=${latestDescriptor.sha}`,
          `--file-id=${latestDescriptor.fileId}`
        ];

        if (limit) {
          args.push(`--limit=${limit}`);
        }

        if (offset) {
          args.push(`--offset=${offset}`);
        }

        if (latestDescriptor.pageId) {
          args.push(`--page-id=${latestDescriptor.pageId}`);
        }

        if (fromLibraries) {
          args.push(`--from-libraries=${fromLibraries}`);
        }

        const response = await this.cliRequest(args);
        return wrap(response.layers, response);
      },

      requestOptions
    });
  }
}
