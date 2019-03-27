// @flow
import type { FileDescriptor, Page, PageDescriptor } from "../types";
import { NotFoundError } from "../errors";
import Endpoint from "./Endpoint";

export default class Pages extends Endpoint {
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
      }
    });
  }
}
