// @flow
import querystring from "querystring";
import { pick } from "lodash";
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

type MembershipsListOptions = {
  ...RequestOptions,
  limit?: number,
  offset?: number
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
    const { limit, offset, ...restOptions } = requestOptions;
    const options = pick(requestOptions, ["limit", "offset"]);
    const query = querystring.stringify(options);

    return this.configureRequest<Promise<Membership[]>>("list", {
      api: async () => {
        let url = "";

        if (descriptor.organizationId) {
          url = `organizations/${descriptor.organizationId}/memberships?${query}`;
        }

        if (descriptor.projectId) {
          url = `projects/${descriptor.projectId}/memberships?${query}`;
        }

        const response = await this.apiRequest(url, { headers });
        return wrap(response.data, response);
      },
      restOptions
    });
  }
}
