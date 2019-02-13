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
      .get("/projects/project")
      .reply(200, {
        data: { id: "1337" }
      });
    const response = await API_CLIENT.projects.info({ projectId: "project" });
    expect(response).toEqual({ id: "1337" });
  });
});

describe("#list", () => {
  test("api", async () => {
    nock("http://api")
      .get("/projects?filter=active&organizationId=org")
      .reply(200, { data: [] });
    const response = await API_CLIENT.projects.list(
      { organizationId: "org" },
      { filter: "active" }
    );
    expect(response).toEqual([]);
  });
});
