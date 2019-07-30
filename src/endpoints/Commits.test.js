// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/projects/project-id/branches/branch-id/commits/sha", {
      sha: "sha"
    });
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
  describe("api", () => {
    test("no options", async () => {
      mockAPI("/projects/project-id/branches/branch-id/commits", {
        commits: []
      });
      const response = await API_CLIENT.commits.list({
        projectId: "project-id",
        branchId: "branch-id"
      });

      expect(response).toEqual([]);
    });

    test("all options", async () => {
      mockAPI(
        "/projects/project-id/branches/branch-id/commits?endSHA=end-sha&fileId=file-id&layerId=layer-id&limit=10&startSHA=start-sha",
        {
          commits: []
        }
      );
      const response = await API_CLIENT.commits.list(
        {
          projectId: "project-id",
          branchId: "branch-id"
        },
        {
          fileId: "file-id",
          layerId: "layer-id",
          limit: 10,
          startSHA: "start-sha",
          endSHA: "end-sha"
        }
      );

      expect(response).toEqual([]);
    });
  });

  describe("cli", () => {
    test("no options", async () => {
      mockCLI(["commits", "project-id", "branch-id"], { commits: [] });
      const response = await CLI_CLIENT.commits.list({
        projectId: "project-id",
        branchId: "branch-id"
      });

      expect(response).toEqual([]);
    });

    test("all options", async () => {
      mockCLI(
        [
          "commits",
          "project-id",
          "branch-id",
          "--file-id",
          "file-id",
          "--layer-id",
          "layer-id",
          "--start-sha",
          "start-sha",
          "--end-sha",
          "end-sha",
          "--limit",
          "10"
        ],
        { commits: [] }
      );
      const response = await CLI_CLIENT.commits.list(
        {
          projectId: "project-id",
          branchId: "branch-id"
        },
        {
          fileId: "file-id",
          layerId: "layer-id",
          limit: 10,
          startSHA: "start-sha",
          endSHA: "end-sha"
        }
      );

      expect(response).toEqual([]);
    });
  });
});
