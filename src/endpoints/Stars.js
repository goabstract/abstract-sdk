// @flow
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";
import type {
  ProjectDescriptor,
  RequestOptions,
  SectionDescriptor,
  Star
} from "../types";

export default class Stars extends Endpoint {
  name = "stars";

  list(requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Star[]>>("list", {
      api: async () => {
        const response = await this.apiRequest("starred");
        return wrap(response);
      },
      requestOptions
    });
  }

  create(
    descriptor: ProjectDescriptor | SectionDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    const starrableId =
      descriptor.sectionId === undefined
        ? descriptor.projectId
        : descriptor.sectionId;
    return this.configureRequest<Promise<Star>>("create", {
      api: async () => {
        const response = await this.apiRequest(`starred/${starrableId}`, {
          method: "PUT"
        });
        return wrap(response);
      },
      requestOptions
    });
  }

  delete(
    descriptor: ProjectDescriptor | SectionDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    const starrableId =
      descriptor.sectionId === undefined
        ? descriptor.projectId
        : descriptor.sectionId;
    return this.configureRequest<Promise<void>>("delete", {
      api: () => {
        return this.apiRequest(`starred/${starrableId}`, { method: "DELETE" });
      },
      requestOptions
    });
  }
}
