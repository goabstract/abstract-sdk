// @flow
import querystring from "query-string";
import type {
  BranchDescriptor,
  Collection,
  CollectionDescriptor,
  CollectionResponse,
  CollectionsResponse,
  NewCollection,
  ProjectDescriptor,
  RequestOptions,
  UpdatedCollection
} from "../types";
import Endpoint from "../endpoints/Endpoint";

export default class Collections extends Endpoint {
  create(
    descriptor: ProjectDescriptor,
    collection: NewCollection,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Collection>>(
      {
        api: async () => {
          const response = await this.apiRequest(
            `projects/${descriptor.projectId}/collections`,
            {
              method: "POST",
              body: collection
            }
          );

          return response.data;
        }
      },
      requestOptions
    );
  }

  info(
    descriptor: CollectionDescriptor,
    options: {
      ...RequestOptions,
      layersPerCollection?: number | "all"
    } = {}
  ) {
    const { layersPerCollection, ...requestOptions } = options;

    return this.configureRequest<Promise<CollectionResponse>>(
      {
        api: async () => {
          const query = querystring.stringify({ layersPerCollection });
          const response = await this.apiRequest(
            `projects/${descriptor.projectId}/collections/${descriptor.collectionId}?${query}`
          );

          const { collections, ...meta } = response.data;
          return {
            collection: collections[0],
            ...meta
          };
        },

        cli: async () => {
          const response = await this.cliRequest([
            "collection",
            "load",
            descriptor.projectId,
            descriptor.collectionId
          ]);

          const { collections, ...meta } = response.data;
          return {
            collection: collections[0],
            ...meta
          };
        }
      },
      requestOptions
    );
  }

  list(
    descriptor: ProjectDescriptor | BranchDescriptor,
    options: {
      ...RequestOptions,
      layersPerCollection?: number | "all"
    } = {}
  ) {
    const { layersPerCollection, ...requestOptions } = options;

    return this.configureRequest<Promise<CollectionsResponse>>(
      {
        api: async () => {
          const { projectId, ...sanitizedDescriptor } = descriptor;
          const query = querystring.stringify({
            ...sanitizedDescriptor,
            layersPerCollection
          });

          const response = await this.apiRequest(
            `projects/${projectId}/collections?${query}`
          );

          return response.data;
        },

        cli: async () => {
          const response = await this.cliRequest([
            "collections",
            descriptor.projectId,
            ...(descriptor.branchId ? ["--branch", descriptor.branchId] : [])
          ]);

          return response.data;
        }
      },
      requestOptions
    );
  }

  update(
    descriptor: CollectionDescriptor,
    collection: UpdatedCollection,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Collection>>(
      {
        api: async () => {
          const response = await this.apiRequest(
            `projects/${descriptor.projectId}/collections/${descriptor.collectionId}`,
            {
              method: "PUT",
              body: collection
            }
          );

          return response.data;
        }
      },
      requestOptions
    );
  }
}
