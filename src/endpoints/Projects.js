// @flow
import querystring from "query-string";
import type {
  OrganizationDescriptor,
  Project,
  ProjectDescriptor
} from "../types";
import Endpoint from "./Endpoint";

const headers = {
  "Abstract-Api-Version": "13"
};

export default class Projects extends Endpoint {
  info(descriptor: ProjectDescriptor) {
    return this.request<Promise<Project>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}`,
          { headers }
        );
        return response.data;
      }
    });
  }

  list(
    descriptor: OrganizationDescriptor,
    options: {
      filter?: "active" | "archived",
      sectionId?: string
    } = {}
  ) {
    return this.request<Promise<Project[]>>({
      api: async () => {
        const query = querystring.stringify({ ...descriptor, ...options });
        const response = await this.apiRequest(`projects?${query}`, {
          headers
        });
        if (options.sectionId) {
          return response.data.projects.filter(
            project => project.sectionId === options.sectionId
          );
        }
        return response.data.projects;
      }
    });
  }
}
