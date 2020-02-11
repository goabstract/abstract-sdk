// @flow
import {
  EndpointUndefinedError,
  MultiError,
  NotFoundError
} from "../src/errors";
import {
  mockAPI,
  mockCLI,
  API_CLIENT,
  CLIENT_CONFIG,
  CLI_CLIENT
} from "../src/util/testing";
import type { AccessToken, RequestOptions } from "../src/types";

const Client = require("../src/Client").default;

describe("Client", () => {
  test("no transports specified", async () => {
    expect.assertions(1);

    try {
      await API_CLIENT.organizations.list({
        transportMode: []
      });
    } catch (error) {
      expect(error).toBeInstanceOf(EndpointUndefinedError);
    }
  });

  test("endpoint undefined in all transports", async () => {
    expect.assertions(2);

    try {
      await API_CLIENT.organizations.list({
        transportMode: ["cli"]
      });
    } catch (error) {
      expect(error).toBeInstanceOf(MultiError);
      expect(error.errors.cli).toBeInstanceOf(EndpointUndefinedError);
    }
  });

  test("all transports throw", async () => {
    mockAPI("/projects/project-id/branches/?", { ok: false }, 404);

    mockCLI(["branches", "list", "--project-id", "project-id"], undefined, {
      code: "not_found"
    });

    try {
      await API_CLIENT.branches.list(
        {
          projectId: "project-id"
        },
        {
          transportMode: ["api", "cli"]
        }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(MultiError);
      expect(error.errors.api).toBeInstanceOf(NotFoundError);
      expect(error.errors.cli).toBeInstanceOf(NotFoundError);
    }
  });

  test("attempts all transports in order", async () => {
    const apiRequestSpy = jest.spyOn(API_CLIENT.branches, "apiRequest");
    const cliRequestSpy = jest.spyOn(API_CLIENT.branches, "cliRequest");

    expect.assertions(5);

    mockAPI("/projects/project-id/branches/?", {
      data: {
        branches: [
          {
            id: "branch-id"
          }
        ]
      }
    });

    mockCLI(["branches", "list", "--project-id", "project-id"], undefined, {
      code: "not_found"
    });

    const response = await API_CLIENT.branches.list(
      {
        projectId: "project-id"
      },
      {
        transportMode: ["cli", "api"]
      }
    );

    expect(apiRequestSpy.mock.calls.length).toBe(1);
    expect(cliRequestSpy.mock.calls.length).toBe(1);

    expect(response).toEqual([
      {
        id: "branch-id"
      }
    ]);
  });

  test("shareDescriptor access token - api", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");

    const client = new Client({
      ...CLIENT_CONFIG,
      accessToken: { shareId: "share-id" }
    });

    mockAPI("/projects/project-id/branches/?", {
      data: {
        branches: [
          {
            id: "branch-id"
          }
        ]
      }
    });

    const response = await client.branches.list(
      {
        projectId: "project-id"
      },
      {
        transportMode: ["api"]
      }
    );

    expect(response).toEqual([
      {
        id: "branch-id"
      }
    ]);

    expect(fetchSpy.mock.calls.length).toBe(1);
    expect(fetchSpy.mock.calls[0][1].headers["Abstract-Share-Id"]).toBe(
      "share-id"
    );
  });

  test("shareDescriptor access token - cli", async () => {
    const client = new Client({
      ...CLIENT_CONFIG,
      accessToken: (() => ({ shareId: "share-id" }): () => AccessToken)
    });

    const spawnSpy = mockCLI(
      ["branches", "list", "--project-id", "project-id"],
      {
        branches: [
          {
            id: "branch-id"
          }
        ]
      }
    );

    const response = await client.branches.list(
      {
        projectId: "project-id"
      },
      {
        transportMode: ["cli"]
      }
    );

    expect(response).toEqual([
      {
        id: "branch-id"
      }
    ]);
    expect((spawnSpy: any).mock.calls.length).toBe(1);
    expect((spawnSpy: any).mock.calls[0][1].includes("--user-token")).toBe(
      false
    );
  });

  test("undefined request options", async () => {
    mockAPI("/organizations", {
      data: [
        {
          id: "org-id"
        }
      ]
    });

    const response = await API_CLIENT.organizations.list(
      ((null: any): RequestOptions)
    );

    expect(response).toEqual([
      {
        id: "org-id"
      }
    ]);
  });

  test("CursorPromise transportMode", async () => {
    mockAPI("/activities?organizationId=org-id", {
      data: {
        activities: [
          {
            id: "activity-id"
          }
        ]
      }
    });

    const response = await CLI_CLIENT.activities.list(
      {
        organizationId: "org-id"
      },
      {
        transportMode: ["api"]
      }
    );

    expect(response).toEqual([
      {
        id: "activity-id"
      }
    ]);
  });

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

    expect(API_CLIENT.unwrap(response)).toEqual(rawResponse);
  });

  test("unwraps full response - no extra data (array)", async () => {
    const rawResponse = {
      id: "branch-id"
    };

    mockAPI("/projects/project-id/commits/123", rawResponse);

    const response = await API_CLIENT.commits.info({
      projectId: "project-id",
      sha: "123"
    });

    expect(API_CLIENT.unwrap(response)).toEqual(rawResponse);
  });

  test("unwraps full response - no extra data (object)", async () => {
    const rawResponse = [
      {
        id: "branch-id"
      }
    ];

    mockAPI("/projects/project-id/commits/123", rawResponse);

    const response = await API_CLIENT.commits.info({
      projectId: "project-id",
      sha: "123"
    });

    expect(API_CLIENT.unwrap(response)).toEqual(rawResponse);
  });
});
