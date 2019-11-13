// @flow
import type {
  CollectionDescriptor,
  CollectionLayer,
  CollectionLayerDescriptor,
  NewCollectionLayer,
  UpdatedCollectionLayer
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

  addMany(descriptor: CollectionDescriptor, layers: NewCollectionLayer[]) {
    const collectionLayers = layers.map(layer => {
      const { layerId, ...collectionLayer } = layer;
      return { ...collectionLayer, id: layerId };
    });
    return this.request<Promise<CollectionLayer>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/collection_layers/create_many`,
          {
            method: "POST",
            body: {
              collectionId: descriptor.collectionId,
              layers: collectionLayers
            }
          }
        );
        return response.data;
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

  update(descriptor: CollectionLayerDescriptor, layer: UpdatedCollectionLayer) {
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
