// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/projects/project-id", {
      data: { id: "project-id" }
    });
    const response = await API_CLIENT.projects.info({
      projectId: "project-id"
    });
    expect(response).toEqual({ id: "project-id" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/projects?filter=active&organizationId=org-id", {
      data: [{ id: "project-id" }]
    });
    const response = await API_CLIENT.projects.list(
      { organizationId: "org-id" },
      { filter: "active" }
    );
    expect(response).toEqual([{ id: "project-id" }]);
  });
});
