// @flow
import querystring from "query-string";
import {
  objectBranchDescriptor,
  objectFileDescriptor,
  layerPageDescriptor
} from "../utils";
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
      | LayerDescriptor
      | PageDescriptor,
    comment: NewComment
  ): Promise<Comment> {
    if (descriptor.sha) {
      descriptor = await this.client.descriptors.getLatestDescriptor(
        descriptor
      );
    }
    return this.request<Promise<Comment>>({
      api: async () => {
        const branch = await this.client.branches.info(
          objectBranchDescriptor(descriptor)
        );

        const body = {
          ...descriptor,
          commitSha: descriptor.sha || undefined,
          branchName: branch.name,
          annotation: comment.annotation,
          body: comment.body
        };

        if (descriptor.layerId) {
          const layer = await this.client.layers.info(descriptor);
          const page = await this.client.pages.info(
            layerPageDescriptor(layer, descriptor.branchId)
          );

          const file = await this.client.files.info(
            objectFileDescriptor(descriptor)
          );

          return this.apiRequest("comments", {
            method: "POST",
            body: {
              ...body,
              fileName: file.name,
              fileType: file.type,
              pageId: page.id,
              pageName: page.name,
              layerName: layer.name
            }
          });
        }

        if (descriptor.pageId) {
          const page = await this.client.pages.info(descriptor);
          const file = await this.client.files.info(
            objectFileDescriptor(descriptor)
          );

          return this.apiRequest("comments", {
            method: "POST",
            body: {
              ...body,
              fileName: file.name,
              fileType: file.type,
              pageId: page.id,
              pageName: page.name
            }
          });
        }

        if (descriptor.fileId) {
          const file = await this.client.files.info(
            objectFileDescriptor(descriptor)
          );

          return this.apiRequest("comments", {
            method: "POST",
            body: {
              ...body,
              fileName: file.name,
              fileType: file.type
            }
          });
        }

        return this.apiRequest("comments", {
          method: "POST",
          body
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
