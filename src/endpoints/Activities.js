// @flow
import querystring from "query-string";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";
import type {
  Activity,
  ActivityDescriptor,
  BranchDescriptor,
  CursorPromise,
  ListOptions,
  OrganizationDescriptor,
  ProjectDescriptor,
  RequestOptions
} from "../types";

export default class Activities extends Endpoint {
  name = "activities";
  info(descriptor: ActivityDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Activity>>("info", {
      api: async () => {
        const response = await this.apiRequest(
          `activities/${descriptor.activityId}`
        );
        return wrap(response);
      },
      requestOptions
    });
  }

  list(
    descriptor: BranchDescriptor | OrganizationDescriptor | ProjectDescriptor,
    options: ListOptions = {}
  ) {
    const { limit, offset, ...requestOptions } = options;

    return this.createCursor<CursorPromise<Activity[]>>(
      "list",
      (nextOffset = offset) => ({
        api: () => {
          const query = querystring.stringify({
            ...descriptor,
            limit,
            offset: nextOffset
          });

          return this.apiRequest(`activities?${query}`);
        },
        requestOptions
      }),
      response => wrap(response.data.activities, response)
    );
  }
}
