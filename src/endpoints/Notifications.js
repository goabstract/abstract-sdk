// @flow
import querystring from "query-string";
import Cursor from "../Cursor";
import type {
  CursorPromise,
  ListOptions,
  Notification,
  NotificationDescriptor,
  OrganizationDescriptor
} from "../types";
import Endpoint from "./Endpoint";

export default class Notifications extends Endpoint {
  info(descriptor: NotificationDescriptor) {
    return this.request<Promise<Notification>>({
      api: () => {
        return this.apiRequest(`notifications/${descriptor.notificationId}`);
      },

      cache: {
        key: `notification:${descriptor.notificationId}`
      }
    });
  }

  list(descriptor: OrganizationDescriptor, options: ListOptions = {}) {
    return this.request<CursorPromise<Notification[]>>({
      api: () => {
        return new Cursor<Notification[]>(
          async (meta = { nextOffset: options.offset }) => {
            const query = querystring.stringify({
              ...descriptor,
              ...options,
              offset: meta.nextOffset
            });
            return this.apiRequest(`notifications?${query}`);
          }
        );
      }
    });
  }
}
