// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI(
      "/projects/project-id/branches/branch-id/commits?limit=1&startSha=sha",
      {
        commits: [{ sha: "sha" }]
      }
    );
    const response = await API_CLIENT.commits.info({
      projectId: "project-id",
      branchId: "branch-id",
      sha: "sha"
    });

    expect(response).toEqual({ sha: "sha" });
  });

  test("cli", async () => {
    mockCLI(["commit", "project-id", "sha"], { commit: { id: "commit-id" } });
    const response = await CLI_CLIENT.commits.info({
      projectId: "project-id",
      branchId: "branch-id",
      sha: "sha"
    });

    expect(response).toEqual({ id: "commit-id" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI(
      "/projects/project-id/branches/branch-id/commits?fileId=file-id&limit=10",
      {
        commits: []
      }
    );
    const response = await API_CLIENT.commits.list(
      {
        projectId: "project-id",
        branchId: "branch-id",
        fileId: "file-id",
        sha: "sha"
      },
      { limit: 10 }
    );

    expect(response).toEqual([]);
  });

  test("cli", async () => {
    mockCLI(
      [
        "commits",
        "project-id",
        "branch-id",
        "--file-id",
        "file-id",
        "--limit",
        "10"
      ],
      { commits: [] }
    );
    const response = await CLI_CLIENT.commits.list(
      {
        projectId: "project-id",
        branchId: "branch-id",
        fileId: "file-id",
        sha: "sha"
      },
      { limit: 10 }
    );

    expect(response).toEqual([]);
  });
});
