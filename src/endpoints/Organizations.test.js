// @flow
import { mockAPI, API_CLIENT } from "../utils";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/organizations/org", {
      data: { id: "1337" }
    });
    const response = await API_CLIENT.organizations.info({
      organizationId: "org"
    });
    expect(response).toEqual({ id: "1337" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/organizations", { data: [{ id: "1337" }] });
    const response = await API_CLIENT.organizations.list();
    expect(response).toEqual([{ id: "1337" }]);
  });
});
