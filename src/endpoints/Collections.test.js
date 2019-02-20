// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";

describe("#create", () => {
  test("api", async () => {
    mockAPI(
      "/projects/project/collections",
      { data: { id: "1337" } },
      201,
      "post"
    );
    const response = await API_CLIENT.collections.create(
      { projectId: "project" },
      {
        branchId: "branch",
        name: "collection"
      }
    );
    expect(response).toEqual({ id: "1337" });
  });
});

describe("#info", () => {
  test("api", async () => {
    mockAPI(
      "/projects/project/collections/collection?layersPerCollection=all",
      {
        data: {
          collections: [{ id: "1337" }]
        }
      }
    );
    const response = await API_CLIENT.collections.info({
      branchId: "branch",
      collectionId: "collection",
      projectId: "project"
    });
    expect(response).toEqual({ collection: { id: "1337" } });
  });

  test("cli", async () => {
    mockCLI(["collection", "load", "project", "collection"], {
      collection: { id: "1337" }
    });
    const response = await CLI_CLIENT.collections.info({
      projectId: "project",
      branchId: "branch",
      collectionId: "collection"
    });

    expect(response).toEqual({ collection: { id: "1337" } });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/comments?branchId=branch&projectId=project&sha=sha", {
      data: { collections: [{ id: "1337" }] }
    });
    const response = await API_CLIENT.comments.list({
      projectId: "project",
      branchId: "branch",
      sha: "sha"
    });
    expect(response).toEqual({ collections: [{ id: "1337" }] });
  });

  test("cli", async () => {
    mockCLI(["collections", "project", "--branch", "branch"], {
      collections: [{ id: "1337" }]
    });
    const response = await CLI_CLIENT.collections.list({
      projectId: "project",
      branchId: "branch"
    });

    expect(response).toEqual({ collections: [{ id: "1337" }] });
  });
});
