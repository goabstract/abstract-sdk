// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/projects/project/branches/branch/files/file/pages", {
      pages: [{ id: "1337" }]
    });
    const response = await API_CLIENT.pages.info({
      branchId: "branch",
      fileId: "file",
      pageId: "1337",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual({ id: "1337" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/projects/project/branches/branch/files/file/pages", {
      pages: [{ id: "1337" }]
    });
    const response = await API_CLIENT.pages.list({
      branchId: "branch",
      fileId: "file",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual([{ id: "1337" }]);
  });
});
