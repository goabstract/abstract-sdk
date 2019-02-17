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
import BaseEndpoint from "./BaseEndpoint";

export default class Comments extends BaseEndpoint {
  create(
    descriptor: BranchDescriptor | LayerDescriptor,
    comment: NewComment
  ): Promise<Comment> {
    return this.request<Promise<Comment>>({
      api: async () => {
        let commentData;
        const branch = await this.client.branches.info({
          branchId: descriptor.branchId,
          projectId: descriptor.projectId,
          sha: descriptor.sha
        });
        if (!descriptor.layerId) {
          commentData = { branchName: branch.name };
        } else {
          const layer: any = await this.client.layers.info(descriptor);
          commentData = {
            branchName: branch.name,
            fileName: layer._file.name,
            layerName: layer.name,
            pageId: layer._page.id,
            pageName: layer._page.name
          };
        }

        return this.apiRequest("comments", {
          method: "POST",
          body: {
            ...commentData,
            ...descriptor,
            annotation: comment.annotation,
            body: comment.body
          }
        });
      }
    });
  }

  info(descriptor: CommentDescriptor): Promise<Comment> {
    return this.request<Promise<Comment>>({
      api: async () => {
        return this.apiRequest(`comments/${descriptor.commentId}`);
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
  ): CursorPromise<Comment[]> {
    return this.request<CursorPromise<Comment[]>>({
      api: () => {
        return new Cursor<Comment[]>(
          async (meta = { nextOffset: options.offset }) => {
            const query = querystring.stringify({
              ...descriptor,
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
