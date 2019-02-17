// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";

jest.mock("child_process");

describe("#info", () => {
  test("api", async () => {
    mockAPI("/projects/project/branches/branch", { id: "1337" });
    const response = await API_CLIENT.branches.info({
      branchId: "branch",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual({ id: "1337" });
  });

  test("cli", async () => {
    mockCLI(["branch", "load", "project", "branch"], { id: "1337" });
    const response = await CLI_CLIENT.branches.info({
      branchId: "branch",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual({ id: "1337" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/projects/project/branches/?filter=mine", {
      data: { branches: [{ id: "1337" }] }
    });
    const response = await API_CLIENT.branches.list(
      { projectId: "project" },
      { filter: "mine" }
    );

    expect(response).toEqual([{ id: "1337" }]);
  });

  test("cli", async () => {
    mockCLI(["branches", "project", "--filter", "mine"], {
      branches: [{ id: "1337" }]
    });
    const response = await CLI_CLIENT.branches.list(
      { projectId: "project" },
      { filter: "mine" }
    );

    expect(response).toEqual([{ id: "1337" }]);
  });
});
