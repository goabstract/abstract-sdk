// @flow
import {
  mockAPI,
  mockCLI,
  API_CLIENT,
  CLI_CLIENT
} from "../../src/util/testing";

describe("layers", () => {
  describe("info", () => {
    test("api", async () => {
      mockAPI(
        "/projects/project-id/branches/branch-id/commits/sha/files/file-id/layers/layer-id",
        {
          layer: {
            id: "layer-id"
          }
        }
      );

      const response = await API_CLIENT.layers.info({
        branchId: "branch-id",
        fileId: "file-id",
        layerId: "layer-id",
        projectId: "project-id",
        sha: "sha"
      });

      expect(response).toEqual({
        id: "layer-id"
      });
    });

    test("cli", async () => {
      mockCLI(["layer", "meta", "project-id", "sha", "file-id", "layer-id"], {
        layer: {
          id: "layer-id"
        }
      });

      const response = await CLI_CLIENT.layers.info({
        branchId: "branch-id",
        fileId: "file-id",
        layerId: "layer-id",
        projectId: "project-id",
        sha: "sha"
      });

      expect(response).toEqual({
        id: "layer-id"
      });
    });
  });

  describe("list", () => {
    test("api", async () => {
      mockAPI(
        "/projects/project-id/branches/branch-id/files/file-id/layers?branchId=branch-id&fileId=file-id&projectId=project-id&sha=sha",
        {
          layers: [
            {
              id: "layer-id"
            }
          ]
        }
      );

      const response = await API_CLIENT.layers.list({
        branchId: "branch-id",
        fileId: "file-id",
        projectId: "project-id",
        sha: "sha"
      });

      expect(response).toEqual([
        {
          id: "layer-id"
        }
      ]);
    });

    test("cli", async () => {
      mockCLI(["layers", "project-id", "sha", "file-id"], {
        layers: [
          {
            id: "layer-id"
          }
        ]
      });

      const response = await CLI_CLIENT.layers.list({
        branchId: "branch-id",
        fileId: "file-id",
        projectId: "project-id",
        sha: "sha"
      });

      expect(response).toEqual([
        {
          id: "layer-id"
        }
      ]);
    });

    test("cli with options", async () => {
      mockCLI(
        [
          "layers",
          "project-id",
          "sha",
          "file-id",
          "--limit=1",
          "--offset=1",
          "--page-id=page-id",
          "--from-libraries=include"
        ],
        {
          layers: [
            {
              id: "layer-id"
            }
          ]
        }
      );

      const response = await CLI_CLIENT.layers.list(
        {
          projectId: "project-id",
          branchId: "branch-id",
          sha: "sha",
          fileId: "file-id",
          pageId: "page-id"
        },
        {
          limit: 1,
          offset: 1,
          fromLibraries: "include"
        }
      );

      expect(response).toEqual([
        {
          id: "layer-id"
        }
      ]);
    });
  });
});
