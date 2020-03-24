// @flow
import querystring from "query-string";
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
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

export default class Activities extends Endpoint {
  name = "Activities";

  info(descriptor: ActivityDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Activity>>({
      api: async () => {
        const response = await this.apiRequest(
          "info",
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
      (nextOffset = offset) => ({
        api: () => {
          const query = querystring.stringify({
            ...descriptor,
            limit,
            offset: nextOffset
          });

          return this.apiRequest("list", `activities?${query}`);
        },
        requestOptions
      }),
      response => wrap(response.data.activities, response)
    );
  }
}
