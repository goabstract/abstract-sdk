// @flow
import querystring from "query-string";
import Cursor from "../Cursor";
import type {
  Activity,
  ActivityDescriptor,
  BranchDescriptor,
  CursorPromise,
  ListOptions,
  OrganizationDescriptor,
  ProjectDescriptor
} from "../types";
import Endpoint from "./Endpoint";

export default class Activities extends Endpoint {
  info(descriptor: ActivityDescriptor) {
    return this.request<Promise<Activity>>({
      api: () => {
        return this.apiRequest(`activities/${descriptor.activityId}`);
      },

      cache: {
        key: `activity:${descriptor.activityId}`
      }
    });
  }

  list(
    descriptor: BranchDescriptor | OrganizationDescriptor | ProjectDescriptor,
    options: ListOptions = {}
  ) {
    return this.request<CursorPromise<Activity[]>>({
      api: () => {
        return new Cursor<Activity[]>(
          async (meta = { nextOffset: options.offset }) => {
            const query = querystring.stringify({
              ...descriptor,
              ...options,
              offset: meta.nextOffset
            });
            const response = await this.apiRequest(`activities?${query}`);
            return {
              data: response.data.activities,
              meta: response.meta
            };
          }
        );
      }
    });
  }
}
