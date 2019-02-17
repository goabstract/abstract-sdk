// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/users/user", { id: "1337" });
    const response = await API_CLIENT.users.info({ userId: "user" });
    expect(response).toEqual({ id: "1337" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/projects/project/memberships", {
      data: [{ user: { id: "1337" } }]
    });
    const response = await API_CLIENT.users.list({ projectId: "project" });
    expect(response).toEqual([{ id: "1337" }]);
  });
});
