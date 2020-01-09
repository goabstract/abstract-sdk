// @flow
import type {
  OrganizationDescriptor,
  ProjectDescriptor,
  RequestOptions,
  User,
  UserDescriptor
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

export default class Users extends Endpoint {
  info(descriptor: UserDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<User>>({
      api: async () => {
        const response = await this.apiRequest(`users/${descriptor.userId}`);
        return wrap(response);
      },
      requestOptions
    });
  }

  list(
    descriptor: OrganizationDescriptor | ProjectDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<User[]>>({
      api: async () => {
        let url = "";

        if (descriptor.organizationId) {
          url = `organizations/${descriptor.organizationId}/memberships`;
        }

        if (descriptor.projectId) {
          url = `projects/${descriptor.projectId}/memberships`;
        }

        const response = await this.apiRequest(url);
        return wrap(response.data.map(membership => membership.user), response);
      },
      requestOptions
    });
  }
}
