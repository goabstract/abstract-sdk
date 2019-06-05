// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";
import { NotFoundError } from "../errors";

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

  test("api - not found", async () => {
    mockAPI("/projects/project-id/branches/branch-id/files", {
      files: [{ id: "not-found" }]
    });
    try {
      await API_CLIENT.files.info({
        branchId: "branch-id",
        fileId: "file-id",
        projectId: "project-id",
        sha: "sha"
      });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
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

let globalProcess;

describe("#raw", () => {
  beforeAll(() => {
    globalProcess = global.process;
  });

  afterAll(() => {
    global.process = globalProcess;
  });

  test("cli", async () => {
    mockCLI(
      [
        "file",
        "export",
        "file-id",
        "filename",
        "--project-id=project-id",
        "--branch-id=branch-id",
        "--sha=sha"
      ],
      {
        file: { id: "file-id" }
      }
    );

    await CLI_CLIENT.files.raw(
      {
        branchId: "branch-id",
        fileId: "file-id",
        projectId: "project-id",
        sha: "sha"
      },
      {
        filename: "filename"
      }
    );
  });

  test("cli - uses cwd", async () => {
    mockCLI(
      [
        "file",
        "export",
        "file-id",
        "cwd",
        "--project-id=project-id",
        "--branch-id=branch-id",
        "--sha=sha"
      ],
      {
        file: { id: "file-id" }
      }
    );

    (process: any).cwd = () => "cwd";

    await CLI_CLIENT.files.raw({
      branchId: "branch-id",
      fileId: "file-id",
      projectId: "project-id",
      sha: "sha"
    });
  });
});
