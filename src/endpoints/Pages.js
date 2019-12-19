// @flow
import type {
  FileDescriptor,
  Page,
  PageDescriptor,
  RequestOptions
} from "../types";
import { NotFoundError } from "../errors";
import Endpoint from "../endpoints/Endpoint";

export default class Pages extends Endpoint {
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
        return page;
      },

      cli: async () => {
        const { pageId, ...fileDescriptor } = latestDescriptor;
        const pages = await this.list(fileDescriptor);
        const page = pages.find(page => page.id === pageId);
        if (!page) {
          throw new NotFoundError(`pageId=${pageId}`);
        }
        return page;
      },

      requestOptions
    });
  }

  async list(descriptor: FileDescriptor, requestOptions: RequestOptions = {}) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<Page[]>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${latestDescriptor.projectId}/branches/${latestDescriptor.branchId}/files/${latestDescriptor.fileId}/pages`
        );

        return response.pages;
      },

      cli: async () => {
        const response = await this.cliRequest([
          "files",
          latestDescriptor.projectId,
          latestDescriptor.sha
        ]);

        return response.pages;
      },

      requestOptions
    });
  }
}
