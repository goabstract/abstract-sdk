// @flow
import querystring from "query-string";
import Cursor from "../Cursor";
import type {
  BranchDescriptor,
  Comment,
  CommentDescriptor,
  CommitDescriptor,
  CursorPromise,
  FileDescriptor,
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
      | LayerDescriptor
      | PageDescriptor,
    comment: NewComment
  ): Promise<Comment> {
    if (descriptor.sha) {
      descriptor = await this.client.commits.getLatestDescriptor(descriptor);
    }
    return this.request<Promise<Comment>>({
      api: async () => {
        const branch = await this.client.branches.info({
          branchId: descriptor.branchId,
          projectId: descriptor.projectId
        });
        let commentData = {
          branchName: branch.name
        };
        if (descriptor.layerId) {
          const layer: any = await this.client.layers.info(descriptor);
          commentData = {
            ...commentData,
            layerId: layer.id,
            layerName: layer.name
          };
        }
        if (descriptor.pageId) {
          const page = await this.client.pages.info(
            ((descriptor: any): PageDescriptor)
          );
          const file = await this.client.files.info(
            ((descriptor: any): FileDescriptor)
          );
          commentData = {
            ...commentData,
            fileId: file.id,
            fileName: file.name,
            fileType: file.type,
            pageId: page.id,
            pageName: page.name
          };
        }

        return this.apiRequest("comments", {
          method: "POST",
          body: {
            ...commentData,
            ...descriptor,
            commitSha: descriptor.sha || undefined,
            annotation: comment.annotation,
            body: comment.body
          }
        });
      }
    });
  }

  info(descriptor: CommentDescriptor): Promise<Comment> {
    return this.request<Promise<Comment>>({
      api: () => {
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
    let newDescriptor;
    return this.request<CursorPromise<Comment[]>>({
      api: () => {
        return new Cursor<Comment[]>(
          async (meta = { nextOffset: options.offset }) => {
            if (!newDescriptor) {
              newDescriptor = descriptor;
              if (newDescriptor.sha) {
                newDescriptor = await this.client.commits.getLatestDescriptor(
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
