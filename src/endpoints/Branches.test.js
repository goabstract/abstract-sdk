// @flow
import Client from "../Client";
import { mockAPI, mockCLI } from "../../support/utils";

jest.mock("child_process");

let API_CLIENT;
let CLI_CLIENT;

beforeAll(() => {
  API_CLIENT = new Client({
    apiUrl: "http://api",
    transportMode: "api"
  });

  CLI_CLIENT = new Client({
    cliPath: ".",
    transportMode: "cli"
  });
});

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
      data: { branches: [] }
    });
    const response = await API_CLIENT.branches.list(
      { projectId: "project" },
      { filter: "mine" }
    );

    expect(response).toEqual([]);
  });

  test("cli", async () => {
    mockCLI(["branches", "project", "--filter", "mine"], { branches: [] });
    const response = await CLI_CLIENT.branches.list(
      { projectId: "project" },
      { filter: "mine" }
    );

    expect(response).toEqual([]);
  });
});
