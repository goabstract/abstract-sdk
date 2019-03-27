// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#create", () => {
  test("api", async () => {
    mockAPI("/share_links", { id: "share-id" }, 201, "post");
    const response = await API_CLIENT.shares.create(
      { organizationId: "org" },
      {
        kind: "project",
        organizationId: "org-id",
        projectId: "project-id"
      }
    );
    expect(response).toEqual({ id: "share-id" });
  });
});

describe("#info", () => {
  test("api", async () => {
    mockAPI("/share_links/share-id", { id: "share-id" });
    const response = await API_CLIENT.shares.info({
      shareId: "share-id"
    });
    expect(response).toEqual({ id: "share-id" });
  });
});
