// @flow
import type {
  CollectionDescriptor,
  CollectionLayer,
  CollectionLayerDescriptor,
  NewCollectionLayer
} from "../types";
import Endpoint from "./Endpoint";

export default class CollectionLayers extends Endpoint {
  add(descriptor: CollectionDescriptor, layer: NewCollectionLayer) {
    layer = { ...layer, collectionId: descriptor.collectionId };
    return this.request<Promise<CollectionLayer>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/collection_layers`,
          {
            method: "POST",
            body: layer
          }
        );
        return response;
      }
    });
  }

  remove(descriptor: CollectionLayerDescriptor) {
    return this.request<Promise<void>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/collection_layers/${descriptor.collectionLayerId}`,
          { method: "DELETE" }
        );
        return response;
      }
    });
  }

  move(descriptor: CollectionLayerDescriptor, order: number) {
    return this.request<Promise<CollectionLayer[]>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/collection_layers/${descriptor.collectionLayerId}/move`,
          {
            method: "POST",
            body: { order }
          }
        );
        return response;
      }
    });
  }

  update(descriptor: CollectionLayerDescriptor, layer: NewCollectionLayer) {
    return this.request<Promise<CollectionLayer>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/collection_layers/${descriptor.collectionLayerId}`,
          {
            method: "PUT",
            body: layer
          }
        );
        return response;
      }
    });
  }
}
