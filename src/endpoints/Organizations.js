// @flow
import type {
  OrganizationDescriptor,
  Organization,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

export default class Organizations extends Endpoint {
  name = "organizations";

  info(
    descriptor: OrganizationDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Organization>>("info", {
      api: async () => {
        const response = await this.apiRequest(
          `organizations/${descriptor.organizationId}`
        );

        return wrap(response.data, response);
      },
      requestOptions
    });
  }

  list(requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Organization[]>>("list", {
      api: async () => {
        const response = await this.apiRequest("organizations");
        return wrap(response.data, response);
      },
      requestOptions
    });
  }
}
