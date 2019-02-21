// @flow
import querystring from "query-string";
import type {
  BranchDescriptor,
  Collection,
  CollectionDescriptor,
  CollectionMeta,
  CollectionMetaList,
  NewCollection,
  ProjectDescriptor,
  UpdatedCollection
} from "../types";
import BaseEndpoint from "./BaseEndpoint";

export default class Collections extends BaseEndpoint {
  create(
    descriptor: ProjectDescriptor,
    collection: NewCollection
  ): Promise<Collection> {
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
  ): Promise<CollectionMeta> {
    return this.request<Promise<CollectionMeta>>({
      api: async () => {
        const query = querystring.stringify({ ...options });
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/collections/${
            descriptor.collectionId
          }?${query}`
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
      }
    });
  }

  list(
    descriptor: ProjectDescriptor | BranchDescriptor,
    options?: { layersPerCollection?: number | "all" } = {}
  ): Promise<CollectionMetaList> {
    return this.request<Promise<CollectionMetaList>>({
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

  update(
    descriptor: CollectionDescriptor,
    collection: UpdatedCollection
  ): Promise<Collection> {
    return this.request<Promise<Collection>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/collections/${
            descriptor.collectionId
          }`,
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
