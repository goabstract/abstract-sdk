// @flow
import { promises as fs } from "fs";
import querystring from "query-string";
import Cursor from "../Cursor";
import type {
  Asset,
  AssetDescriptor,
  CommitDescriptor,
  CursorPromise,
  FileDescriptor,
  ListOptions,
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

  async commit(descriptor: CommitDescriptor) {
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

  file(descriptor: FileDescriptor, options: ListOptions = {}) {
    return this.request<CursorPromise<Asset[]>>({
      api: () => {
        return new Cursor<Asset[]>(
          async (meta = { nextOffset: options.offset }) => {
            const query = querystring.stringify({
              ...options,
              sha: descriptor.sha,
              offset: meta.nextOffset
            });
            const response = await this.apiRequest(
              `projects/${descriptor.projectId}/branches/${descriptor.branchId}/files/${descriptor.fileId}/assets?${query}`
            );
            return {
              data: response.data,
              meta: response.meta
            };
          }
        );
      }
    });
  }

  raw(descriptor: AssetDescriptor, options: RawOptions = {}) {
    return this.request<Promise<ArrayBuffer>>({
      api: async () => {
        const asset = await this.info(descriptor);
        const urlRoot = await this.assetUrl;
        const urlPath = asset.url.replace(
          /^https:\/\/objects.goabstract.com/,
          ""
        );
        const arrayBuffer = await this.apiRawRequest(
          `${urlRoot}${urlPath}`,
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
