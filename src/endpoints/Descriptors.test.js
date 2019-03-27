// @flow
import { mockAPI, mockCLI, API_CLIENT, CLI_CLIENT } from "../testing";

describe("getLatestDescriptor", () => {
  test("api", async () => {
    mockAPI(
      "/projects/project-id/branches/branch-id/commits?fileId=file-id&limit=1",
      {
        commits: [{ id: "commit-id" }]
      }
    );
    const response = await API_CLIENT.descriptors.getLatestDescriptor({
      projectId: "project-id",
      branchId: "branch-id",
      fileId: "file-id",
      sha: "sha"
    });

    expect(response).toEqual({
      branchId: "branch-id",
      fileId: "file-id",
      projectId: "project-id",
      sha: "sha"
    });
  });

  test("cli", async () => {
    mockCLI(
      [
        "commits",
        "project-id",
        "branch-id",
        "--file-id",
        "file-id",
        "--limit",
        "1"
      ],
      { commits: [{ id: "commit-id" }] }
    );
    const response = await CLI_CLIENT.descriptors.getLatestDescriptor({
      projectId: "project-id",
      branchId: "branch-id",
      fileId: "file-id",
      sha: "sha"
    });

    expect(response).toEqual({
      branchId: "branch-id",
      fileId: "file-id",
      projectId: "project-id",
      sha: "sha"
    });
  });
});
