// @flow
import { mockAPI, API_CLIENT } from "../testing";

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
