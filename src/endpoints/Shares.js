// @flow
import { inferShareId, wrap } from "../util/helpers";
import type {
  OrganizationDescriptor,
  RequestOptions,
  Share,
  ShareDescriptor,
  ShareInput
} from "../types";
import Endpoint from "../endpoints/Endpoint";

const headers = {
  "Abstract-Api-Version": "13"
};

export default class Shares extends Endpoint {
  name = "shares";

  create<T: Share>(
    descriptor: OrganizationDescriptor,
    shareInput: ShareInput,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<T>>("create", {
      api: async () => {
        const response = await this.apiRequest("share_links", {
          method: "POST",
          body: {
            ...descriptor,
            ...shareInput,
            commitSha: (shareInput: any).sha
          },
          headers
        });
        return wrap(response);
      },
      requestOptions
    });
  }

  info<T: Share>(
    descriptor: ShareDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<T>>("info", {
      api: async () => {
        const response = await this.apiRequest(
          `share_links/${inferShareId(descriptor)}`,
          {
            headers
          }
        );
        return wrap(response);
      },
      requestOptions
    });
  }
}
