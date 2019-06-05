// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/projects/project-id/branches/branch-id", { id: "branch-id" });
    const response = await API_CLIENT.branches.info({
      branchId: "branch-id",
      projectId: "project-id"
    });

    expect(response).toEqual({ id: "branch-id" });
  });

  test("cli", async () => {
    mockCLI(["branch", "load", "project-id", "branch-id"], { id: "branch-id" });
    const response = await CLI_CLIENT.branches.info({
      branchId: "branch-id",
      projectId: "project-id"
    });

    expect(response).toEqual({ id: "branch-id" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/projects/project-id/branches/?", {
      data: { branches: [{ id: "branch-id" }] }
    });
    const response = await API_CLIENT.branches.list({
      projectId: "project-id"
    });
    expect(response).toEqual([{ id: "branch-id" }]);
  });

  test("api - filter", async () => {
    mockAPI("/projects/project-id/branches/?filter=mine", {
      data: { branches: [{ id: "branch-id" }] }
    });
    const response = await API_CLIENT.branches.list(
      { projectId: "project-id" },
      { filter: "mine" }
    );
    expect(response).toEqual([{ id: "branch-id" }]);
  });

  test("cli", async () => {
    mockCLI(["branches", "project-id"], {
      branches: [{ id: "branch-id" }]
    });
    const response = await CLI_CLIENT.branches.list({
      projectId: "project-id"
    });

    expect(response).toEqual([{ id: "branch-id" }]);
  });

  test("cli - filter", async () => {
    mockCLI(["branches", "project-id", "--filter", "mine"], {
      branches: [{ id: "branch-id" }]
    });
    const response = await CLI_CLIENT.branches.list(
      { projectId: "project-id" },
      { filter: "mine" }
    );

    expect(response).toEqual([{ id: "branch-id" }]);
  });
});
