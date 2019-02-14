// @flow
import querystring from "query-string";
import type {
  OrganizationDescriptor,
  Project,
  ProjectDescriptor
} from "../types";
import BaseEndpoint from "./BaseEndpoint";

export default class Projects extends BaseEndpoint {
  info(descriptor: ProjectDescriptor): Promise<Project> {
    return this.request<Promise<Project>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}`
        );
        return response.data;
      }
    });
  }

  list(
    descriptor: OrganizationDescriptor,
    options: { filter?: "active" | "archived" } = {}
  ): Promise<Project[]> {
    return this.request<Promise<Project[]>>({
      api: async () => {
        const query = querystring.stringify({ ...descriptor, ...options });
        const response = await this.apiRequest(`projects?${query}`);
        return response.data;
      }
    });
  }
}
