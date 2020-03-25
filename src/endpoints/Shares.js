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

/**
 *
 *
 * @export
 * @class Shares
 * @extends {Endpoint}
 * @see [Share](#share)
 * @see [ShareInput](#shareInput)
 * @see [ShareDescriptor](#shareDescriptor)
 * @see [OrganizationDescriptor](#organizationDescriptor)
 * @description
 * A share is a shareable url to an object in Abstract. You can use the desktop or web app to create a share url.
 * <div class="banner banner-yellow">
 *  Note: The format of a share url is <code>https://share.goabstract.com/<UUID></code>.
 * </div>
 */
export default class Shares extends Endpoint {
  /**
   *
   *
   * @param {OrganizationDescriptor} descriptor
   * @param {ShareInput} shareInput
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Share>}
   * @memberof Shares
   * @description Create a share
   * @example
   * // Create a layer share in your organization
   * abstract.shares.create({
   *  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
   * }, {
   *  kind: "layer",
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
   *  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
   *  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
   *  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a" // or sha: "latest"
   * });
   */
  create<T: Share>(
    descriptor: OrganizationDescriptor,
    shareInput: ShareInput,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<T>>({
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

  /**
   *
   *
   * @param {ShareDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Share>}
   * @memberof Shares
   * @example
   * // Load info for a share
   * abstract.shares.info({
   *  url: 'https://share.goabstract.com/49b1f582-a8b4-46ca-8c86-bbc675fe27c4'
   * });
   *
   * @example
   * // or, by id…
   * abstract.shares.info({
   *  shareId: '49b1f582-a8b4-46ca-8c86-bbc675fe27c4'
   * });
   *
   * @example
   * // Using share.descriptor
   * const branchShare = await abstract.share.info({
   *  url: 'https://share.goabstract.com/49b1f582-a8b4-46ca-8c86-bbc675fe27c4'
   * })
   *
   * const branchFiles = await abstract.files.list(branchShare.descriptor);
   */
  info<T: Share>(
    descriptor: ShareDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<T>>({
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
