// @flow
import querystring from "query-string";
import type { Asset, AssetDescriptor, CommitDescriptor } from "../types";
import Endpoint from "./Endpoint";

export default class Assets extends Endpoint {
  info(descriptor: AssetDescriptor): Promise<Asset> {
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

  async list(descriptor: CommitDescriptor): Promise<Asset[]> {
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

  raw(descriptor: AssetDescriptor) {
    return this.request<Promise<ArrayBuffer>>({
      api: async () => {
        const asset = await this.info(descriptor);
        return this.apiRawRequest(
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
      },

      cache: {
        key: `asset-raw:${descriptor.assetId}`
      }
    });
  }
}
