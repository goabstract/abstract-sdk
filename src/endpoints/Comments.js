// @flow
import querystring from "query-string";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";
import type {
  BranchDescriptor,
  Comment,
  CommentDescriptor,
  BranchCommitDescriptor,
  LayerVersionDescriptor,
  ListOptions,
  NewComment,
  PageDescriptor,
  RequestOptions
} from "../types";

export default class Comments extends Endpoint {
  name = "comments";

  async create(
    descriptor:
      | BranchDescriptor
      | BranchCommitDescriptor
      | PageDescriptor
      | {|
          ...$Exact<LayerVersionDescriptor>,
          pageId: string
        |},
    comment: NewComment,
    requestOptions: RequestOptions = {}
  ) {
    if (descriptor.sha) {
      descriptor = await this.client.descriptors.getLatestDescriptor(
        descriptor
      );
    }

    return this.configureRequest<Promise<Comment>>("create", {
      api: async () => {
        const body = {
          ...comment,
          ...descriptor,
          commitSha: descriptor.sha || undefined
        };

        const response = await this.apiRequest("comments", {
          method: "POST",
          body
        });

        return wrap(response);
      },
      requestOptions
    });
  }

  info(descriptor: CommentDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Comment>>("info", {
      api: async () => {
        const response = await this.apiRequest(
          `comments/${descriptor.commentId}`
        );
        return wrap(response);
      },
      requestOptions
    });
  }

  async list(
    descriptor:
      | BranchDescriptor
      | BranchCommitDescriptor
      | LayerVersionDescriptor
      | PageDescriptor,
    options: ListOptions = {}
  ) {
    const { limit, offset, ...requestOptions } = options;
    if (descriptor.sha) {
      descriptor = await this.client.descriptors.getLatestDescriptor(
        descriptor
      );
    }

    return this.createCursor<Promise<Comment[]>>(
      "list",
      (nextOffset = offset) => ({
        api: () => {
          const query = querystring.stringify({
            ...descriptor,
            limit,
            offset: nextOffset
          });

          return this.apiRequest(`comments?${query}`);
        },
        requestOptions
      }),
      response => wrap(response.data, response)
    );
  }
}
