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
  });
});
