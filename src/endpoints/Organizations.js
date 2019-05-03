// @flow
import type { OrganizationDescriptor, Organization } from "../types";
import Endpoint from "./Endpoint";

export default class Organizations extends Endpoint {
  info(descriptor: OrganizationDescriptor) {
    return this.request<Promise<Organization>>({
      api: async () => {
        const response = await this.apiRequest(
          `organizations/${descriptor.organizationId}`
        );
        return response.data;
      },

      cache: {
        key: `organization:${descriptor.organizationId}`
      }
    });
  }

  list() {
    return this.request<Promise<Organization[]>>({
      api: async () => {
        const response = await this.apiRequest("organizations");
        return response.data;
      }
    });
  }
}
