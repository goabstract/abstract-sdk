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
      }
    });
  }

  async list(descriptor: CommitDescriptor): Promise<Asset[]> {
    descriptor = await this.client.commits.getLatestDescriptor(descriptor);
    return this.request<Promise<Asset[]>>({
      api: async () => {
        const query = querystring.stringify({ sha: descriptor.sha });
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/assets?${query}`
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
      }
    });
  }
}
