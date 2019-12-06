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
} from "@core/types";
import Endpoint from "@core/endpoints/Endpoint";

export default class Activities extends Endpoint {
  info(descriptor: ActivityDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Activity>>(
      {
        api: () => {
          return this.apiRequest(`activities/${descriptor.activityId}`);
        }
      },
      requestOptions
    );
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

          return this.apiRequest(`activities?${query}`);
        },
        requestOptions
      }),
      response => response.data.activities
    );
  }
}
