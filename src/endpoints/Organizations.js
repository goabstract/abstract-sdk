// @flow
import type { OrganizationDescriptor, Organization } from "../types";
import Endpoint from "./Endpoint";

export default class Organizations extends Endpoint {
  info(descriptor: OrganizationDescriptor): Promise<Organization> {
    return this.request<Promise<Organization>>({
      api: async () => {
        const response = await this.apiRequest(
          `organizations/${descriptor.organizationId}`
        );
        return response.data;
      }
    });
  }

  list(): Promise<Organization[]> {
    return this.request<Promise<Organization[]>>({
      api: async () => {
        const response = await this.apiRequest("organizations");
        return response.data;
      }
    });
  }
}
