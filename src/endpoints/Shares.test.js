// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#create", () => {
  test("api", async () => {
    mockAPI("/share_links", { id: "share" }, 201, "post");
    const response = await API_CLIENT.shares.create(
      { organizationId: "org" },
      {
        kind: "project",
        organizationId: "org",
        projectId: "project"
      }
    );
    expect(response).toEqual({ id: "share" });
  });
});

describe("#info", () => {
  test("api", async () => {
    mockAPI("/share_links/share", { id: "share" });
    const response = await API_CLIENT.shares.info({
      shareId: "share"
    });
    expect(response).toEqual({ id: "share" });
  });
});
