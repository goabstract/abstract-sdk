// @flow
import { API_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    const response = await API_CLIENT.previews.info({
      branchId: "branch",
      fileId: "file",
      layerId: "layer",
      pageId: "page",
      projectId: "project",
      sha: "sha"
    });
    expect(response).toEqual({
      webUrl:
        "https://app.goabstract.com/projects/project/commits/sha/files/file/layers/layer"
    });
  });
});
