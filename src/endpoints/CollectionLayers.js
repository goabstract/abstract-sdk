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
import { wrap } from "../util/helpers";

/**
 *
 * @class CollectionLayers
 * @extends Endpoint
 * @description
 * A collection layer represents an underlying layer within a collection.
 * Collection layers can be added to, removed from,
 * and updated within existing collections.
 */
export default class CollectionLayers extends Endpoint {
  /**
   *
   *
   * @param {CollectionDescriptor} descriptor
   * @param {NewCollectionLayer} layer
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<CollectionLayer>}
   * @memberof CollectionLayers
   * @example
   * // Add a single layer to a collection
   * abstract.collectionLayers.add({
   *  projectId: '003a1ae0-a4b3-11e9-807c-a35b74e69da5',
   *  collectionId: '2538be75-c38b-4008-8a60-cf2c0364727e'
   * }, {
   *  fileId: '745EF992-C945-4B4C-BAFD-C6D45C45C6E2',
   *  isPinned: true,
   *  layerId: '9E2EB6C6-3681-4FCF-951E-50F7F0A0B0DE',
   *  order: 1,
   *  pageId: '7DC19A61-4D5F-4D75-BCAE-A589DF08257B',
   *  sha: 'latest'
   * });
   */
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

  /**
   *
   *
   * @param {CollectionDescriptor} descriptor
   * @param {NewCollectionLayer[]} layers
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<CollectionLayer[]>}
   * @memberof CollectionLayers
   * @example
   * // Add multiple layers to a collection
   * abstract.collectionLayers.addMany({
   *  projectId: '003a1ae0-a4b3-11e9-807c-a35b74e69da5',
   *  collectionId: '2538be75-c38b-4008-8a60-cf2c0364727e'
   * }, [
   *  {
   *    fileId: '745EF992-C945-4B4C-BAFD-C6D45C45C6E2',
   *    isPinned: true,
   *    layerId: '9E2EB6C6-3681-4FCF-951E-50F7F0A0B0DE',
   *    order: 1,
   *    pageId: '7DC19A61-4D5F-4D75-BCAE-A589DF08257B',
   *    sha: 'latest'
   *  }
   * ]);
   */
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

  /**
   *
   *
   * @param {CollectionLayerDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<void>}
   * @memberof CollectionLayers
   * @example
   * // Remove a layer from a collection
   * abstract.collectionLayers.remove({
   *  projectId: '003a1ae0-a4b3-11e9-807c-a35b74e69da5',
   *  collectionLayerId: '8a2aaa0f-bc8e-4b0d-9f79-dda1c68f12f1'
   * });
   */
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

  /**
   *
   *
   * @param {CollectionLayerDescriptor} descriptor
   * @param {number} order
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<CollectionLayer[]>}
   * @memberof CollectionLayers
   * @example
   * // Reorder a layer within a collection
   * abstract.collectionLayers.move({
   *  projectId: '003a1ae0-a4b3-11e9-807c-a35b74e69da5',
   *  collectionLayerId: '8a2aaa0f-bc8e-4b0d-9f79-dda1c68f12f1'
   * }, 2);
   */
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

  /**
   *
   *
   * @param {CollectionLayerDescriptor} descriptor
   * @param {UpdatedCollectionLayer} layer
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<CollectionLayer>}
   * @memberof CollectionLayers
   * @example
   * // Update a layer within a collection
   * abstract.collectionLayers.update({
   *  projectId: '003a1ae0-a4b3-11e9-807c-a35b74e69da5',
   *  collectionLayerId: '8a2aaa0f-bc8e-4b0d-9f79-dda1c68f12f1'
   * }, {
   *  fileId: '745EF992-C945-4B4C-BAFD-C6D45C45C6E2',
   *  isPinned: false,
   *  layerId: '9E2EB6C6-3681-4FCF-951E-50F7F0A0B0DE',
   *  order: 2,
   *  pageId: '7DC19A61-4D5F-4D75-BCAE-A589DF08257B',
   *  sha: 'latest'
   * });
   */
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
