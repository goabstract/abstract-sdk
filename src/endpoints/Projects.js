// @flow
import querystring from "query-string";
import type {
  OrganizationDescriptor,
  Project,
  ProjectDescriptor,
  RequestOptions
} from "@core/types";
import Endpoint from "@core/endpoints/Endpoint";

const headers = {
  "Abstract-Api-Version": "13"
};

export default class Projects extends Endpoint {
  info(descriptor: ProjectDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Project>>(
      {
        api: async () => {
          const response = await this.apiRequest(
            `projects/${descriptor.projectId}`,
            { headers }
          );

          return response.data;
        }
      },
      requestOptions
    );
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

    return this.configureRequest<Promise<Project[]>>(
      {
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

          return response.data.projects;
        }
      },
      requestOptions
    );
  }
}
