// @flow
import querystring from "query-string";
import type {
  BranchDescriptor,
  File,
  FileDescriptor,
  Layer,
  LayerDescriptor,
  ListOptions,
  PageDescriptor
} from "../types";
import BaseEndpoint from "./BaseEndpoint";
import { NotFoundError } from "../errors";

export default class Files extends BaseEndpoint {
  info(descriptor: FileDescriptor): Promise<File> {
    return this.request<Promise<File>>({
      api: async () => {
        const { fileId, ...branchDescriptor } = descriptor;
        const files = await this.list(branchDescriptor);
        const file = files.find(file => file.id === descriptor.fileId);
        if (!file) {
          throw new NotFoundError(`pageId=${descriptor.fileId}`);
        }
        return file;
      },

      cli: async () => {
        const response = await this.cliRequest([
          "file",
          descriptor.projectId,
          descriptor.sha,
          descriptor.fileId
        ]);
        return {
          ...response.file,
          // Cache this for calls to abstract.pages
          _pages: response.pages
        };
      }
    });
  }

  list(descriptor: BranchDescriptor): Promise<File[]> {
    return this.request<Promise<File[]>>({
      api: async () => {
        const response = await this.apiRequest(`projects/${descriptor.projectId}/branches/${descriptor.branchId}/files`);
        return response.files;
      },

      cli: async () => {
        const response = await this.cliRequest([
          "files",
          descriptor.projectId,
          descriptor.sha
        ]);
        return response.files;
      }
    });
  }
}
