// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";

jest.mock("child_process");

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

  test("cli", async () => {
    mockCLI(["file", "project", "sha", "file"], {
      pages: [{ id: "1337" }]
    });
    const response = await CLI_CLIENT.pages.info({
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

  test("cli", async () => {
    mockCLI(["file", "project", "sha", "file"], {
      pages: [{ id: "1337" }]
    });
    const response = await CLI_CLIENT.pages.list({
      branchId: "branch",
      fileId: "file",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual([{ id: "1337" }]);
  });
});
