// @flow
import querystring from "query-string";
import type {
  FileDescriptor,
  Layer,
  LayerDescriptor,
  ListOptions,
  PageDescriptor
} from "../types";
import BaseEndpoint from "./BaseEndpoint";

export default class Layers extends BaseEndpoint {
  info(descriptor: LayerDescriptor): Promise<Layer> {
    return this.request<Promise<Layer>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/branches/${
            descriptor.branchId
          }/commits/${descriptor.sha}/files/${descriptor.fileId}/layers/${
            descriptor.layerId
          }`
        );
        return {
          ...response.layer,
          _file: response.file,
          _page: response.page
        };
      },

      cli: async () => {
        const response = await this.cliRequest([
          "layer",
          "meta",
          descriptor.projectId,
          descriptor.sha,
          descriptor.fileId,
          descriptor.layerId
        ]);
        return response.layer;
      }
    });
  }

  list(
    descriptor: FileDescriptor | PageDescriptor,
    options: ListOptions = {}
  ): Promise<Layer[]> {
    return this.request<Promise<Layer[]>>({
      api: async () => {
        const query = querystring.stringify({ ...options, ...descriptor });
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/branches/${
            descriptor.branchId
          }/files/${descriptor.fileId}/layers?${query}`
        );
        return response.layers;
      },

      cli: async () => {
        const response = await this.cliRequest([
          "layers",
          descriptor.projectId,
          descriptor.sha,
          descriptor.fileId
        ]);
        return response.layers;
      }
    });
  }
}
