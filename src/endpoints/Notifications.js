// @flow
import querystring from "query-string";
import type {
  ListOptions,
  Notification,
  NotificationDescriptor,
  OrganizationDescriptor,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

/**
 *
 * @export
 * @class Notifications
 * @description
 * A notification is a user-facing message triggered by an underlying activity.
 * Notifications are both viewable and dismissable in the desktop application.
 * @extends {Endpoint}
 */
export default class Notifications extends Endpoint {
  /**
   *
   *
   * @param {NotificationDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Notification>}
   * @memberof Notifications
   * @example
   * // Load the info for a notification
   * abstract.notifications.info({
   *  notificationId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
   * });
   */
  info(
    descriptor: NotificationDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Notification>>({
      api: async () => {
        const response = await this.apiRequest(
          `notifications/${descriptor.notificationId}`
        );
        return wrap(response);
      },
      requestOptions
    });
  }

  /**
   *
   *
   * @param {OrganizationDescriptor} descriptor
   * @param {ListOptions} [options={}]
   * @returns {CursorPromise<Notification[]>}
   * @memberof Notifications
   * @description
   * <div class="banner banner-warning">
   *  Note: This endpoint returns a special type of <code>Promise</code> called a
   *  <code>CursorPromise</code> that supports cursor-based pagination.
   *  More information can be found <a href="#pagination">here</a>.
   * </div>
   * @example
   * // List the first two notifications for a given organization
   * abstract.notifications.list({
   *  organizationId: "8a13eb62-a42f-435f-b3a3-39af939ad31b"
   * }, { limit: 2 });
   */
  list(descriptor: OrganizationDescriptor, options: ListOptions = {}) {
    const { limit, offset, ...requestOptions } = options;

    return this.createCursor<Promise<Notification[]>>(
      (nextOffset = offset) => ({
        api: () => {
          const query = querystring.stringify({
            ...descriptor,
            limit,
            offset: nextOffset
          });

          return this.apiRequest(`notifications?${query}`);
        },
        requestOptions
      }),
      response => wrap(response.data, response)
    );
  }
}
