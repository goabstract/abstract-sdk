// @flow
import type {
  BranchCommitDescriptor,
  File,
  FileDescriptor,
  RawOptions,
  RequestOptions
} from "../types";
import { NotFoundError } from "../errors";
import { isNodeEnvironment } from "../util/helpers";
import Endpoint from "../endpoints/Endpoint";

export default class Files extends Endpoint {
  async info(descriptor: FileDescriptor, requestOptions: RequestOptions = {}) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<File>>(
      {
        api: async () => {
          const { fileId, ...branchDescriptor } = latestDescriptor;
          const files = await this.list(branchDescriptor);
          const file = files.find(file => file.id === latestDescriptor.fileId);
          if (!file) {
            throw new NotFoundError(`fileId=${latestDescriptor.fileId}`);
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
        }
      },
      requestOptions
    );
  }

  async list(
    descriptor: BranchCommitDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<File[]>>(
      {
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
      },
      requestOptions
    );
  }

  async raw(descriptor: FileDescriptor, options: RawOptions = {}) {
    const { disableWrite, filename, ...requestOptions } = options;
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<void>>(
      {
        cli: async () => {
          /* istanbul ignore if */
          if (!isNodeEnvironment() || disableWrite) {
            return;
          }

          await this.cliRequest([
            "file",
            "export",
            latestDescriptor.fileId,
            filename || process.cwd(),
            `--project-id=${latestDescriptor.projectId}`,
            `--branch-id=${latestDescriptor.branchId}`,
            `--sha=${latestDescriptor.sha}`
          ]);
        }
      },
      requestOptions
    );
  }
}
