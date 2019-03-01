// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/projects/project-id/branches/branch-id/commits/sha/changeset", {
      changeset: { id: "changeset-id" }
    });
    const response = await API_CLIENT.changesets.info({
      branchId: "branch-id",
      projectId: "project-id",
      sha: "sha"
    });

    expect(response).toEqual({ id: "changeset-id" });
  });

  test("cli", async () => {
    mockCLI(
      ["changeset", "project-id", "--commit", "sha", "--branch", "branch-id"],
      {
        id: "changeset-id"
      }
    );
    const response = await CLI_CLIENT.changesets.info({
      branchId: "branch-id",
      projectId: "project-id",
      sha: "sha"
    });

    expect(response).toEqual({ id: "changeset-id" });
  });
});
