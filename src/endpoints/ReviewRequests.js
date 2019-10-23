// @flow
import type { ReviewRequest, ReviewRequestDescriptor } from "../types";
import Endpoint from "./Endpoints"

export default class ReviewRequests extends Endpoint {
  info(descriptor: ReviewRequestDescriptor) {
    return this.request<Promise<ReviewRequest>>({
      api: () => {
        return this.apiRequest(
          `/organizations/${descriptor.id}/review_requests`
        );
      },

      cli: () => {
        return this.cliRequest([
          "reviews",
          "load",
          descriptor.projectId,
          descriptor.branchId
        ]);
      }
    });
  });

  // list() { }
}
