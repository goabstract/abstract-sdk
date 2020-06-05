// @flow
import {
  mockAPI,
  mockCLI,
  API_CLIENT,
  CLI_CLIENT
} from "../../src/util/testing";

describe("data", () => {
  describe("info", () => {
    describe("LayerVersionDescriptor", () => {
      test("api", async () => {
        mockAPI(
          "/projects/project-id/branches/branch-id/commits/sha/files/file-id/layers/layer-id/data",
          { layerId: "layer-id" }
        );

        const response = await API_CLIENT.data.info({
          branchId: "branch-id",
          fileId: "file-id",
          layerId: "layer-id",
          projectId: "project-id",
          sha: "sha"
        });

        expect(response).toEqual({ layerId: "layer-id" });
      });

      test("cli", async () => {
        mockCLI(
          [
            "layers",
            "inspect",
            "layer-id",
            "--project-id=project-id",
            "--branch-id=branch-id",
            "--sha=sha",
            "--file-id=file-id"
          ],
          { layerId: "layer-id" }
        );

        const response = await CLI_CLIENT.data.info({
          branchId: "branch-id",
          fileId: "file-id",
          layerId: "layer-id",
          projectId: "project-id",
          sha: "sha"
        });

        expect(response).toEqual({ layerId: "layer-id" });
      });
    });

    describe("FileDescriptor", () => {
      test("api", async () => {
        mockAPI(
          "/projects/project-id/branches/branch-id/files/file-id/layers?branchId=branch-id&fileId=file-id&projectId=project-id&sha=sha",
          {
            layers: [
              {
                id: "layer-id",
                projectId: "project-id",
                fileId: "file-id",
                libraryId: "libraryId",
                sha: "sha"
              }
            ]
          }
        );

        mockAPI(
          "/projects/project-id/branches/branch-id/commits/sha/files/file-id/layers/layer-id/data",
          {
            layerId: "layer-id",
            layers: {
              "layer-id": {
                id: "layer-id",
                properties: { textStyleIndex: [{ styleName: "Testing" }] }
              },
              "nested-layer-id": { id: "nested-layer-id" }
            }
          }
        );

        const response = await API_CLIENT.data.info({
          projectId: "project-id",
          branchId: "branch-id",
          fileId: "file-id",
          sha: "sha"
        });

        expect(response).toEqual({
          projectId: "project-id",
          branchId: "branch-id",
          fileId: "file-id",
          sha: "sha",
          layerStyles: [],
          textStyles: [{ styleName: "Testing" }]
        });
      });
    });
  });
});
