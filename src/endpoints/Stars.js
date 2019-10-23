// @flow
import type { Star } from "../types";
import Endpoint from "./Endpoint";

const headers = {
  "Abstract-Api-Version": "13"
};

export default class Stars extends Endpoint {
  list() {
    return this.request<Promise<Star[]>>({
      api: async () => {
        const response = await this.apiRequest("starred", {
          headers
        });
        return response;
      }
    });
  }
}
