// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/organizations/org-id", {
      data: { id: "org-id" }
    });
    const response = await API_CLIENT.organizations.info({
      organizationId: "org-id"
    });
    expect(response).toEqual({ id: "org-id" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/organizations", { data: [{ id: "org-id" }] });
    const response = await API_CLIENT.organizations.list();
    expect(response).toEqual([{ id: "org-id" }]);
  });
});
