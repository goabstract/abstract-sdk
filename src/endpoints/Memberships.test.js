// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#info", () => {
  test("api - project", async () => {
    mockAPI("/projects/project-id/memberships/user-id", {
      data: {
        projectMembership: { userId: "user-id" }
      }
    });

    const response = await API_CLIENT.memberships.info({
      projectId: "project-id",
      userId: "user-id"
    });

    expect(response).toEqual({ userId: "user-id" });
  });

  test("api - organization", async () => {
    mockAPI("/organizations/org-id/memberships/user-id", {
      data: { userId: "user-id" }
    });

    const response = await API_CLIENT.memberships.info({
      organizationId: "org-id",
      userId: "user-id"
    });

    expect(response).toEqual({ userId: "user-id" });
  });
});

describe("#list", () => {
  test("api - project", async () => {
    mockAPI("/projects/project-id/memberships", {
      data: [{ userId: "user-id" }]
    });

    const response = await API_CLIENT.memberships.list({
      projectId: "project-id"
    });

    expect(response).toEqual([{ userId: "user-id" }]);
  });

  test("api - organization", async () => {
    mockAPI("/organizations/org-id/memberships", {
      data: [{ userId: "user-id" }]
    });

    const response = await API_CLIENT.memberships.list({
      organizationId: "org-id"
    });

    expect(response).toEqual([{ userId: "user-id" }]);
  });
});
