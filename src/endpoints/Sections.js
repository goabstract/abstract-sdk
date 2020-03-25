// @flow
import type { OrganizationDescriptor, RequestOptions, Section } from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

/**
 *
 *
 * @export
 * @class Sections
 * @extends {Endpoint}
 * @see [Section](#section)
 * @see [OrganizationDescriptor](#organizationDescriptor)
 * @description
 * A section is a group of projects that belong to a given organization.
 * Sections are used to group similar or related projects together and
 * can be created using the desktop application.
 */
export default class Sections extends Endpoint {
  /**
   *
   *
   * @param {OrganizationDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Section[]>}
   * @memberof Sections
   * @example
   * // List all sections accessible through the current authentication
   * abstract.sections.list({ organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9" });
   */
  list(
    descriptor: OrganizationDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Section[]>>({
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
