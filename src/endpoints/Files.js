// @flow
import type { CommitDescriptor, File, FileDescriptor } from "../types";
import { NotFoundError } from "../errors";
import Endpoint from "./Endpoint";

export default class Files extends Endpoint {
  async info(descriptor: FileDescriptor): Promise<File> {
    descriptor = await this.client.descriptors.getLatestDescriptor(descriptor);
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
        return response.file;
      }
    });
  }

  async list(descriptor: CommitDescriptor): Promise<File[]> {
    descriptor = await this.client.descriptors.getLatestDescriptor(descriptor);
    return this.request<Promise<File[]>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/branches/${
            descriptor.branchId
          }/files`
        );
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
