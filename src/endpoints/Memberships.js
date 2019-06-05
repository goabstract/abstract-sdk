// @flow
import type {
  Membership,
  OrganizationDescriptor,
  OrganizationMembershipDescriptor,
  ProjectDescriptor,
  ProjectMembershipDescriptor
} from "../types";
import Endpoint from "./Endpoint";

export default class Users extends Endpoint {
  info(
    descriptor: OrganizationMembershipDescriptor | ProjectMembershipDescriptor
  ) {
    return this.request<Promise<Membership>>({
      api: async () => {
        let url = "";
        if (descriptor.organizationId) {
          url = `organizations/${descriptor.organizationId}/memberships/${descriptor.userId}`;
        }

        if (descriptor.projectId) {
          url = `projects/${descriptor.projectId}/memberships/${descriptor.userId}`;
        }
        const response = await this.apiRequest(url);
        return response.data.projectMembership || response.data;
      },

      cache: {
        key: `membership:${descriptor.userId}`
      }
    });
  }

  list(descriptor: OrganizationDescriptor | ProjectDescriptor) {
    return this.request<Promise<Membership[]>>({
      api: async () => {
        let url = "";
        if (descriptor.organizationId) {
          url = `organizations/${descriptor.organizationId}/memberships`;
        }

        if (descriptor.projectId) {
          url = `projects/${descriptor.projectId}/memberships`;
        }
        const response = await this.apiRequest(url);
        return response.data;
      }
    });
  }
}
