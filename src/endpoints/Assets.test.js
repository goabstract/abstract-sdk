// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/projects/project/assets/asset", { id: "1337" });
    const response = await API_CLIENT.assets.info({
      assetId: "asset",
      projectId: "project"
    });
    expect(response).toEqual({ id: "1337" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/projects/project/assets?sha=sha", {
      data: {
        assets: [{ id: "1337" }]
      }
    });
    const response = await API_CLIENT.assets.list({
      branchId: "master",
      projectId: "project",
      sha: "sha"
    });
    expect(response).toEqual([{ id: "1337" }]);
  });
});
