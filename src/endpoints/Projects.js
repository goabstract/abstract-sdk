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

export default class Projects extends Endpoint {
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
