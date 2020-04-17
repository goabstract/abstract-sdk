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
      mockCLI(["branches", "get", "branch-id", "--project-id=project-id"], {
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

    test("api - pagination", async () => {
      mockAPI("/branches/?offset=5&limit=10", {
        data: {
          branches: [
            {
              id: "branch-id"
            }
          ]
        }
      });

      const response = await API_CLIENT.branches.list(undefined, {
        offset: 5,
        limit: 10
      });

      expect(response).toEqual([
        {
          id: "branch-id"
        }
      ]);
    });

    test("cli", async () => {
      mockCLI(["branches", "list", "--project-id=project-id"], {
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
        ["branches", "list", "--project-id=project-id", "--filter", "workedOn"],
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
          filter: "active"
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

  describe("mergeState", () => {
    test("api - without options", async () => {
      mockAPI("/projects/project-id/branches/branch-id/merge_state", {
        data: {
          state: "CLEAN"
        }
      });

      const response = await API_CLIENT.branches.mergeState({
        branchId: "branch-id",
        projectId: "project-id"
      });

      expect(response).toEqual({
        state: "CLEAN"
      });
    });

    test("api - with options", async () => {
      mockAPI("/projects/project-id/branches/branch-id/merge_state", {
        data: {
          state: "CLEAN"
        }
      });

      const response = await API_CLIENT.branches.mergeState(
        {
          branchId: "branch-id",
          projectId: "project-id"
        },
        {}
      );
      expect(response).toEqual({
        state: "CLEAN"
      });
    });

    test("api - with options and parent", async () => {
      mockAPI(
        "/projects/project-id/branches/branch-id/merge_state?parentId=parent-id",
        {
          data: {
            state: "CLEAN"
          }
        }
      );

      const response = await API_CLIENT.branches.mergeState(
        {
          branchId: "branch-id",
          projectId: "project-id"
        },
        { parentId: "parent-id" }
      );
      expect(response).toEqual({
        state: "CLEAN"
      });
    });

    test("cli", async () => {
      mockCLI(
        ["branches", "merge-state", "branch-id", "--project-id=project-id"],
        {
          data: {
            state: "CLEAN"
          }
        }
      );

      const response = await CLI_CLIENT.branches.mergeState({
        branchId: "branch-id",
        projectId: "project-id"
      });

      expect(response).toEqual({
        state: "CLEAN"
      });
    });
  });
});
