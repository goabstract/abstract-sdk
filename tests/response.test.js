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
});
