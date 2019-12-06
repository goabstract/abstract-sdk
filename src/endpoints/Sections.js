// @flow
import type {
  OrganizationDescriptor,
  RequestOptions,
  Section
} from "@core/types";
import Endpoint from "@core/endpoints/Endpoint";

export default class Sections extends Endpoint {
  list(
    descriptor: OrganizationDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Section[]>>(
      {
        api: async () => {
          const response = await this.apiRequest(
            `sections?organizationId=${descriptor.organizationId}`
          );

          return response;
        }
      },
      requestOptions
    );
  }
}
