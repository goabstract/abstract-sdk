// @flow
import type {
  OrganizationDescriptor,
  ProjectDescriptor,
  User,
  UserDescriptor
} from "../types";
import Endpoint from "./Endpoint";

export default class Users extends Endpoint {
  info(descriptor: UserDescriptor): Promise<User> {
    return this.request<Promise<User>>({
      api: async () => {
        return this.apiRequest(`users/${descriptor.userId}`);
      },

      cache: {
        key: `user:${descriptor.userId}`
      }
    });
  }

  list(
    descriptor: OrganizationDescriptor | ProjectDescriptor
  ): Promise<User[]> {
    return this.request<Promise<User[]>>({
      api: async () => {
        let url = "";
        if (descriptor.organizationId) {
          url = `organizations/${descriptor.organizationId}/memberships`;
        } else if (descriptor.projectId) {
          url = `projects/${descriptor.projectId}/memberships`;
        }
        const response = await this.apiRequest(url);
        return response.data.map(membership => membership.user);
      }
    });
  }
}
