// @flow
import type {
  CommitDescriptor,
  File,
  FileDescriptor,
  RawOptions
} from "../types";
import { NotFoundError } from "../errors";
import { isNodeEnvironment } from "../utils";
import Endpoint from "./Endpoint";

export default class Files extends Endpoint {
  async info(descriptor: FileDescriptor) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );
    return this.request<Promise<File>>({
      api: async () => {
        const { fileId, ...branchDescriptor } = latestDescriptor;
        const files = await this.list(branchDescriptor);
        const file = files.find(file => file.id === latestDescriptor.fileId);
        if (!file) {
          throw new NotFoundError(`pageId=${latestDescriptor.fileId}`);
        }
        return file;
      },

      cli: async () => {
        const response = await this.cliRequest([
          "file",
          latestDescriptor.projectId,
          latestDescriptor.sha,
          latestDescriptor.fileId
        ]);
        return response.file;
      },

      cache: {
        key: `file:${descriptor.fileId}`,
        disable: descriptor.sha === "latest"
      }
    });
  }

  async list(descriptor: CommitDescriptor) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );
    return this.request<Promise<File[]>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${latestDescriptor.projectId}/branches/${latestDescriptor.branchId}/files`
        );
        return response.files;
      },

      cli: async () => {
        const response = await this.cliRequest([
          "files",
          latestDescriptor.projectId,
          latestDescriptor.sha
        ]);
        return response.files;
      }
    });
  }

  async raw(descriptor: FileDescriptor, options: RawOptions = {}) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );
    return this.request<Promise<void>>({
      cli: async () => {
        /* istanbul ignore if */
        if (!isNodeEnvironment() || options.disableWrite) {
          return;
        }
        this.cliRequest([
          "file",
          "export",
          latestDescriptor.fileId,
          options.filename || process.cwd(),
          `--project-id=${latestDescriptor.projectId}`,
          `--branch-id=${latestDescriptor.branchId}`,
          `--sha=${latestDescriptor.sha}`
        ]);
      }
    });
  }
}
