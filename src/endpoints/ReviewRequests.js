// @flow
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";
import type {
  BranchDescriptor,
  OrganizationDescriptor,
  ProjectDescriptor,
  RequestOptions,
  ReviewRequest
} from "../types";

export default class ReviewRequests extends Endpoint {
  name = "reviewRequests";

  list(
    descriptor: OrganizationDescriptor | ProjectDescriptor | BranchDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<ReviewRequest[]>>("list", {
      api: async () => {
        let url = "";

        if (descriptor.organizationId) {
          url = `organizations/${descriptor.organizationId}/review_requests`;
        }

        if (descriptor.branchId) {
          url = `projects/${descriptor.projectId}/branches/${descriptor.branchId}/review_requests`;
        }

        if (!descriptor.branchId && descriptor.projectId) {
          url = `projects/${descriptor.projectId}/review_requests`;
        }

        const response = await this.apiRequest(url);
        return wrap(response.data.reviewRequests, response);
      },
      requestOptions
    });
  }
}
