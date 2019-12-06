// @flow
import querystring from "query-string";
import type {
  ListOptions,
  Notification,
  NotificationDescriptor,
  OrganizationDescriptor,
  RequestOptions
} from "@core/types";
import Endpoint from "@core/endpoints/Endpoint";

export default class Notifications extends Endpoint {
  info(
    descriptor: NotificationDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Notification>>(
      {
        api: () => {
          return this.apiRequest(`notifications/${descriptor.notificationId}`);
        }
      },
      requestOptions
    );
  }

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
      response => response.data
    );
  }
}
