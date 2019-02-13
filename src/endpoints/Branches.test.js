// @flow
import nock from "nock";
import Client from "../Client";

let API_CLIENT;

beforeAll(() => {
  API_CLIENT = new Client({
    apiUrl: "http://api",
    transport: "api"
  });
});

describe("#info", () => {
  test("api", async () => {
    nock("http://api")
      .get("/projects/project/branches/branch")
      .reply(200, { id: "1337" });

    const response = await API_CLIENT.branches.info({
      branchId: "branch",
      projectId: "project",
      sha: "sha"
    });

    expect(response).toEqual({ id: "1337" });
  });
});

describe("#list", () => {
  test("api", async () => {
    nock("http://api")
      .get("/projects/project/branches/?filter=mine")
      .reply(200, {
        data: {
          branches: []
        }
      });

    const response = await API_CLIENT.branches.list(
      {
        projectId: "project"
      },
      { filter: "mine" }
    );

    expect(response).toEqual([]);
  });
});
