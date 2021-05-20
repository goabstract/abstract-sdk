// @flow
import querystring from "querystring";
import { pick } from "lodash";
import type {
  Membership,
  OrganizationDescriptor,
  OrganizationMembershipDescriptor,
  ProjectDescriptor,
  ProjectMembershipDescriptor,
  RequestOptions,
  OrganizationRole,
  SubscriptionRole,
  ProjectRoleFilter
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

type MembershipsListOptions = {
  ...RequestOptions,
  limit?: number,
  offset?: number,
  organizationRole?: OrganizationRole,
  subscriptionRole?: SubscriptionRole,
  projectRole?: ProjectRoleFilter,
  query?: string
};

const headers = {
  "Abstract-Api-Version": "20"
};

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
    requestOptions: MembershipsListOptions = {}
  ) {
    const {
      limit,
      offset,
      organizationRole,
      projectRole,
      subscriptionRole,
      query,
      ...restOptions
    } = requestOptions;
    const options = pick(requestOptions, ["limit", "offset"]);

    return this.configureRequest<Promise<Membership[]>>("list", {
      api: async () => {
        let url = "";

        if (descriptor.organizationId) {
          if (organizationRole) {
            options.role = organizationRole;
          }
          if (subscriptionRole) {
            options.subscription_role = subscriptionRole;
          }
          if (query) {
            options.search = query;
          }
          url = `organizations/${
            descriptor.organizationId
          }/memberships?${querystring.stringify(options)}`;
          console.log(url);
        }

        if (descriptor.projectId) {
          if (projectRole) {
            options.role = projectRole;
          }
          if (query) {
            options.search = query;
          }
          url = `projects/${
            descriptor.projectId
          }/memberships?${querystring.stringify(options)}`;
        }

        const response = await this.apiRequest(url, { headers });
        return wrap(response.data, response);
      },
      restOptions
    });
  }
}
