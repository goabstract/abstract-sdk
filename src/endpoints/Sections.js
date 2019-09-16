// @flow
import type { OrganizationDescriptor, Section } from "../types";
import Endpoint from "./Endpoint";

export default class Sections extends Endpoint {
  list(descriptor: OrganizationDescriptor) {
    return this.request<Promise<Section[]>>({
      api: async () => {
        const response = await this.apiRequest(
          `sections?organizationId=${descriptor.organizationId}`
        );
        return response;
      }
    });
  }
}
