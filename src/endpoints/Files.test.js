// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";

jest.mock("child_process");

describe("#info", () => {
  test("api", async () => {
    mockAPI("/projects/project/branches/branch/files", { files: [{ id: "1337" }] });
    const response = await API_CLIENT.files.info({
      branchId: "branch",
      fileId: "1337",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual({ id: "1337" });
  });

  test("cli", async () => {
    mockCLI(["file", "project", "sha", "1337"], {
      file: { id: "1337" }
    });
    const response = await CLI_CLIENT.files.info({
      branchId: "branch",
      fileId: "1337",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual({ id: "1337" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/projects/project/branches/branch/files", { files: [{ id: "1337" }] });
    const response = await API_CLIENT.files.list({
      branchId: "branch",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual([{ id: "1337" }]);
  });

  test("cli", async () => {
    mockCLI(["files", "project", "sha"], { files: [{ id: "1337" }] });
    const response = await CLI_CLIENT.files.list({
      branchId: "branch",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual([{ id: "1337" }]);
  });
});
