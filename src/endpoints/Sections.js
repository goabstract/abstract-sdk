// @flow
import type { OrganizationDescriptor, RequestOptions, Section } from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

export default class Sections extends Endpoint {
  name = "sections";

  list(
    descriptor: OrganizationDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Section[]>>("list", {
      api: async () => {
        const response = await this.apiRequest(
          `sections?organizationId=${descriptor.organizationId}`
        );

        return wrap(response);
      },
      requestOptions
    });
  }
}
