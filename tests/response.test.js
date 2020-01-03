// @flow
import { API_CLIENT, mockAPI } from "../src/util/testing";
import { unwrap } from "../src/response";

describe("response", () => {
  test("unwraps full response", async () => {
    const rawResponse = {
      data: {
        branches: [
          {
            id: "branch-id"
          }
        ]
      },
      policies: {}
    };

    mockAPI("/projects/project-id/branches/?", rawResponse);

    const response = await API_CLIENT.branches.list({
      projectId: "project-id"
    });

    expect(unwrap(response)).toEqual(rawResponse);
  });

  test("unwraps full response - no extra data (array)", async () => {
    const rawResponse = {
      id: "branch-id"
    };

    mockAPI("/projects/project-id/branches/branch-id", rawResponse);

    const response = await API_CLIENT.branches.info({
      branchId: "branch-id",
      projectId: "project-id"
    });

    expect(unwrap(response)).toEqual(rawResponse);
  });

  test("unwraps full response - no extra data (object)", async () => {
    const rawResponse = [
      {
        id: "branch-id"
      }
    ];

    mockAPI("/projects/project-id/branches/branch-id", rawResponse);

    const response = await API_CLIENT.branches.info({
      branchId: "branch-id",
      projectId: "project-id"
    });

    expect(unwrap(response)).toEqual(rawResponse);
  });
});
