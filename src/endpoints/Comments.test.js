// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#create", () => {
  test("api", async () => {
    mockAPI("/projects/project/branches/branch", { name: "branch" });
    mockAPI("/comments", { id: "1337" }, 201, "post");
    const response = await API_CLIENT.comments.create(
      {
        projectId: "project",
        branchId: "branch",
        sha: "sha"
      },
      {
        body: "foo"
      }
    );
    expect(response).toEqual({ id: "1337" });
  });
});

describe("#info", () => {
  test("api", async () => {
    mockAPI("/comments/comment", { id: "1337" });
    const response = await API_CLIENT.comments.info({
      commentId: "comment"
    });
    expect(response).toEqual({ id: "1337" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/comments?branchId=branch&projectId=project&sha=sha", {
      data: [{ id: "1337" }]
    });
    const response = await API_CLIENT.comments.list({
      projectId: "project",
      branchId: "branch",
      sha: "sha"
    });
    expect(response).toEqual([{ id: "1337" }]);
  });
});
