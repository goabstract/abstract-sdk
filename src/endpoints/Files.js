// @flow
import { promises as fs } from "fs";
import type {
  BranchCommitDescriptor,
  File,
  FileDescriptor,
  RawOptions,
  RequestOptions
} from "../types";
import { FileExportError, NotFoundError } from "../errors";
import { isNodeEnvironment, wrap } from "../util/helpers";
import Endpoint from "../endpoints/Endpoint";

const EXPORT_TIMEOUT = 2000;
const MAX_EXPORT_DURATION = EXPORT_TIMEOUT * 15;

export default class Files extends Endpoint {
  async info(descriptor: FileDescriptor, requestOptions: RequestOptions = {}) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<File>>({
      api: async () => {
        const { fileId, ...branchDescriptor } = latestDescriptor;
        const files = await this.list(branchDescriptor);
        const file = files.find(file => file.id === latestDescriptor.fileId);
        if (!file) {
          throw new NotFoundError(`fileId=${latestDescriptor.fileId}`);
        }
        return wrap(file);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "file",
          latestDescriptor.projectId,
          latestDescriptor.sha,
          latestDescriptor.fileId
        ]);

        return wrap(response.file, response);
      },

      requestOptions
    });
  }

  async list(
    descriptor: BranchCommitDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<File[]>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${latestDescriptor.projectId}/branches/${latestDescriptor.branchId}/files`
        );

        return wrap(response.files, response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "files",
          latestDescriptor.projectId,
          latestDescriptor.sha
        ]);

        return wrap(response.files, response);
      },

      requestOptions
    });
  }

  async raw(descriptor: FileDescriptor, options: RawOptions = {}) {
    const { disableWrite, filename, ...requestOptions } = options;
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<ArrayBuffer | void>>({
      api: async () => {
        const exportRequest = (exportId?: string) => {
          return this.apiRequest(
            `projects/${latestDescriptor.projectId}/branches/${latestDescriptor.branchId}/files/${latestDescriptor.fileId}/export`,
            {
              method: "POST",
              body: { ...latestDescriptor, export_id: exportId }
            }
          );
        };

        const file = await this.info(latestDescriptor);
        let exportJob = await exportRequest();

        const checkStatus = async (count: number) => {
          exportJob = await exportRequest(exportJob.id);

          if (exportJob.status === "complete") {
            const fileUrl = await this.options.objectUrl;
            const filePath = exportJob.downloadUrl.replace(
              /^\S+:\/\/objects.goabstract.com\//,
              ""
            );

            const arrayBuffer = await this.apiRequest(
              filePath,
              {
                headers: {
                  Accept: undefined,
                  "Content-Type": undefined,
                  "Abstract-Api-Version": undefined
                }
              },
              {
                customHostname: fileUrl,
                raw: true
              }
            );

            /* istanbul ignore if */
            if (isNodeEnvironment() && !disableWrite) {
              const diskLocation = filename || `${file.name}.sketch`;
              fs.writeFile(diskLocation, Buffer.from(arrayBuffer));
            }

            return arrayBuffer;
          } else if (
            count * EXPORT_TIMEOUT >= MAX_EXPORT_DURATION ||
            exportJob.status === "failed"
          ) {
            throw new FileExportError(file.id, exportJob.id);
          } else {
            await new Promise(resolve => setTimeout(resolve, EXPORT_TIMEOUT));
            return checkStatus(count + 1);
          }
        };

        return checkStatus(0);
      },

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
      },
      requestOptions
    });
  }
}
