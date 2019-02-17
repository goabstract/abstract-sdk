// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";

jest.mock("child_process");

describe("#info", () => {
  test("api", async () => {
    mockAPI(
      "/projects/project/branches/branch/commits/sha/files/file/layers/layer",
      {
        layer: { id: "1337" }
      }
    );
    const response = await API_CLIENT.layers.info({
      branchId: "branch",
      fileId: "file",
      layerId: "layer",
      pageId: "page",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual({ id: "1337" });
  });

  test("cli", async () => {
    mockCLI(["layer", "meta", "project", "sha", "file", "layer"], {
      layer: { id: "1337" }
    });
    const response = await CLI_CLIENT.layers.info({
      branchId: "branch",
      fileId: "file",
      layerId: "layer",
      pageId: "page",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual({ id: "1337" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI(
      "/projects/project/branches/branch/files/file/layers?branchId=branch&fileId=file&pageId=page&projectId=project&sha=sha",
      {
        layers: [{ id: "1337" }]
      }
    );
    const response = await API_CLIENT.layers.list({
      branchId: "branch",
      fileId: "file",
      pageId: "page",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual([{ id: "1337" }]);
  });

  test("cli", async () => {
    mockCLI(["layers", "project", "sha", "file"], { layers: [{ id: "1337" }] });
    const response = await CLI_CLIENT.layers.list({
      branchId: "branch",
      fileId: "file",
      pageId: "page",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual([{ id: "1337" }]);
  });
});
