// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/projects/project", {
      data: { id: "1337" }
    });
    const response = await API_CLIENT.projects.info({ projectId: "project" });
    expect(response).toEqual({ id: "1337" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/projects?filter=active&organizationId=org", {
      data: [{ id: "1337" }]
    });
    const response = await API_CLIENT.projects.list(
      { organizationId: "org" },
      { filter: "active" }
    );
    expect(response).toEqual([{ id: "1337" }]);
  });
});
