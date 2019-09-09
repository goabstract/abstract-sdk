// @flow
import { mockAPI, mockAssetAPI, API_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/projects/project-id/assets/asset-id", { id: "asset-id" });
    const response = await API_CLIENT.assets.info({
      assetId: "asset-id",
      projectId: "project-id"
    });
    expect(response).toEqual({ id: "asset-id" });
  });
});

let globalProcess;

describe("#raw", () => {
  beforeAll(() => {
    globalProcess = global.process;
  });

  afterAll(() => {
    global.process = globalProcess;
  });

  test("api", async () => {
    mockAPI("/projects/project-id/assets/asset-id", {
      url: "https://objects.goabstract.com/foo"
    });
    mockAssetAPI("/foo", { id: "asset-id" });
    const response = await API_CLIENT.assets.raw(
      {
        assetId: "asset-id",
        projectId: "project-id"
      },
      { disableWrite: true }
    );
    expect(response).toBeInstanceOf(ArrayBuffer);
  });

  test("api - browser", async () => {
    global.process = {
      ...global.process,
      versions: undefined
    };
    mockAPI("/projects/project-id/assets/asset-id", {
      url: "https://objects.goabstract.com/foo"
    });
    mockAssetAPI("/foo", { id: "asset-id" });
    const response = await API_CLIENT.assets.raw({
      assetId: "asset-id",
      projectId: "project-id"
    });
    expect(response).toBeInstanceOf(ArrayBuffer);
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/projects/project-id/assets?sha=sha", {
      data: {
        assets: [{ id: "asset-id" }]
      }
    });
    const response = await API_CLIENT.assets.list({
      branchId: "branch-id",
      projectId: "project-id",
      sha: "sha"
    });
    expect(response).toEqual([{ id: "asset-id" }]);
  });
});
