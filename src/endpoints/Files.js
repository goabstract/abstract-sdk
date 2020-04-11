// @flow
import { promises as fs } from "fs";
import type {
  BranchCommitDescriptor,
  File,
  FileDescriptor,
  RawProgressOptions,
  RequestOptions
} from "../types";
import { FileExportError, NotFoundError } from "../errors";
import { isNodeEnvironment, wrap } from "../util/helpers";
import Endpoint from "../endpoints/Endpoint";

const EXPORT_STATUS_CHECK_INTERVAL = 2000;
const MAX_EXPORT_DURATION = EXPORT_STATUS_CHECK_INTERVAL * 15;

/**
 *
 *
 * @export
 * @class Files
 * @see [File](#file)
 * @see [FileDescriptor](#fileDescriptor)
 * @see [BranchCommitDescriptor](#branchCommitDescriptor)
 * @see [RawProgressOptions](#rawProgressOptions)
 * @extends {Endpoint}
 * @description
 * A file represents a standard file – in Abstract a file is always
 * loaded from a specific commit `SHA`, or point in time.
 */
export default class Files extends Endpoint {
  /**
   *
   *
   * @param {FileDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<File>}
   * @memberof Files
   * @example
   * // Load the file info for the latest commit on a branch
   * abstract.files.info({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7"
   *  sha: "latest"
   * });
   */
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
          "files",
          "meta",
          latestDescriptor.fileId,
          `--project-id=${latestDescriptor.projectId}`,
          `--sha=${latestDescriptor.sha}`
        ]);

        return wrap(response.file, response);
      },

      requestOptions
    });
  }

  /**
   *
   *
   * @param {BranchCommitDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<File[]>}
   * @memberof Files
   * @example
   * // List the files for a branch at the latest commit
   * abstract.files.list({
   *   projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *   branchId: "master",
   *   sha: "latest"
   * });
   */
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
          "list",
          `--project-id=${latestDescriptor.projectId}`,
          `--sha=${latestDescriptor.sha}`
        ]);

        return wrap(response.files, response);
      },

      requestOptions
    });
  }

  /**
   *
   *
   * @param {FileDescriptor} descriptor
   * @param {RawProgressOptions} [options={}]
   * @returns {Promise<ArrayBuffer | void>}
   * @memberof Files
   * @description
   * Retrieve a Sketch file from Abstract based on its file ID and save it to disk.
   * Files will be saved to the current working directory by default, but a custom
   * filename option can be used to customize this location. (1)
   * The resulting ArrayBuffer can be also be used with node fs APIs directly.
   * For example, it's possible to write the file to disk
   * manually after post-processing it (2)
   * It's also possible to get insight into
   * the underlying progress of the file export. (3)
   * @example
   * // 1
   * abstract.files.raw({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7"
   *  sha: "latest"
   * });
   * @example
   * // 2
   * const arrayBuffer = await abstract.files.raw({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7"
   *  sha: "latest"
   * }, {
   *  disableWrite: true
   * });
   *
   * processedBuffer = postProcess(arrayBuffer);
   *
   * fs.writeFile("file.sketch", Buffer.from(processedBuffer), (err) => {
   *  if (err) throw err;
   *  console.log("File written!");
   * });
   *
   * @example
   * // 3
   * abstract.files.raw({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7"
   *  sha: "latest"
   * }, {
   *  onProgress: (receivedBytes: number, totalBytes: number) => {
   *    console.log(`${receivedBytes * 100 / totalBytes}% complete`);
   *  }
   * });
   */
  async raw(descriptor: FileDescriptor, options: RawProgressOptions = {}) {
    const { disableWrite, filename, onProgress, ...requestOptions } = options;
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
                  "Content-Type": undefined
                }
              },
              {
                customHostname: fileUrl,
                raw: true,
                onProgress
              }
            );

            /* istanbul ignore if */
            if (isNodeEnvironment() && !disableWrite) {
              const diskLocation = filename || `${file.name}.sketch`;
              fs.writeFile(diskLocation, Buffer.from(arrayBuffer));
            }

            return arrayBuffer;
          } else if (
            count * EXPORT_STATUS_CHECK_INTERVAL >= MAX_EXPORT_DURATION ||
            exportJob.status === "failed"
          ) {
            throw new FileExportError(file.id, exportJob.id);
          } else {
            await new Promise(resolve =>
              setTimeout(resolve, EXPORT_STATUS_CHECK_INTERVAL)
            );
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
          "files",
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
