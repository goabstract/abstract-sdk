// @flow
import type {
  OrganizationDescriptor,
  Organization,
  RequestOptions
} from "@core/types";
import Endpoint from "@core/endpoints/Endpoint";

export default class Organizations extends Endpoint {
  info(
    descriptor: OrganizationDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Organization>>(
      {
        api: async () => {
          const response = await this.apiRequest(
            `organizations/${descriptor.organizationId}`
          );

          return response.data;
        }
      },
      requestOptions
    );
  }

  list(requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Organization[]>>(
      {
        api: async () => {
          const response = await this.apiRequest("organizations");
          return response.data;
        }
      },
      requestOptions
    );
  }
}
