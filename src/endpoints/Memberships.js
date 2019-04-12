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
  ): Promise<Membership> {
    return this.request<Promise<Membership>>({
      api: async () => {
        let url = "";
        if (descriptor.organizationId) {
          url = `organizations/${descriptor.organizationId}/memberships/${
            descriptor.userId
          }`;
        } else if (descriptor.projectId) {
          url = `projects/${descriptor.projectId}/memberships/${
            descriptor.userId
          }`;
        }
        const response = await this.apiRequest(url);
        return response.data.projectMembership || response.data;
      }
    });
  }

  list(
    descriptor: OrganizationDescriptor | ProjectDescriptor
  ): Promise<Membership[]> {
    return this.request<Promise<Membership[]>>({
      api: async () => {
        let url = "";
        if (descriptor.organizationId) {
          url = `organizations/${descriptor.organizationId}/memberships`;
        } else if (descriptor.projectId) {
          url = `projects/${descriptor.projectId}/memberships`;
        }
        const response = await this.apiRequest(url);
        return response.data;
      }
    });
  }
}
