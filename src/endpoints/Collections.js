// @flow
import querystring from "query-string";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";
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

// Version 16 returns cached thumbnails
const API_VERSION = 16;

export default class Collections extends Endpoint {
  name = "collections";

  create(
    descriptor: ProjectDescriptor,
    collection: NewCollection,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Collection>>("create", {
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

  info(
    descriptor: CollectionDescriptor,
    options: {
      ...RequestOptions,
      layersPerCollection?: number | "all"
    } = {}
  ) {
    const { layersPerCollection, ...requestOptions } = options;

    return this.configureRequest<Promise<Collection>>("info", {
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

    return this.configureRequest<Promise<Collection[]>>("list", {
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
              "Abstract-Api-Version": requestOptions._version || 26 // 26 includes `branches` as part of the response
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

  update(
    descriptor: CollectionDescriptor,
    collection: UpdatedCollection,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Collection>>("update", {
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
