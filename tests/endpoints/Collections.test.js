// @flow
import {
  mockAPI,
  mockCLI,
  API_CLIENT,
  CLI_CLIENT
} from "../../src/util/testing";

describe("collections", () => {
  describe("create", () => {
    test("api", async () => {
      mockAPI(
        "/projects/project-id/collections",
        {
          data: {
            id: "collection-id"
          }
        },
        201,
        "post"
      );

      const response = await API_CLIENT.collections.create(
        {
          projectId: "project-id"
        },
        {
          branchId: "branch",
          name: "collection"
        }
      );

      expect(response).toEqual({
        id: "collection-id"
      });
    });
  });

  describe("info", () => {
    test("api", async () => {
      mockAPI("/projects/project-id/collections/collection-id?", {
        data: {
          collections: [
            {
              id: "collection-id"
            }
          ]
        }
      });

      const response = await API_CLIENT.collections.info({
        collectionId: "collection-id",
        projectId: "project-id"
      });

      expect(response).toEqual({
        id: "collection-id"
      });
    });

    test("cli", async () => {
      mockCLI(["collection", "load", "project-id", "collection-id"], {
        data: {
          collections: [
            {
              id: "collection-id"
            }
          ]
        }
      });

      const response = await CLI_CLIENT.collections.info({
        projectId: "project-id",
        collectionId: "collection-id"
      });

      expect(response).toEqual({
        id: "collection-id"
      });
    });
  });

  describe("list", () => {
    test("api", async () => {
      mockAPI(
        "/projects/project-id/collections?branchId=branch-id&branchStatus=active&layersPerCollection=1337&limit=10&offset=2&search=search&sortBy=sort-by&sortDir=sort-dir&userId=user-id",
        {
          data: {
            collections: [
              {
                id: "collection-id"
              }
            ]
          }
        }
      );

      const response = await API_CLIENT.collections.list(
        {
          projectId: "project-id",
          branchId: "branch-id"
        },
        {
          branchStatus: "active",
          layersPerCollection: 1337,
          limit: 10,
          offset: 2,
          search: "search",
          sortBy: "sort-by",
          sortDir: "sort-dir",
          userId: "user-id"
        }
      );

      expect(response).toEqual([
        {
          id: "collection-id"
        }
      ]);
    });

    test("cli", async () => {
      mockCLI(
        [
          "collections",
          "project-id",
          "--branch",
          "branch-id",
          "--layersLimit",
          "1337"
        ],
        {
          data: {
            collections: [
              {
                id: "collection-id"
              }
            ]
          }
        }
      );

      const response = await CLI_CLIENT.collections.list(
        {
          projectId: "project-id",
          branchId: "branch-id"
        },
        {
          layersPerCollection: 1337
        }
      );

      expect(response).toEqual([
        {
          id: "collection-id"
        }
      ]);
    });

    test("cli - no branch id", async () => {
      mockCLI(["collections", "project-id"], {
        data: {
          collections: [
            {
              id: "collection-id"
            }
          ]
        }
      });

      const response = await CLI_CLIENT.collections.list({
        projectId: "project-id"
      });

      expect(response).toEqual([
        {
          id: "collection-id"
        }
      ]);
    });
  });

  describe("update", () => {
    test("api", async () => {
      mockAPI(
        "/projects/project-id/collections/collection-id",
        {
          data: {
            id: "collection-id"
          }
        },
        201,
        "put"
      );

      const response = await API_CLIENT.collections.update(
        {
          collectionId: "collection-id",
          projectId: "project-id"
        },
        {
          branchId: "branch",
          name: "collection"
        }
      );

      expect(response).toEqual({
        id: "collection-id"
      });
    });
  });
});
