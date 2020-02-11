// @flow
import {
  mockAPI,
  mockCLI,
  API_CLIENT,
  CLI_CLIENT
} from "../../src/util/testing";
import { BranchSearchCLIError } from "../../src/errors";

describe("branches", () => {
  describe("info", () => {
    test("api", async () => {
      mockAPI("/projects/project-id/branches/branch-id", {
        data: {
          id: "branch-id"
        }
      });

      const response = await API_CLIENT.branches.info({
        branchId: "branch-id",
        projectId: "project-id"
      });

      expect(response).toEqual({
        id: "branch-id"
      });
    });

    test("cli", async () => {
      mockCLI(["branches", "get", "branch-id", "--project-id", "project-id"], {
        id: "branch-id"
      });

      const response = await CLI_CLIENT.branches.info({
        branchId: "branch-id",
        projectId: "project-id"
      });

      expect(response).toEqual({
        id: "branch-id"
      });
    });
  });

  describe("list", () => {
    test("api", async () => {
      mockAPI("/projects/project-id/branches/?", {
        data: {
          branches: [
            {
              id: "branch-id"
            }
          ]
        }
      });

      const response = await API_CLIENT.branches.list({
        projectId: "project-id"
      });

      expect(response).toEqual([
        {
          id: "branch-id"
        }
      ]);
    });

    test("api - filter", async () => {
      mockAPI("/projects/project-id/branches/?filter=mine", {
        data: {
          branches: [
            {
              id: "branch-id"
            }
          ]
        }
      });

      const response = await API_CLIENT.branches.list(
        {
          projectId: "project-id"
        },
        {
          filter: "mine"
        }
      );

      expect(response).toEqual([
        {
          id: "branch-id"
        }
      ]);
    });

    test("api - list", async () => {
      mockAPI("/branches/?search=foo", {
        data: {
          branches: [
            {
              id: "branch-id"
            }
          ]
        }
      });

      const response = await API_CLIENT.branches.list(undefined, {
        search: "foo"
      });

      expect(response).toEqual([
        {
          id: "branch-id"
        }
      ]);
    });

    test("cli", async () => {
      mockCLI(["branches", "list", "--project-id", "project-id"], {
        branches: [
          {
            id: "branch-id"
          }
        ]
      });

      const response = await CLI_CLIENT.branches.list({
        projectId: "project-id"
      });

      expect(response).toEqual([
        {
          id: "branch-id"
        }
      ]);
    });

    test("cli - filter", async () => {
      mockCLI(
        ["branches", "list", "--project-id", "project-id", "--filter", "mine"],
        {
          branches: [
            {
              id: "branch-id"
            }
          ]
        }
      );

      const response = await CLI_CLIENT.branches.list(
        {
          projectId: "project-id"
        },
        {
          filter: "mine"
        }
      );

      expect(response).toEqual([
        {
          id: "branch-id"
        }
      ]);
    });

    test("cli - no descriptor", async () => {
      try {
        await CLI_CLIENT.branches.list(undefined);
      } catch (error) {
        expect(error.errors.cli).toBeInstanceOf(BranchSearchCLIError);
      }
    });
  });
});
