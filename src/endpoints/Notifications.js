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
import BaseEndpoint from "./BaseEndpoint";

export default class Notifications extends BaseEndpoint {
  info(descriptor: NotificationDescriptor): Promise<Notification> {
    return this.request<Promise<Notification>>({
      api: () => {
        return this.apiRequest(`notifications/${descriptor.notificationId}`);
      }
    });
  }

  list(
    descriptor: OrganizationDescriptor,
    options: ListOptions = {}
  ): CursorPromise<Notification[]> {
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
