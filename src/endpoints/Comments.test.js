// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#create", () => {
  test("api", async () => {
    mockAPI("/projects/project-id/branches/branch-id", { name: "branch" });
    mockAPI("/comments", { id: "comment-id" }, 201, "post");
    const response = await API_CLIENT.comments.create(
      {
        projectId: "project-id",
        branchId: "branch-id",
        sha: "sha"
      },
      {
        body: "foo"
      }
    );
    expect(response).toEqual({ id: "comment-id" });
  });

  test("api - branch", async () => {
    mockAPI("/projects/project-id/branches/branch-id", { name: "branch" });
    mockAPI("/comments", { id: "comment-id" }, 201, "post");
    const response = await API_CLIENT.comments.create(
      {
        projectId: "project-id",
        branchId: "branch-id"
      },
      {
        body: "foo"
      }
    );
    expect(response).toEqual({ id: "comment-id" });
  });
});

describe("#info", () => {
  test("api", async () => {
    mockAPI("/comments/comment-id", { id: "comment-id" });
    const response = await API_CLIENT.comments.info({
      commentId: "comment-id"
    });
    expect(response).toEqual({ id: "comment-id" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/comments?branchId=branch-id&projectId=project-id&sha=sha", {
      data: [{ id: "comment-id" }]
    });
    const response = await API_CLIENT.comments.list({
      projectId: "project-id",
      branchId: "branch-id",
      sha: "sha"
    });
    expect(response).toEqual([{ id: "comment-id" }]);
  });
});
