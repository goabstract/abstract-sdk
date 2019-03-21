// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";

describe("#info", () => {
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
    mockCLI(["layer", "data", "project-id", "sha", "file-id", "layer-id"], {
      layerId: "layer-id"
    });
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
