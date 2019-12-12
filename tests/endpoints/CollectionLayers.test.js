// @flow
import { mockAPI, API_CLIENT } from "../../src/util/testing";

const mockLayer = {
  collectionId: "collection-id",
  fileId: "file-id",
  id: "id",
  isPinned: true,
  layerId: "layer-id",
  order: 2,
  pageId: "page-id",
  sha: "sha",
  useLatestCommit: true
};

describe("collectionLayers", () => {
  describe("add", () => {
    test("api", async () => {
      mockAPI("/projects/project-id/collection_layers", mockLayer, 201, "post");

      const response = await API_CLIENT.collectionLayers.add(
        {
          projectId: "project-id",
          collectionId: "collection-id"
        },
        mockLayer
      );

      expect(response).toEqual(mockLayer);
    });
  });

  describe("addMany", () => {
    test("api", async () => {
      mockAPI(
        "/projects/project-id/collection_layers/create_many",
        {
          data: [mockLayer]
        },
        201,
        "post"
      );

      const response = await API_CLIENT.collectionLayers.addMany(
        {
          projectId: "project-id",
          collectionId: "collection-id"
        },
        [mockLayer]
      );

      expect(response).toEqual([mockLayer]);
    });
  });

  describe("remove", () => {
    test("api", async () => {
      mockAPI(
        "/projects/project-id/collection_layers/collection-layer-id",
        undefined,
        204,
        "delete"
      );

      const response = await API_CLIENT.collectionLayers.remove({
        projectId: "project-id",
        collectionLayerId: "collection-layer-id"
      });

      expect(response).toBeUndefined();
    });
  });

  describe("move", () => {
    test("api", async () => {
      mockAPI(
        "/projects/project-id/collection_layers/collection-layer-id/move",
        mockLayer,
        201,
        "post"
      );

      const response = await API_CLIENT.collectionLayers.move(
        {
          projectId: "project-id",
          collectionLayerId: "collection-layer-id"
        },
        1337
      );

      expect(response).toEqual(mockLayer);
    });
  });

  describe("update", () => {
    test("api", async () => {
      mockAPI(
        "/projects/project-id/collection_layers/collection-layer-id",
        mockLayer,
        201,
        "put"
      );

      const response = await API_CLIENT.collectionLayers.update(
        {
          projectId: "project-id",
          collectionLayerId: "collection-layer-id"
        },
        mockLayer
      );

      expect(response).toEqual(mockLayer);
    });
  });
});
