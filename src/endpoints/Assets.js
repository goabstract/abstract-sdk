// @flow
import { promises as fs } from "fs";
import querystring from "query-string";
import { isNodeEnvironment, wrap } from "../util/helpers";
import type {
  Asset,
  AssetDescriptor,
  AssetHasChanges,
  BranchCommitDescriptor,
  FileDescriptor,
  ListOptions,
  RawOptions,
  RequestOptions,
  AssetGenerateProgress
} from "../types";
import Endpoint from "../endpoints/Endpoint";

export default class Assets extends Endpoint {
  async info(descriptor: AssetDescriptor, requestOptions: RequestOptions = {}) {
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

  async file(descriptor: FileDescriptor, options: ListOptions = {}) {
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

  async raw(descriptor: AssetDescriptor, options: RawOptions = {}) {
    const { disableWrite, filename, ...requestOptions } = options;
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

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
      cli: async () => {
        const response = await this.cliRequest([
          "assets",
          "download",
          `--urls=${latestDescriptor.url}`,
          `--filenames=${latestDescriptor.filename}`,
          `--output=${latestDescriptor.output}`,
          latestDescriptor.expand ? `--expand` : ``
        ]);

        return wrap(response, response);
      },
      requestOptions
    });
  }

  async hasChanges(descriptor: AssetHasChanges, options: RawOptions = {}) {
    const { disableWrite, filename, ...requestOptions } = options;
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<ArrayBuffer>>({
      cli: async () => {
        const response = await this.cliRequest([
          "assets",
          "has-changes",
          `--project-id=${latestDescriptor.projectId}`,
          `--sha=${latestDescriptor.sha}`
        ]);

        return wrap(response, response);
      },

      requestOptions
    });
  }

  async exportChanged(descriptor: AssetDescriptor, options: ListOptions = {}) {
    const { limit, offset, ...requestOptions } = options;
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.createCursor<Promise<AssetGenerateProgress[]>>(
      (nextOffset = offset) => ({
        cli: async () => {
          const response = await this.cliRequest([
            "assets",
            "export-changed",
            `--project-id=${latestDescriptor.projectId}`,
            `--sha=${latestDescriptor.sha || "latest"}`
          ]);

          return wrap(response, response);
        },
        requestOptions
      }),
      response => wrap(response, response)
    );
  }
}
