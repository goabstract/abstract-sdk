// @flow
import type { ReviewRequest, OrganizationDescriptor } from "../types";
import Endpoint from "./Endpoint";

const headers = {
  "Abstract-Api-Version": "13"
};

export default class ReviewRequests extends Endpoint {
  list(descriptor: OrganizationDescriptor) {
    return this.request<Promise<ReviewRequest[]>>({
      api: async () => {
        const response = await this.apiRequest(
          `organizations/${descriptor.organizationId}/review_requests`,
          { headers }
        );
        return response.data;
      }
    });
  }
}
