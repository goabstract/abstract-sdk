// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI(
      "/projects/project/branches/branch/commits/sha/files/file/layers/layer/data",
      { layerId: "1337" }
    );
    const response = await API_CLIENT.data.info({
      branchId: "branch",
      fileId: "file",
      layerId: "layer",
      pageId: "page",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual({ layerId: "1337" });
  });

  test("cli", async () => {
    mockCLI(["layer", "data", "project", "sha", "file", "layer"], {
      layerId: "1337"
    });
    const response = await CLI_CLIENT.data.info({
      branchId: "branch",
      fileId: "file",
      layerId: "layer",
      pageId: "page",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual({ layerId: "1337" });
  });
});
