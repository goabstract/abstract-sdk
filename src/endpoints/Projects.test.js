// @flow
import { mockAPI, API_CLIENT } from "../../support/utils";

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
      data: []
    });
    const response = await API_CLIENT.projects.list(
      { organizationId: "org" },
      { filter: "active" }
    );
    expect(response).toEqual([]);
  });
});
