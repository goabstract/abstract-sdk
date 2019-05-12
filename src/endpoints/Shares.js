// @flow
import { inferShareId } from "../utils";
import type {
  OrganizationDescriptor,
  Share,
  ShareDescriptor,
  ShareInput
} from "../types";
import Endpoint from "./Endpoint";

const headers = {
  "Abstract-Api-Version": "13"
};

export default class Activities extends Endpoint {
  create<T: Share>(descriptor: OrganizationDescriptor, shareInput: ShareInput) {
    return this.request<Promise<T>>({
      api: async () => {
        return this.apiRequest("share_links", {
          method: "POST",
          body: {
            ...descriptor,
            ...shareInput,
            commitSha: (shareInput: any).sha
          },
          headers
        });
      }
    });
  }

  info<T: Share>(descriptor: ShareDescriptor) {
    return this.request<Promise<T>>({
      api: () => {
        return this.apiRequest(`share_links/${inferShareId(descriptor)}`, {
          headers
        });
      },

      cache: {
        key: `share:${inferShareId(descriptor)}`
      }
    });
  }
}
