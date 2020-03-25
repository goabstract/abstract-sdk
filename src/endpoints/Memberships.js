// @flow
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

/**
 *
 * Memberships Desc
 * @class Memberships
 * @see [Membership](#membership)
 * @see [OrganizationMembershipDescriptor](#organizationMembershipDescriptor)
 * @see [ProjectMembershipDescriptor](#projectMembershipDescriptor)
 * @see [OrganizationDescriptor](#organizationDescriptor)
 * @see [ProjectDescriptor](#projectDescriptor)
 * @description
 * A membership contains information about a user's role within an organization
 * or a project. A membership is created when a user joins an organization or is
 * given access to a project.
 * @extends {Endpoint}
 */
export default class Memberships extends Endpoint {
  /**
   *
   *
   * @param {(OrganizationMembershipDescriptor | ProjectMembershipDescriptor)} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Membership>}
   * @memberof Memberships
   * @example
   * // Load the info for a specific member
   * abstract.memberships.info({
   *  userId: "48b5d670-2002-45ea-929d-4b00863778e4",
   *  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
   * });
   */
  info(
    descriptor: OrganizationMembershipDescriptor | ProjectMembershipDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Membership>>({
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

  /**
   *
   *
   * @param {(OrganizationDescriptor | ProjectDescriptor)} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Membership[]>}
   * @memberof Memberships
   * @example
   * // List the members of an organization
   * abstract.memberships.list({
   *  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
   * });
   */
  list(
    descriptor: OrganizationDescriptor | ProjectDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Membership[]>>({
      api: async () => {
        let url = "";

        if (descriptor.organizationId) {
          url = `organizations/${descriptor.organizationId}/memberships`;
        }

        if (descriptor.projectId) {
          url = `projects/${descriptor.projectId}/memberships`;
        }

        const response = await this.apiRequest(url);
        return wrap(response.data, response);
      },
      requestOptions
    });
  }
}
