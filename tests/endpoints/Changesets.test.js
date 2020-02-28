// @flow
import {
  mockAPI,
  mockCLI,
  API_CLIENT,
  CLI_CLIENT
} from "../../src/util/testing";

describe("commit", () => {
  test("api", async () => {
    mockAPI("/projects/project-id/branches/branch-id/commits/sha/changeset", {
      changeset: {
        id: "changeset-id"
      }
    });

    const response = await API_CLIENT.changesets.commit({
      branchId: "branch-id",
      projectId: "project-id",
      sha: "sha"
    });

    expect(response).toEqual({
      id: "changeset-id"
    });
  });

  test("cli", async () => {
    mockCLI(["commits", "changeset", "sha", "--project-id=project-id"], {
      changeset: {
        id: "changeset-id"
      }
    });

    const response = await CLI_CLIENT.changesets.commit({
      branchId: "branch-id",
      projectId: "project-id",
      sha: "sha"
    });

    expect(response).toEqual({
      id: "changeset-id"
    });
  });
});

describe("branch", () => {
  test("api", async () => {
    mockAPI("/projects/project-id/branches/branch-id/changeset", {
      changeset: {
        id: "changeset-id"
      }
    });

    const response = await API_CLIENT.changesets.branch({
      branchId: "branch-id",
      projectId: "project-id"
    });

    expect(response).toEqual({
      id: "changeset-id"
    });
  });

  test("cli", async () => {
    mockCLI(["branches", "changeset", "branch-id", "--project-id=project-id"], {
      changeset: {
        id: "changeset-id"
      }
    });

    const response = await CLI_CLIENT.changesets.branch({
      branchId: "branch-id",
      projectId: "project-id"
    });

    expect(response).toEqual({
      id: "changeset-id"
    });
  });
});
