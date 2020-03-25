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
import { wrap } from "../util/helpers";

/**
 *
 * @export
 * @class Comments
 * @see [Comment](#comment)
 * @see [NewComment](#newComment)
 * @see [CommentDescriptor](#commentDescriptor)
 * @see [BranchDescriptor](#branchDescriptor)
 * @see [BranchCommitDescriptor](#branchCommitDescriptor)
 * @see [PageDescriptor](#pageDescriptor)
 * @see [LayerVersionDescriptor](#layerVersionDescriptor)
 * @description
 * A comment in Abstract can be left on a branch, commit, or layer.
 * Comments on layers can also include an optional annotation that
 * represents a bounding area on-top of the layer, this can be
 * used to leave comments about specific areas.
 * @extends Endpoint
 */
export default class Comments extends Endpoint {
  /**
   *
   *
   * @param {(BranchDescriptor
   *       | BranchCommitDescriptor
   *       | PageDescriptor
   *       | {pageId: string, LayerVersionDescriptor})} descriptor
   * @param {NewComment} comment
   * @param {RequestOptions = {}} requestOptions
   * @returns {Promise<Comment>}
   * @memberof Comments
   * @description
   * Create a comment
   * <div class="banner banner-warning">
   *  Note: It's important to ensure that the annotation bounding
   *  box is within the dimensions of the layer!
   * </div>
   * @example
   * // Create a comment on a branch
   * abstract.comments.create({
   *    projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *    branchId: "master"
   * }, {
   *    body: "Hello from the Abstract SDK"
   * });
   *
   * @example
   * // Or, perhaps create an annotation on a layer…
   * abstract.comments.create({
   *    projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *    branchId: "master",
   *    fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
   *    layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
   *    sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a", // or sha: "latest"
   * }, {
   *    body: "Hello from the Abstract SDK",
   *    annotation: {
   *        width: 100,
   *        height: 100,
   *        x: 300,
   *        y: 400
   *    }
   * });
   */
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

        const response = await this.apiRequest("comments", {
          method: "POST",
          body
        });

        return wrap(response);
      },
      requestOptions
    });
  }

  /**
   * @memberof Comments
   * @param {CommentDescriptor} descriptor
   * @param {RequestOptions = {}} requestOptions
   * @returns {Promise<Comment>}
   * @example
   * // Load the info for a comment
   * abstract.comments.info({
   *    commentId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
   * });
   */
  info(descriptor: CommentDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Comment>>({
      api: async () => {
        const response = await this.apiRequest(
          `comments/${descriptor.commentId}`
        );
        return wrap(response);
      },
      requestOptions
    });
  }

  /**
   * @memberof Comments
   * @param {BranchDescriptor | BranchCommitDescriptor | LayerVersionDescriptor | PageDescriptor} descriptor
   * @param {ListOptions = {}} options
   * @returns {CursorPromise<Comment[]>}
   * @description
   * <div class="banner banner-warning">
   *  Note: This endpoint returns a special type of <strong>Promise</strong>
   *  called a <strong>CursorPromise</strong> that supports cursor-based pagination.
   *  More information can be found <a href="#pagination">here</a>.
   * </div>
   * @example
   * // List the comments for a specific project
   * abstract.comments.list({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
   * });
   * @example
   * // or, list the first two comments for a specific layer...
   * abstract.comments.list({
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
   *  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
   * }, { limit: 2 });
   */
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
      response => wrap(response.data, response)
    );
  }
}
