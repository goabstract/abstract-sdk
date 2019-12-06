// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "@core/util/testing";

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
    mockCLI(
      ["changeset", "project-id", "--commit", "sha", "--branch", "branch-id"],
      {
        changeset: {
          id: "changeset-id"
        }
      }
    );

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
    mockCLI(["changeset", "project-id", "--branch", "branch-id"], {
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
