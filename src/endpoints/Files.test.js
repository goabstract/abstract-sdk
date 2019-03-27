// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/projects/project-id/branches/branch-id/files", {
      files: [{ id: "file-id" }]
    });
    const response = await API_CLIENT.files.info({
      branchId: "branch-id",
      fileId: "file-id",
      projectId: "project-id",
      sha: "sha"
    });

    expect(response).toEqual({ id: "file-id" });
  });

  test("cli", async () => {
    mockCLI(["file", "project-id", "sha", "file-id"], {
      file: { id: "file-id" }
    });
    const response = await CLI_CLIENT.files.info({
      branchId: "branch-id",
      fileId: "file-id",
      projectId: "project-id",
      sha: "sha"
    });

    expect(response).toEqual({ id: "file-id" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/projects/project-id/branches/branch-id/files", {
      files: [{ id: "file-id" }]
    });
    const response = await API_CLIENT.files.list({
      branchId: "branch-id",
      projectId: "project-id",
      sha: "sha"
    });

    expect(response).toEqual([{ id: "file-id" }]);
  });

  test("cli", async () => {
    mockCLI(["files", "project-id", "sha"], { files: [{ id: "file-id" }] });
    const response = await CLI_CLIENT.files.list({
      branchId: "branch-id",
      projectId: "project-id",
      sha: "sha"
    });

    expect(response).toEqual([{ id: "file-id" }]);
  });
});
