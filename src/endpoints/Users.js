// @flow
import type {
  OrganizationDescriptor,
  ProjectDescriptor,
  RequestOptions,
  User,
  UserDescriptor
} from "../types";
import Endpoint from "../endpoints/Endpoint";

export default class Users extends Endpoint {
  info(descriptor: UserDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<User>>(
      {
        api: () => {
          return this.apiRequest(`users/${descriptor.userId}`);
        }
      },
      requestOptions
    );
  }

  list(
    descriptor: OrganizationDescriptor | ProjectDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<User[]>>(
      {
        api: async () => {
          let url = "";

          if (descriptor.organizationId) {
            url = `organizations/${descriptor.organizationId}/memberships`;
          }

          if (descriptor.projectId) {
            url = `projects/${descriptor.projectId}/memberships`;
          }

          const response = await this.apiRequest(url);
          return response.data.map(membership => membership.user);
        }
      },
      requestOptions
    );
  }
}
