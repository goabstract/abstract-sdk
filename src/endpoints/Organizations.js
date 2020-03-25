// @flow
import type {
  OrganizationDescriptor,
  Organization,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

/**
 *
 * @class Organizations
 * @see [Organization](#organization)
 * @see [OrganizationDescriptor](#organizationDescriptor)
 * @description
 * Organizations contain users and projects.
 * @extends {Endpoint}
 */
export default class Organizations extends Endpoint {
  /**
   *
   *
   * @param {OrganizationDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Organization>}
   * @description
   * // Load the info for an organization
   * abstract.organizations.info({
   *  organizationId: "8a13eb62-a42f-435f-b3a3-39af939ad31b"
   * });
   * @memberof Organizations
   */
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

  /**
   *
   *
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Organization[]>}
   * @memberof Organizations
   * @example
   * // Load the organizations accessible by the current access token
   * abstract.organizations.list();
   */
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
