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
 *
 * @export
 * @class Stars
 * @extends {Endpoint}
 * @description
 * A star represents an underlying project or section of projects,
 * and it indicates that a user has favorites
 * the underlying object for easier discovery.
 */
export default class Stars extends Endpoint {
  /**
   *
   *
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Star[]>}
   * @memberof Stars
   * @description
   * List all starred projects or sections
   * @example
   * abstract.stars.list();
   */
  list(requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Star[]>>({
      api: async () => {
        const response = await this.apiRequest("starred");
        return wrap(response);
      },
      requestOptions
    });
  }

  /**
   *
   *
   * @param {(ProjectDescriptor | SectionDescriptor)} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Star>}
   * @memberof Stars
   * @description
   * Star a project
   * @example
   * abstract.stars.create({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
   * });
   */
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

  /**
   *
   *
   * @param {(ProjectDescriptor | SectionDescriptor)} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<void>}
   * @memberof Stars
   * @description
   * Un-star a project
   * @example
   * abstract.stars.delete({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
   * });
   */
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
