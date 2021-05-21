// @flow
import { NotFoundError } from "../errors";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";
import type {
  FileDescriptor,
  Page,
  PageDescriptor,
  RequestOptions
} from "../types";

export default class Pages extends Endpoint {
  name = "pages";

  async info(descriptor: PageDescriptor, requestOptions: RequestOptions = {}) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<Page>>("info", {
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

  async list(descriptor: FileDescriptor, requestOptions: RequestOptions = {}) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<Page[]>>("list", {
      api: async () => {
        const response = await this.apiRequest(
          `projects/${latestDescriptor.projectId}/branches/${latestDescriptor.branchId}/files/${latestDescriptor.fileId}/pages`
        );

        return wrap(response.pages, response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "files",
          "list",
          `--project-id=${latestDescriptor.projectId}`,
          `--sha=${latestDescriptor.sha}`
        ]);

        return wrap(response.pages, response);
      },

      requestOptions
    });
  }
}
