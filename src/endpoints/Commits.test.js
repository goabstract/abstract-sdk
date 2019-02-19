// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/projects/project/branches/branch/commits?fileId=file&limit=1", {
      commits: [{ id: "1337" }]
    });
    const response = await API_CLIENT.commits.info({
      projectId: "project",
      branchId: "branch",
      fileId: "file",
      sha: "sha"
    });

    expect(response).toEqual({ id: "1337" });
  });

  test("cli", async () => {
    mockCLI(["commit", "project", "sha"], { commit: { id: "1337" } });
    const response = await CLI_CLIENT.commits.info({
      projectId: "project",
      branchId: "branch",
      sha: "sha"
    });

    expect(response).toEqual({ id: "1337" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/projects/project/branches/branch/commits?fileId=file&limit=10", {
      commits: []
    });
    const response = await API_CLIENT.commits.list(
      { projectId: "project", branchId: "branch", fileId: "file", sha: "sha" },
      { limit: 10 }
    );

    expect(response).toEqual([]);
  });

  test("cli", async () => {
    mockCLI(
      ["commits", "project", "branch", "--file-id", "file", "--limit", "10"],
      { commits: [] }
    );
    const response = await CLI_CLIENT.commits.list(
      { projectId: "project", branchId: "branch", fileId: "file", sha: "sha" },
      { limit: 10 }
    );

    expect(response).toEqual([]);
  });
});
