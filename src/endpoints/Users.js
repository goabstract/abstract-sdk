// @flow
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";
import type {
  OrganizationDescriptor,
  ProjectDescriptor,
  RequestOptions,
  User,
  UserDescriptor
} from "../types";

export default class Users extends Endpoint {
  name = "users";

  info(descriptor: UserDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<User>>("info", {
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
    return this.configureRequest<Promise<User[]>>("list", {
      api: async () => {
        let url = "";

        if (descriptor.organizationId) {
          url = `organizations/${descriptor.organizationId}/memberships`;
        }

        if (descriptor.projectId) {
          url = `projects/${descriptor.projectId}/memberships`;
        }

        const response = await this.apiRequest(url);
        return wrap(
          response.data.map(membership => membership.user),
          response
        );
      },
      requestOptions
    });
  }
}
