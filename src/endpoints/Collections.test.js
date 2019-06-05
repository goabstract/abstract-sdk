// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";

describe("#create", () => {
  test("api", async () => {
    mockAPI(
      "/projects/project-id/collections",
      { data: { id: "collection-id" } },
      201,
      "post"
    );
    const response = await API_CLIENT.collections.create(
      { projectId: "project-id" },
      {
        branchId: "branch",
        name: "collection"
      }
    );
    expect(response).toEqual({ id: "collection-id" });
  });
});

describe("#info", () => {
  test("api", async () => {
    mockAPI(
      "/projects/project-id/collections/collection-id?layersPerCollection=all",
      {
        data: {
          collections: [{ id: "collection-id" }]
        }
      }
    );
    const response = await API_CLIENT.collections.info({
      collectionId: "collection-id",
      projectId: "project-id"
    });
    expect(response).toEqual({ collection: { id: "collection-id" } });
  });

  test("cli", async () => {
    mockCLI(["collection", "load", "project-id", "collection-id"], {
      collection: { id: "collection-id" }
    });
    const response = await CLI_CLIENT.collections.info({
      projectId: "project-id",
      collectionId: "collection-id"
    });

    expect(response).toEqual({ collection: { id: "collection-id" } });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/projects/project-id/collections?branchId=branch-id", {
      data: { collections: [{ id: "collection-id" }] }
    });
    const response = await API_CLIENT.collections.list({
      projectId: "project-id",
      branchId: "branch-id"
    });
    expect(response).toEqual({ collections: [{ id: "collection-id" }] });
  });

  test("cli", async () => {
    mockCLI(["collections", "project-id", "--branch", "branch-id"], {
      collections: [{ id: "collection-id" }]
    });
    const response = await CLI_CLIENT.collections.list({
      projectId: "project-id",
      branchId: "branch-id"
    });

    expect(response).toEqual({ collections: [{ id: "collection-id" }] });
  });

  test("cli - no branch id", async () => {
    mockCLI(["collections", "project-id"], {
      collections: [{ id: "collection-id" }]
    });

    const response = await CLI_CLIENT.collections.list({
      projectId: "project-id"
    });

    expect(response).toEqual({ collections: [{ id: "collection-id" }] });
  });
});

describe("#update", () => {
  test("api", async () => {
    mockAPI(
      "/projects/project-id/collections/collection-id",
      { data: { id: "collection-id" } },
      204,
      "put"
    );
    const response = await API_CLIENT.collections.update(
      {
        collectionId: "collection-id",
        projectId: "project-id"
      },
      {
        branchId: "branch",
        name: "collection"
      }
    );
    expect(response).toEqual({ id: "collection-id" });
  });
});
