/* @flow */
/* global Blob */
import { promises as fs } from "fs";
import { FileAPIError } from "../errors";
import type {
  LayerVersionDescriptor,
  PreviewMeta,
  RawOptions,
  RequestOptions
} from "../types";
import { isNodeEnvironment } from "../util/helpers";
import Endpoint from "../endpoints/Endpoint";

/**
 *
 *
 * @export
 * @class Previews
 * @extends {Endpoint}
 * @description
 * A preview is an image file that represents the rendered version of a layer.
 * In Abstract all previews are currently only available in PNG format.
 */
export default class Previews extends Endpoint {
  /**
   *
   *
   * @param {LayerVersionDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Preview>}
   * @memberof Previews
   * @description
   * Retrieve a preview
   * @example
   * abstract.previews.info({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
   *  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
   *  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a" // or sha: "latest"
   * });
   */
  async info(
    descriptor: LayerVersionDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<PreviewMeta>>({
      api: async () => ({
        webUrl: `${await this.options.webUrl}/projects/${
          latestDescriptor.projectId
        }/commits/${latestDescriptor.sha}/files/${
          latestDescriptor.fileId
        }/layers/${latestDescriptor.layerId}`
      }),
      requestOptions
    });
  }

  /**
   *
   *
   * @param {LayerVersionDescriptor} descriptor
   * @param {RawOptions} [options={}]
   * @returns {Promise<ArrayBuffer>}
   * @memberof Previews
   * @description
   * - Retrieve a preview image for a layer at a specific commit and save it to disk.
   * Files will be saved to the current working directory by default,
   * but a custom <code>filename</code> option can be used to customize this location. (1)
   * - The resulting <code>ArrayBuffer</code> can be also be used with node <code>fs</code> APIs directly.
   * For example, it's possible to write the file to disk manually after post-processing it.
   *
   * @example
   * const arrayBuffer = await abstract.previews.raw({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
   *  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
   *  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a" // or sha: "latest"
   * });
   *
   * @example
   * const arrayBuffer = await abstract.previews.raw({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
   *  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
   *  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
   *  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a" // or sha: "latest"
   * }, {
   *  disableWrite: true
   * });
   *
   * processedBuffer = postProcess(arrayBuffer);
   *
   * fs.writeFile(`preview.png`, Buffer.from(processedBuffer), (err) => {
   *  if (err) throw err;
   *  console.log("Preview image written!");
   * });
   *
   */
  async raw(descriptor: LayerVersionDescriptor, options: RawOptions = {}) {
    const { disableWrite, filename, ...requestOptions } = options;
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<ArrayBuffer>>({
      api: async () => {
        const previewUrl = await this.options.previewUrl;
        const arrayBuffer = await this.apiRequest(
          `projects/${latestDescriptor.projectId}/commits/${latestDescriptor.sha}/files/${latestDescriptor.fileId}/layers/${latestDescriptor.layerId}`,
          {
            headers: {
              Accept: undefined,
              "Content-Type": undefined,
              "Abstract-Api-Version": undefined
            }
          },
          {
            customHostname: previewUrl,
            raw: true
          }
        );

        /* istanbul ignore if */
        if (isNodeEnvironment() && !disableWrite) {
          const diskLocation = filename || `${latestDescriptor.layerId}.png`;
          fs.writeFile(diskLocation, Buffer.from(arrayBuffer));
        }

        return arrayBuffer;
      },
      requestOptions
    });
  }

  /**
   *
   *
   * @param {LayerVersionDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<string>}
   * @memberof Previews
   * @description
   * <div class="banner banner-warning">
   *  Note: The <code>previews.url</code> method requires an environment with
   * <a href="#">URL.createObjectURL</a>.
   * If you are using node, you will need to save the image to a file with
   * <a href="#">previews.raw</a>
   * </div>
   * <div class="banner banner-warning">
   *  Get an image as a <em>temporary</em> blob url which can be displayed directly
   * in an image tag or downloaded. The url exists only as long as the current
   * browser session and should not be saved to a database directly.
   * </div>
   * @example
   * abstract.previews.url({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
   *  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
   *  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a" // or sha: "latest"
   * });
   */
  async url(
    descriptor: LayerVersionDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    if (typeof Blob === "undefined") {
      throw new FileAPIError();
    }

    const buffer = await this.raw(descriptor, { ...requestOptions });

    return URL.createObjectURL(
      new Blob([new DataView(buffer)], { type: "image/png" })
    );
  }
}
