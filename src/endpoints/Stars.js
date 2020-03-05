// @flow
import type {
  ProjectDescriptor,
  RequestOptions,
  SectionDescriptor,
  Star
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

/**
 *
 * Stars desc
 * @export
 * @class Stars
 * @extends {Endpoint}
 */
export default class Stars extends Endpoint {
  list(requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Star[]>>({
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
    return this.configureRequest<Promise<Star>>({
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
    return this.configureRequest<Promise<void>>({
      api: () => {
        return this.apiRequest(`starred/${starrableId}`, { method: "DELETE" });
      },
      requestOptions
    });
  }
}
