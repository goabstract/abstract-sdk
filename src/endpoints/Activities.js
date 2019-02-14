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
import BaseEndpoint from "./BaseEndpoint";

export default class Activities extends BaseEndpoint {
  info(descriptor: ActivityDescriptor): Promise<Activity> {
    return this.request<Promise<Activity>>({
      api: async () => {
        const response = await this.apiRequest(
          `activities/${descriptor.activityId}`
        );
        return response;
      }
    });
  }

  list(
    descriptor: BranchDescriptor | OrganizationDescriptor | ProjectDescriptor,
    options: ListOptions = {}
  ): CursorPromise<Activity[]> {
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
