// @flow
import type {
  OrganizationDescriptor,
  ProjectDescriptor,
  RequestOptions,
  User,
  UserDescriptor
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

/**
 *
 *
 * @export
 * @see [User](#user)
 * @see [UserDescriptor](#userDescriptor)
 * @see [OrganizationDescriptor](#organizationDescriptor)
 * @see [ProjectDescriptor](#projectDescriptor)
 * @class Users
 * @extends {Endpoint}
 * @description
 * A user contains information specific to an individual account.
 * Users are global to Abstract and are not specific to organizations.
 * A user is created in the application by creating a new account.
 */
export default class Users extends Endpoint {
  /**
   *
   *
   * @param {UserDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<User>}
   * @memberof Users
   * @description
   * Retrieve a user
   * @example
   * // Load the info for a specific user
   * abstract.users.info({
   *  userId: "48b5d670-2002-45ea-929d-4b00863778e4"
   * });
   */
  info(descriptor: UserDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<User>>({
      api: async () => {
        const response = await this.apiRequest(`users/${descriptor.userId}`);
        return wrap(response);
      },
      requestOptions
    });
  }

  /**
   *
   *
   * @param {(OrganizationDescriptor | ProjectDescriptor)} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {User[]}
   * @description List all Users
   * @memberof Users
   * @example
   * // List the users in an organization
   * abstract.users.list({
   *  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
   * });
   */
  list(
    descriptor: OrganizationDescriptor | ProjectDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<User[]>>({
      api: async () => {
        let url = "";

        if (descriptor.organizationId) {
          url = `organizations/${descriptor.organizationId}/memberships`;
        }

        if (descriptor.projectId) {
          url = `projects/${descriptor.projectId}/memberships`;
        }

        const response = await this.apiRequest(url);
        return wrap(response.data.map(membership => membership.user), response);
      },
      requestOptions
    });
  }
}
