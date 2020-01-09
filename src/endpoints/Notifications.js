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

export default class Notifications extends Endpoint {
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
