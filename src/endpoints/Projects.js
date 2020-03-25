// @flow
import querystring from "query-string";
import type {
  NewProject,
  OrganizationDescriptor,
  Project,
  ProjectDescriptor,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

const headers = {
  "Abstract-Api-Version": "22"
};

/**
 *
 * @export
 * @class Projects
 * @see [Project](#project)
 * @see [ProjectDescriptor](#projectDescriptor)
 * @see [OrganizationDescriptor](#organizationDescriptor)
 * @extends {Endpoint}
 * @description
 * A project is a container for files, it belongs to an organization.
 * Teams use projects to logically separate their files for example for
 * a project, a platform (e.g. Web / iOS), or by client.
 */
export default class Projects extends Endpoint {
  /**
   *
   *
   * @param {ProjectDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Project>}
   * @memberof Projects
   * @example
   * // Load the info for a project
   * abstract.projects.info({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
   * });
   */
  info(descriptor: ProjectDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Project>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}`,
          { headers }
        );

        return wrap(response.data, response);
      },
      requestOptions
    });
  }

  /**
   *
   *
   * @param {OrganizationDescriptor} descriptor
   * @param {object} options
   * @param {("api" | "cli")} options.transportMode
   * @param {("active" | "archived")} options.filter
   * @param {string} options.sectionId
   * @memberof Projects
   * @returns {Promise<Project[]>}
   * @description List all projects
   * @example
   * // List all projects accessible through the current authentication
   * abstract.projects.list();
   *
   * @example
   * // or, get a list of projects for a specific organization…
   * abstract.projects.list({
   *  organizationId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
   * });
   *
   * @example
   * // or, get a list of active projects for a specific organization…
   * abstract.projects.list({
   *  organizationId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
   * }, { filter: "active" });
   *
   * @example
   * // or, get a list of active projects for a specific section within an organization…
   * abstract.projects.list({
   *  organizationId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  sectionId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
   * }, { filter: "active" });
   */
  list(
    descriptor: OrganizationDescriptor,
    options: {
      ...RequestOptions,
      filter?: "active" | "archived",
      sectionId?: string
    } = {}
  ) {
    const { filter, sectionId, ...requestOptions } = options;

    return this.configureRequest<Promise<Project[]>>({
      api: async () => {
        const query = querystring.stringify({
          ...descriptor,
          filter,
          sectionId
        });
        const response = await this.apiRequest(`projects?${query}`, {
          headers
        });

        if (sectionId) {
          return response.data.projects.filter(
            project => project.sectionId === sectionId
          );
        }

        return wrap(response.data.projects, response);
      },
      requestOptions
    });
  }

  create(
    descriptor: OrganizationDescriptor,
    project: NewProject,
    requestOptions: RequestOptions = {}
  ) {
    project.about = (project: any).description;

    return this.configureRequest<Promise<Project>>({
      api: async () => {
        const response = await this.apiRequest(`projects`, {
          method: "POST",
          body: project
        });
        return wrap(response);
      },
      requestOptions
    });
  }

  update(
    descriptor: ProjectDescriptor,
    project: Project,
    requestOptions: RequestOptions = {}
  ) {
    project.about = (project: any).description;

    return this.configureRequest<Promise<Project>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}`,
          {
            method: "PUT",
            body: project
          }
        );
        return wrap(response);
      },
      requestOptions
    });
  }

  delete(descriptor: ProjectDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<void>>({
      api: () => {
        return this.apiRequest(`projects/${descriptor.projectId}`, {
          method: "DELETE"
        });
      },
      requestOptions
    });
  }

  archive(descriptor: ProjectDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Project>>({
      api: () => {
        return this.apiRequest(`projects/${descriptor.projectId}/archive`, {
          method: "PUT"
        });
      },
      requestOptions
    });
  }

  unarchive(
    descriptor: ProjectDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Project>>({
      api: () => {
        return this.apiRequest(`projects/${descriptor.projectId}/unarchive`, {
          method: "PUT"
        });
      },
      requestOptions
    });
  }
}
