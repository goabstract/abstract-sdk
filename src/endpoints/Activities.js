// @flow
import querystring from "query-string";
import Cursor from "../Cursor";
import type {
  Activity,
  ActivityDescriptor,
  BranchDescriptor,
  ListOptions,
  OrganizationDescriptor,
  ProjectDescriptor
} from "../types";
import BaseEndpoint from "./BaseEndpoint";

export default class Activities extends BaseEndpoint {
  info(descriptor: ActivityDescriptor): Promise<Activity> {
    return this.request<Activity>({
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
  ): Promise<Activity[]> {
    return this.request<Activity[]>({
      api: () => {
        return new Cursor<Activity[]>(
          async (meta = { nextOffset: options.offset }) => {
            const query = querystring.stringify({ ...descriptor, ...options });
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
