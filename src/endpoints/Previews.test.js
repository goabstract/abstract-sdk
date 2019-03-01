// @flow
import { API_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    const response = await API_CLIENT.previews.info({
      branchId: "branch-id",
      fileId: "file-id",
      layerId: "layer-id",
      pageId: "page-id",
      projectId: "project-id",
      sha: "sha"
    });
    expect(response).toEqual({
      webUrl:
        "https://app.goabstract.com/projects/project-id/commits/sha/files/file-id/layers/layer-id"
    });
  });
});
