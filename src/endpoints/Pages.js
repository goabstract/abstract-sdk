// @flow
import type {
  FileDescriptor,
  Page,
  PageDescriptor,
  RequestOptions
} from "../types";
import { NotFoundError } from "../errors";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

/**
 *
 *
 * @export
 * @class Pages
 * @description
 * A page is a container for layers, often a file will have several pages to organize design work.
 * @extends {Endpoint}
 */
export default class Pages extends Endpoint {
  /**
   *
   * @param {PageDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Page>}
   * @example
   * // Load the info for a page in a file at the latest commit on a branch
   * abstract.pages.info({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
   *  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A"
   * });
   */
  async info(descriptor: PageDescriptor, requestOptions: RequestOptions = {}) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<Page>>({
      api: async () => {
        const { pageId, ...fileDescriptor } = latestDescriptor;
        const pages = await this.list(fileDescriptor);
        const page = pages.find(page => page.id === pageId);
        if (!page) {
          throw new NotFoundError(`pageId=${pageId}`);
        }
        return wrap(page);
      },

      cli: async () => {
        const { pageId, ...fileDescriptor } = latestDescriptor;
        const pages = await this.list(fileDescriptor);
        const page = pages.find(page => page.id === pageId);
        if (!page) {
          throw new NotFoundError(`pageId=${pageId}`);
        }
        return wrap(page);
      },

      requestOptions
    });
  }

  /**
   *
   *
   * @param {FileDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Page[]>}
   * @memberof Pages
   * @example
   * // List the pages for a file at a commit
   * abstract.pages.list({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
   *  sha: "fb7e9b50da6c330fc43ffb369616f0cd1fa92cc2"
   * });
   */
  async list(descriptor: FileDescriptor, requestOptions: RequestOptions = {}) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<Page[]>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${latestDescriptor.projectId}/branches/${latestDescriptor.branchId}/files/${latestDescriptor.fileId}/pages`
        );

        return wrap(response.pages, response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "files",
          latestDescriptor.projectId,
          latestDescriptor.sha
        ]);

        return wrap(response.pages, response);
      },

      requestOptions
    });
  }
}
