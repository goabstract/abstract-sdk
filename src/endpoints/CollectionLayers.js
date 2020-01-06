// @flow
import type {
  CollectionDescriptor,
  CollectionLayer,
  CollectionLayerDescriptor,
  NewCollectionLayer,
  RequestOptions,
  UpdatedCollectionLayer
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../response";

export default class CollectionLayers extends Endpoint {
  add(
    descriptor: CollectionDescriptor,
    layer: NewCollectionLayer,
    requestOptions: RequestOptions = {}
  ) {
    layer = { ...layer, collectionId: descriptor.collectionId };

    return this.configureRequest<Promise<CollectionLayer>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/collection_layers`,
          {
            method: "POST",
            body: layer
          }
        );

        return wrap(response);
      },
      requestOptions
    });
  }

  addMany(
    descriptor: CollectionDescriptor,
    layers: NewCollectionLayer[],
    requestOptions: RequestOptions = {}
  ) {
    const collectionLayers = layers.map(layer => {
      const { layerId, ...collectionLayer } = layer;
      return { ...collectionLayer, id: layerId };
    });

    return this.configureRequest<Promise<CollectionLayer>>({
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

        return wrap(response.data, response);
      },
      requestOptions
    });
  }

  remove(
    descriptor: CollectionLayerDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<void>>({
      api: () => {
        return this.apiRequest(
          `projects/${descriptor.projectId}/collection_layers/${descriptor.collectionLayerId}`,
          {
            method: "DELETE"
          }
        );
      },

      requestOptions
    });
  }

  move(
    descriptor: CollectionLayerDescriptor,
    order: number,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<CollectionLayer[]>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/collection_layers/${descriptor.collectionLayerId}/move`,
          {
            method: "POST",
            body: { order }
          }
        );

        return wrap(response);
      },
      requestOptions
    });
  }

  update(
    descriptor: CollectionLayerDescriptor,
    layer: UpdatedCollectionLayer,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<CollectionLayer>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/collection_layers/${descriptor.collectionLayerId}`,
          {
            method: "PUT",
            body: layer
          }
        );

        return wrap(response);
      },
      requestOptions
    });
  }
}
