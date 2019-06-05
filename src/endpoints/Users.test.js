// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/users/user-id", { id: "user-id" });
    const response = await API_CLIENT.users.info({ userId: "user-id" });
    expect(response).toEqual({ id: "user-id" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/projects/project-id/memberships", {
      data: [{ user: { id: "user-id" } }]
    });
    const response = await API_CLIENT.users.list({ projectId: "project-id" });
    expect(response).toEqual([{ id: "user-id" }]);
  });

  test("api - organization", async () => {
    mockAPI("/organizations/organization-id/memberships", {
      data: [{ user: { id: "user-id" } }]
    });
    const response = await API_CLIENT.users.list({
      organizationId: "organization-id"
    });
    expect(response).toEqual([{ id: "user-id" }]);
  });
});
