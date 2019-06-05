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
  UpdatedCollection
} from "../types";
import Endpoint from "./Endpoint";

export default class Collections extends Endpoint {
  create(descriptor: ProjectDescriptor, collection: NewCollection) {
    return this.request<Promise<Collection>>({
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
    });
  }

  info(
    descriptor: CollectionDescriptor,
    options: { layersPerCollection?: number | "all" } = {
      layersPerCollection: "all"
    }
  ) {
    return this.request<Promise<CollectionResponse>>({
      api: async () => {
        const query = querystring.stringify({ ...options });
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/collections/${descriptor.collectionId}?${query}`
        );
        const { collections, ...meta } = response.data;
        return {
          collection: collections[0],
          ...meta
        };
      },

      cli: () => {
        return this.cliRequest([
          "collection",
          "load",
          descriptor.projectId,
          descriptor.collectionId
        ]);
      },

      cache: {
        key: `collection:${descriptor.collectionId}`
      }
    });
  }

  list(
    descriptor: ProjectDescriptor | BranchDescriptor,
    options?: { layersPerCollection?: number | "all" } = {}
  ) {
    return this.request<Promise<CollectionsResponse>>({
      api: async () => {
        const { projectId, ...sanitizedDescriptor } = descriptor;
        const query = querystring.stringify({
          ...sanitizedDescriptor,
          ...options
        });
        const response = await this.apiRequest(
          `projects/${projectId}/collections?${query}`
        );
        return response.data;
      },

      cli: () => {
        return this.cliRequest([
          "collections",
          descriptor.projectId,
          ...(descriptor.branchId ? ["--branch", descriptor.branchId] : [])
        ]);
      }
    });
  }

  update(descriptor: CollectionDescriptor, collection: UpdatedCollection) {
    return this.request<Promise<Collection>>({
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
    });
  }
}
