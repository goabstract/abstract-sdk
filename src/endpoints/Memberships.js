// @flow
import type {
  Membership,
  OrganizationDescriptor,
  OrganizationMembershipDescriptor,
  ProjectDescriptor,
  ProjectMembershipDescriptor,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

export default class Memberships extends Endpoint {
  name = "memberships";

  info(
    descriptor: OrganizationMembershipDescriptor | ProjectMembershipDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Membership>>("info", {
      api: async () => {
        let url = "";

        if (descriptor.organizationId) {
          url = `organizations/${descriptor.organizationId}/memberships/${descriptor.userId}`;
        }

        if (descriptor.projectId) {
          url = `projects/${descriptor.projectId}/memberships/${descriptor.userId}`;
        }

        const response = await this.apiRequest(url);
        return wrap(response.data.projectMembership || response.data, response);
      },
      requestOptions
    });
  }

  list(
    descriptor: OrganizationDescriptor | ProjectDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Membership[]>>("list", {
      api: async () => {
        let url = "";

        if (descriptor.organizationId) {
          url = `organizations/${descriptor.organizationId}/memberships`;
        }

        if (descriptor.projectId) {
          url = `projects/${descriptor.projectId}/memberships`;
        }

        const response = await this.apiRequest(url);
        return wrap(response.data, response);
      },
      requestOptions
    });
  }
}
