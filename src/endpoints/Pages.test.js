// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/projects/project-id/branches/branch-id/files/file-id/pages", {
      pages: [{ id: "page-id" }]
    });
    const response = await API_CLIENT.pages.info({
      branchId: "branch-id",
      fileId: "file-id",
      pageId: "page-id",
      projectId: "project-id",
      sha: "sha"
    });

    expect(response).toEqual({ id: "page-id" });
  });

  test("cli", async () => {
    mockCLI(["files", "project-id", "sha"], {
      pages: [{ id: "page-id" }]
    });
    const response = await CLI_CLIENT.pages.info({
      branchId: "branch-id",
      fileId: "file-id",
      pageId: "page-id",
      projectId: "project-id",
      sha: "sha"
    });

    expect(response).toEqual({ id: "page-id" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/projects/project-id/branches/branch-id/files/file-id/pages", {
      pages: [{ id: "page-id" }]
    });
    const response = await API_CLIENT.pages.list({
      branchId: "branch-id",
      fileId: "file-id",
      projectId: "project-id",
      sha: "sha"
    });

    expect(response).toEqual([{ id: "page-id" }]);
  });

  test("cli", async () => {
    mockCLI(["files", "project-id", "sha"], {
      pages: [{ id: "page-id" }]
    });
    const response = await CLI_CLIENT.pages.list({
      branchId: "branch-id",
      fileId: "file-id",
      projectId: "project-id",
      sha: "sha"
    });

    expect(response).toEqual([{ id: "page-id" }]);
  });
});
