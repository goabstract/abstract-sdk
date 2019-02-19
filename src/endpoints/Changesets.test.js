// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/projects/project/branches/branch/commits/sha/changeset", {
      changeset: { id: "1337" }
    });
    const response = await API_CLIENT.changesets.info({
      branchId: "branch",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual({ id: "1337" });
  });

  test("cli", async () => {
    mockCLI(["changeset", "project", "--commit", "sha", "--branch", "branch"], {
      id: "1337"
    });
    const response = await CLI_CLIENT.changesets.info({
      branchId: "branch",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual({ id: "1337" });
  });
});
