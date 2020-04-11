// @flow
import { promises as fs } from "fs";
import querystring from "query-string";
import { isNodeEnvironment, wrap } from "../util/helpers";
import type {
  Asset,
  AssetDescriptor,
  BranchCommitDescriptor,
  FileDescriptor,
  ListOptions,
  RawOptions,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";

/**
 * @class Assets
 * @extends Endpoint
 * @see [AssetDescriptor](#assetDescriptor)
 * @see [Asset](#asset)
 * @see [BranchCommitDescriptor](#branchCommitDescriptor)
 * @see [FileDescriptor](#fileDescriptor)
 * @description
 * An asset represents a resource exported from a design file.
 * Assets are automatically updated and available for new commits.
 * Note: Assets are only supported when using a Business or Enterprise plan.
 * More information on Abstract plan types can be found {@link https://www.abstract.com/pricing/|here}
 * @example
 * // Save all assets for a given file
 *
 * // Get all assets for a given file
 * const assets = await abstract.assets.file({
 *   projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
 *   branchId: "master",
 *   fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
 *   sha: "latest"
 * });
 *
 * // Save the raw file for each asset to the current working directory
 * await Promise.all(assets.map(asset => abstract.assets.raw({
 *   id: asset.id,
 *   projectId: asset.projectId
 * })));
 */
export default class Assets extends Endpoint {
  /**
   * @memberof Assets
   * @param {AssetDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Asset>}
   * @example
   * // Load the info for an asset
   * abstract.assets.info({
   *   assetId: "fcd67bab-e5c3-4679-b879-daa5d5746cc2",
   *   projectId: "b8bf5540-6e1e-11e6-8526-2d315b6ef48f"
   * });
   */
  info(descriptor: AssetDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Asset>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/assets/${descriptor.assetId}`
        );
        return wrap(response);
      },
      requestOptions
    });
  }

  /**
   * @memberof Assets
   * @param {BranchCommitDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Asset[]>}
   * @example
   * // List all assets generated for a commit
   * abstract.assets.commit({
   *   branchId: "8a13eb62-a42f-435f-b3a3-39af939ad31b",
   *   projectId: "b8bf5540-6e1e-11e6-8526-2d315b6ef48f",
   *   sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a", // or sha: "latest"
   * });
   */
  async commit(
    descriptor: BranchCommitDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<Asset[]>>({
      api: async () => {
        const query = querystring.stringify({ sha: latestDescriptor.sha });

        const response = await this.apiRequest(
          `projects/${latestDescriptor.projectId}/assets?${query}`
        );

        return wrap(response.data.assets, response);
      },
      requestOptions
    });
  }

  /**
   * @memberof Assets
   * @param {FileDescriptor} descriptor
   * @param {ListOptions} [options={}]
   * @returns {Promise<Asset[]>}
   * @description
   * <div class="banner banner-warning">
   *   Note: This endpoint returns a special type of Promise called a
   *   CursorPromise that supports cursor-based pagination.
   *   More information can be found here.
   * </div>
   * @example
   * // List the first ten assets for a given file
   * abstract.assets.file({
   *   projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *   branchId: "master",
   *   fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
   *   sha: "latest"
   * }, {
   *   limit: 10
   * });
   */
  file(descriptor: FileDescriptor, options: ListOptions = {}) {
    const { limit, offset, ...requestOptions } = options;

    return this.createCursor<Promise<Asset[]>>(
      (nextOffset = offset) => ({
        api: () => {
          const query = querystring.stringify({
            sha: descriptor.sha,
            limit,
            offset: nextOffset
          });

          return this.apiRequest(
            `projects/${descriptor.projectId}/branches/${descriptor.branchId}/files/${descriptor.fileId}/assets?${query}`
          );
        },
        requestOptions
      }),
      response => wrap(response.data, response)
    );
  }

  /**
   * @memberof Assets
   * @param {AssetDescriptor} descriptor
   * @param {RawOptions} [options={}]
   * @returns {Promise<ArrayBuffer>}
   * @description
   * Retrieve a given asset file based on its ID and save it to disk.
   * <strong>Files will be saved to the current working directory by default</strong>,
   * but a custom <code>filename</code> option can be used to customize this location,
   * or disableWrite can be used to disable automatic saving altogether.
   *
   * The resulting <code>ArrayBuffer</code> can be also be used with node
   * <code>fs</code> APIs directly. For example, it's possible to write
   * the image to disk manually after post-processing it:
   *
   * @example
   * abstract.assets.raw({
   *   assetId: "fcd67bab-e5c3-4679-b879-daa5d5746cc2",
   *   projectId: "b8bf5540-6e1e-11e6-8526-2d315b6ef48f"
   * });
   *
   * @example
   * const arrayBuffer = await abstract.assets.raw({
   *   assetId: "fcd67bab-e5c3-4679-b879-daa5d5746cc2",
   *   projectId: "b8bf5540-6e1e-11e6-8526-2d315b6ef48f"
   * }, {
   *   disableWrite: true
   * });
   *
   * processedBuffer = postProcess(arrayBuffer);
   *
   * fs.writeFile("asset.png", Buffer.from(processedBuffer), (err) => {
   *  if (err) throw err;
   *  console.log("Asset image written!");
   * });
   */
  raw(descriptor: AssetDescriptor, options: RawOptions = {}) {
    const { disableWrite, filename, ...requestOptions } = options;

    return this.configureRequest<Promise<ArrayBuffer>>({
      api: async () => {
        const asset = await this.info(descriptor);
        const assetUrl = await this.options.objectUrl;
        const assetPath = asset.url.replace(
          /^\S+:\/\/objects.goabstract.com\//,
          ""
        );

        const arrayBuffer = await this.apiRequest(
          assetPath,
          {
            headers: {
              Accept: undefined,
              "Content-Type": undefined,
              "Abstract-Api-Version": undefined
            }
          },
          {
            customHostname: assetUrl,
            raw: true
          }
        );

        /* istanbul ignore if */
        if (isNodeEnvironment() && !disableWrite) {
          const diskLocation =
            filename || `${asset.layerName}.${asset.fileFormat}`;
          fs.writeFile(diskLocation, Buffer.from(arrayBuffer));
        }

        return arrayBuffer;
      },
      requestOptions
    });
  }
}
