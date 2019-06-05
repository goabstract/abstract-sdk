// @flow
import querystring from "query-string";
import Cursor from "../Cursor";
import type {
  BranchDescriptor,
  Comment,
  CommentDescriptor,
  CommitDescriptor,
  CursorPromise,
  LayerDescriptor,
  ListOptions,
  NewComment,
  PageDescriptor
} from "../types";
import Endpoint from "./Endpoint";

export default class Comments extends Endpoint {
  async create(
    descriptor:
      | BranchDescriptor
      | CommitDescriptor
      | PageDescriptor
      | {|
          ...$Exact<LayerDescriptor>,
          pageId: string
        |},
    comment: NewComment
  ) {
    if (descriptor.sha) {
      descriptor = await this.client.descriptors.getLatestDescriptor(
        descriptor
      );
    }
    return this.request<Promise<Comment>>({
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
      }
    });
  }

  info(descriptor: CommentDescriptor) {
    return this.request<Promise<Comment>>({
      api: () => {
        return this.apiRequest(`comments/${descriptor.commentId}`);
      },

      cache: {
        key: `comment:${descriptor.commentId}`
      }
    });
  }

  list(
    descriptor:
      | BranchDescriptor
      | CommitDescriptor
      | LayerDescriptor
      | PageDescriptor,
    options: ListOptions = {}
  ) {
    let newDescriptor;
    return this.request<CursorPromise<Comment[]>>({
      api: () => {
        return new Cursor<Comment[]>(
          async (meta = { nextOffset: options.offset }) => {
            /* istanbul ignore else */
            if (!newDescriptor) {
              newDescriptor = descriptor;

              /* istanbul ignore else */
              if (newDescriptor.sha) {
                newDescriptor = await this.client.descriptors.getLatestDescriptor(
                  newDescriptor
                );
              }
            }

            const query = querystring.stringify({
              ...newDescriptor,
              ...options,
              offset: meta.nextOffset
            });

            return this.apiRequest(`comments?${query}`);
          }
        );
      }
    });
  }
}
