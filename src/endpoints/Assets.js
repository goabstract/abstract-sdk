// @flow
import { promises as fs } from "fs";
import querystring from "query-string";
import type {
  Asset,
  AssetDescriptor,
  CommitDescriptor,
  RawOptions
} from "../types";
import { isNodeEnvironment } from "../utils";
import Endpoint from "./Endpoint";

export default class Assets extends Endpoint {
  info(descriptor: AssetDescriptor) {
    return this.request<Promise<Asset>>({
      api: async () => {
        return this.apiRequest(
          `projects/${descriptor.projectId}/assets/${descriptor.assetId}`
        );
      },

      cache: {
        key: `asset:${descriptor.assetId}`
      }
    });
  }

  async list(descriptor: CommitDescriptor) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );
    return this.request<Promise<Asset[]>>({
      api: async () => {
        const query = querystring.stringify({ sha: latestDescriptor.sha });
        const response = await this.apiRequest(
          `projects/${latestDescriptor.projectId}/assets?${query}`
        );
        return response.data.assets;
      }
    });
  }

  raw(descriptor: AssetDescriptor, options: RawOptions = {}) {
    return this.request<Promise<ArrayBuffer>>({
      api: async () => {
        const asset = await this.info(descriptor);
        const arrayBuffer = await this.apiRawRequest(
          asset.url,
          {
            headers: {
              Accept: undefined,
              "Content-Type": undefined,
              "Abstract-Api-Version": undefined
            }
          },
          null
        );

        /* istanbul ignore if */
        if (isNodeEnvironment() && !options.disableWrite) {
          const filename =
            options.filename || `${asset.layerName}.${asset.fileFormat}`;
          fs.writeFile(filename, Buffer.from(arrayBuffer));
        }

        return arrayBuffer;
      },

      cache: {
        key: `asset-raw:${descriptor.assetId}`
      }
    });
  }
}
