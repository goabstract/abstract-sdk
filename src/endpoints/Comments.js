// @flow
import querystring from "query-string";
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
import Endpoint from "../endpoints/Endpoint";

export default class Comments extends Endpoint {
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

    return this.configureRequest<Promise<Comment>>({
      api: async () => {
        const body = {
          ...comment,
          ...descriptor,
          commitSha: descriptor.sha || undefined
        };

        return this.apiRequest("comments", {
          method: "POST",
          body
        });
      },
      requestOptions
    });
  }

  info(descriptor: CommentDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Comment>>({
      api: () => {
        return this.apiRequest(`comments/${descriptor.commentId}`);
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
      response => response.data
    );
  }
}
