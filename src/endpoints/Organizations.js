// @flow
import type {
  OrganizationDescriptor,
  Organization,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

export default class Organizations extends Endpoint {
  info(
    descriptor: OrganizationDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Organization>>({
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
    return this.configureRequest<Promise<Organization[]>>({
      api: async () => {
        const response = await this.apiRequest("organizations");
        return wrap(response.data, response);
      },
      requestOptions
    });
  }
}
