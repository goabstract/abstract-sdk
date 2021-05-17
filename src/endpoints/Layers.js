// @flow
import querystring from "query-string";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";
import type {
  FileDescriptor,
  Layer,
  LayerVersionDescriptor,
  ListOptions,
  PageDescriptor,
  RequestOptions
} from "../types";

type LayersListOptions = {
  ...ListOptions,
  fromLibraries?: "include" | "exclude" | "only"
};

export default class Layers extends Endpoint {
  name = "layers";

  async info(
    descriptor: LayerVersionDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<Layer>>("info", {
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

  async list(
    descriptor: FileDescriptor | PageDescriptor,
    options: LayersListOptions = {}
  ) {
    const { limit, offset, fromLibraries, ...requestOptions } = options;
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<Layer[]>>("list", {
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
