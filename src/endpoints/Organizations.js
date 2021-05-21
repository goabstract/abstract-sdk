// @flow
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";
import type {
  OrganizationDescriptor,
  Organization,
  RequestOptions
} from "../types";

// Version 27 does not return features for organizations
const headers = {
  "Abstract-Api-Version": "27"
};

export default class Organizations extends Endpoint {
  name = "organizations";

  info(
    descriptor: OrganizationDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Organization>>("info", {
      api: async () => {
        const response = await this.apiRequest(
          `organizations/${descriptor.organizationId}`,
          {
            headers
          }
        );

        return wrap(response.data, response);
      },
      requestOptions
    });
  }

  list(requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Organization[]>>("list", {
      api: async () => {
        const response = await this.apiRequest("organizations", {
          headers
        });
        return wrap(response.data, response);
      },
      requestOptions
    });
  }
}
