// @flow
import querystring from "query-string";
import type {
  BranchDescriptor,
  Collection,
  CollectionDescriptor,
  NewCollection,
  ProjectDescriptor,
  RequestOptions,
  UpdatedCollection
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

export default class Collections extends Endpoint {
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
          `projects/${descriptor.projectId}/collections/${descriptor.collectionId}?${query}`
        );
        return wrap(response.data.collections[0], response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "collection",
          "load",
          descriptor.projectId,
          descriptor.collectionId
        ]);
        return wrap(response.data.collections[0], response);
      },

      requestOptions
    });
  }

  list(
    descriptor: ProjectDescriptor | BranchDescriptor,
    options: {
      ...RequestOptions,
      layersPerCollection?: number | "all"
    } = {}
  ) {
    const { layersPerCollection, ...requestOptions } = options;

    return this.configureRequest<Promise<Collection[]>>({
      api: async () => {
        const { projectId, ...sanitizedDescriptor } = descriptor;
        const query = querystring.stringify({
          ...sanitizedDescriptor,
          layersPerCollection
        });

        const response = await this.apiRequest(
          `projects/${projectId}/collections?${query}`
        );

        return wrap(response.data.collections, response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "collections",
          descriptor.projectId,
          ...(descriptor.branchId ? ["--branch", descriptor.branchId] : [])
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
