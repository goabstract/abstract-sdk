// @flow
import type { FileDescriptor, Page, PageDescriptor } from "../types";
import { NotFoundError } from "../errors";
import BaseEndpoint from "./BaseEndpoint";

export default class Pages extends BaseEndpoint {
  info(descriptor: PageDescriptor): Promise<Page> {
    return this.request<Promise<Page>>({
      api: async () => {
        const { pageId, ...fileDescriptor } = descriptor;
        const pages = await this.list(fileDescriptor);
        const page = pages.find(page => page.id === descriptor.pageId);
        if (!page) {
          throw new NotFoundError(`pageId=${descriptor.pageId}`);
        }
        return page;
      },

      cli: async () => {
        const { pageId, ...fileDescriptor } = descriptor;
        const pages = await this.list(fileDescriptor);
        const page = pages.find(page => page.id === descriptor.pageId);
        if (!page) {
          throw new NotFoundError(`pageId=${descriptor.pageId}`);
        }
        return page;
      }
    });
  }

  list(descriptor: FileDescriptor): Promise<Page[]> {
    return this.request<Promise<Page[]>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/branches/${
            descriptor.branchId
          }/files/${descriptor.fileId}/pages`
        );
        return response.pages;
      },

      cli: async () => {
        const file: any = await this.client.files.info(descriptor);
        return file._pages;
      }
    });
  }
}
