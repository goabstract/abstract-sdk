// @flow
import querystring from "query-string";
import type {
  BranchDescriptor,
  Collection,
  CollectionDescriptor,
  CollectionsListOptions,
  NewCollection,
  ProjectDescriptor,
  RequestOptions,
  UpdatedCollection
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

// Version 16 returns cached thumbnails
const API_VERSION = 16;

/**
 * @class Collections
 * @extends Endpoint
 * @description
 * A collection is a set of layers at the same or different commits on a branch,
 * they can be created in the desktop or web app and are used to group work together
 * to communicate a flow, ask for review, or other use cases.
 */
export default class Collections extends Endpoint {
  /**
   * @memberof Collections
   * @param {ProjectDescriptor} descriptor
   * @param {NewCollection} collection
   * @param {RequestOptions} requestOptions
   * @returns {Promise<Collection>}
   * @description
   * Create a collection
   * @example
   * // Create a new collection
   * abstract.collections.create({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
   * }, {
   *  name: "Test collection",
   *  description: "Test description",
   *  branchId: "c426d0a6-e039-43d7-b7b3-e685a25e4cfb"
   * });
   */
  create(
    descriptor: ProjectDescriptor,
    collection: NewCollection,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Collection>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/collections`,
          {
            method: "POST",
            body: collection
          }
        );

        return wrap(response.data, response);
      },
      requestOptions
    });
  }

  /**
   * @memberof Collections
   * @param {CollectionDescriptor} descriptor
   * @param {RequestOptions} options
   * @description
   * Retrieve a collection
   * @returns {Promise<Collection>}
   * @example
   * // Load an individual collection
   * abstract.collections.info({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master",
   *  collectionId: "413daa80-1456-11e8-b8b0-4d1fec7ae555"
   * });
   */
  info(
    descriptor: CollectionDescriptor,
    options: {
      ...RequestOptions,
      layersPerCollection?: number | "all"
    } = {}
  ) {
    const { layersPerCollection, ...requestOptions } = options;

    return this.configureRequest<Promise<Collection>>({
      api: async () => {
        const query = querystring.stringify({ layersPerCollection });
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/collections/${descriptor.collectionId}?${query}`,
          {
            headers: {
              "Abstract-Api-Version": requestOptions._version || API_VERSION
            }
          }
        );
        return wrap(response.data.collections[0], response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "collections",
          "get",
          descriptor.collectionId,
          `--project-id=${descriptor.projectId}`
        ]);
        return wrap(response.data.collections[0], response);
      },

      requestOptions
    });
  }

  /**
   * @memberof Collections
   * @param {ProjectDescriptor | BranchDescriptor} descriptor
   * @param {CollectionsListOptions} options
   * @returns {Promise<Collection[]>}
   * @description
   * List all collections
   * @example
   * // List all collections for a branch
   * abstract.collections.list({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  branchId: "master"
   * });
   */
  list(
    descriptor: ProjectDescriptor | BranchDescriptor,
    options: CollectionsListOptions = {}
  ) {
    const {
      branchStatus,
      layersPerCollection,
      limit,
      offset,
      search,
      sortBy,
      sortDir,
      userId,
      ...requestOptions
    } = options;

    return this.configureRequest<Promise<Collection[]>>({
      api: async () => {
        const { projectId, ...sanitizedDescriptor } = descriptor;
        const query = querystring.stringify({
          ...sanitizedDescriptor,
          branchStatus,
          layersPerCollection,
          limit,
          offset,
          search,
          sortBy,
          sortDir,
          userId
        });

        const response = await this.apiRequest(
          `projects/${projectId}/collections?${query}`,
          {
            headers: {
              "Abstract-Api-Version": requestOptions._version || API_VERSION
            }
          }
        );

        return wrap(response.data.collections, response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "collections",
          "list",
          descriptor.projectId,
          ...(descriptor.branchId ? ["--branch-id", descriptor.branchId] : []),
          ...(layersPerCollection
            ? ["--layersLimit", String(layersPerCollection)]
            : [])
        ]);

        return wrap(response.data.collections, response);
      },

      requestOptions
    });
  }

  /**
   * @memberof Collections
   * @param {CollectionDescriptor} descriptor
   * @param {UpdatedCollection} collection
   * @param {RequestOptions} requestOptions
   * @returns {Promise<Collection>}
   * @description
   * Update a collection
   * @example
   * // Update an existing collection
   * abstract.collections.update({
   *  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
   *  collectionId: "413daa80-1456-11e8-b8b0-4d1fec7ae555"
   * }, {
   *  name: "New name"
   * });
   */
  update(
    descriptor: CollectionDescriptor,
    collection: UpdatedCollection,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Collection>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/collections/${descriptor.collectionId}`,
          {
            method: "PUT",
            body: collection
          }
        );

        return wrap(response.data, response);
      },
      requestOptions
    });
  }
}
