// @flow
import querystring from "query-string";
import type {
  OrganizationDescriptor,
  Project,
  ProjectDescriptor
} from "../types";
import Endpoint from "./Endpoint";

export default class Projects extends Endpoint {
  info(descriptor: ProjectDescriptor) {
    return this.request<Promise<Project>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}`
        );
        return response.data;
      },

      cache: {
        key: `project:${descriptor.projectId}`
      }
    });
  }

  list(
    descriptor: OrganizationDescriptor,
    options: { filter?: "active" | "archived" } = {}
  ) {
    return this.request<Promise<Project[]>>({
      api: async () => {
        const query = querystring.stringify({ ...descriptor, ...options });
        const response = await this.apiRequest(`projects?${query}`);
        return response.data;
      }
    });
  }
}
