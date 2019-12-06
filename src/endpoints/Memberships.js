// @flow
import type {
  Membership,
  OrganizationDescriptor,
  OrganizationMembershipDescriptor,
  ProjectDescriptor,
  ProjectMembershipDescriptor,
  RequestOptions
} from "@core/types";
import Endpoint from "@core/endpoints/Endpoint";

export default class Memberships extends Endpoint {
  info(
    descriptor: OrganizationMembershipDescriptor | ProjectMembershipDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Membership>>(
      {
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
        }
      },
      requestOptions
    );
  }

  list(
    descriptor: OrganizationDescriptor | ProjectDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Membership[]>>(
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
          return response.data;
        }
      },
      requestOptions
    );
  }
}
