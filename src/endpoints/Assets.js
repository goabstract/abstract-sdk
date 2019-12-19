// @flow
import { promises as fs } from "fs";
import querystring from "query-string";
import { isNodeEnvironment } from "../util/helpers";
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

export default class Assets extends Endpoint {
  info(descriptor: AssetDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Asset>>({
      api: () => {
        return this.apiRequest(
          `projects/${descriptor.projectId}/assets/${descriptor.assetId}`
        );
      },
      requestOptions
    });
  }

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

        return response.data.assets;
      },
      requestOptions
    });
  }

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
      response => response.data
    );
  }

  raw(descriptor: AssetDescriptor, options: RawOptions = {}) {
    const { disableWrite, filename, ...requestOptions } = options;

    return this.configureRequest<Promise<ArrayBuffer>>({
      api: async () => {
        const asset = await this.info(descriptor);
        const assetUrl = await this.options.assetUrl;
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
