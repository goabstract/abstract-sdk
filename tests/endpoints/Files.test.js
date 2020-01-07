// @flow
import {
  mockAssetAPI,
  mockAPI,
  mockCLI,
  API_CLIENT,
  CLI_CLIENT
} from "../../src/util/testing";
import { NotFoundError, FileExportError } from "../../src/errors";

describe("files", () => {
  describe("info", () => {
    test("api", async () => {
      mockAPI("/projects/project-id/branches/branch-id/files", {
        files: [
          {
            id: "file-id"
          }
        ]
      });

      const response = await API_CLIENT.files.info({
        branchId: "branch-id",
        fileId: "file-id",
        projectId: "project-id",
        sha: "sha"
      });

      expect(response).toEqual({
        id: "file-id"
      });
    });

    test("api - not found", async () => {
      mockAPI("/projects/project-id/branches/branch-id/files", {
        files: [
          {
            id: "not-found"
          }
        ]
      });

      try {
        await API_CLIENT.files.info({
          branchId: "branch-id",
          fileId: "file-id",
          projectId: "project-id",
          sha: "sha"
        });
      } catch (error) {
        expect(error.errors.api).toBeInstanceOf(NotFoundError);
      }
    });

    test("cli", async () => {
      mockCLI(["file", "project-id", "sha", "file-id"], {
        file: {
          id: "file-id"
        }
      });

      const response = await CLI_CLIENT.files.info({
        branchId: "branch-id",
        fileId: "file-id",
        projectId: "project-id",
        sha: "sha"
      });

      expect(response).toEqual({
        id: "file-id"
      });
    });
  });

  describe("list", () => {
    test("api", async () => {
      mockAPI("/projects/project-id/branches/branch-id/files", {
        files: [
          {
            id: "file-id"
          }
        ]
      });

      const response = await API_CLIENT.files.list({
        branchId: "branch-id",
        projectId: "project-id",
        sha: "sha"
      });

      expect(response).toEqual([
        {
          id: "file-id"
        }
      ]);
    });

    test("cli", async () => {
      mockCLI(["files", "project-id", "sha"], {
        files: [
          {
            id: "file-id"
          }
        ]
      });

      const response = await CLI_CLIENT.files.list({
        branchId: "branch-id",
        projectId: "project-id",
        sha: "sha"
      });

      expect(response).toEqual([
        {
          id: "file-id"
        }
      ]);
    });
  });

  describe("raw", () => {
    let globalProcess;
    let globalSetTimeout;

    beforeEach(() => {
      globalProcess = global.process;
      globalSetTimeout = global.setTimeout;
    });

    afterEach(() => {
      global.process = globalProcess;
      global.setTimeout = globalSetTimeout;
    });

    test("api - node", async () => {
      mockAPI("/projects/project-id/branches/branch-id/files", {
        files: [
          {
            id: "file-id"
          }
        ]
      });

      [...Array(2)].map(() => {
        mockAPI(
          "/projects/project-id/branches/branch-id/files/file-id/export",
          {
            id: "export-id",
            status: "processing"
          },
          200,
          "post"
        );
      });

      mockAPI(
        "/projects/project-id/branches/branch-id/files/file-id/export",
        {
          downloadUrl: "https://objects.goabstract.com/file",
          status: "complete"
        },
        200,
        "post"
      );

      mockAssetAPI("/file", {
        id: "file-id"
      });

      const response = await API_CLIENT.files.raw(
        {
          branchId: "branch-id",
          fileId: "file-id",
          projectId: "project-id",
          sha: "sha"
        },
        {
          disableWrite: true
        }
      );

      expect(response).toBeInstanceOf(ArrayBuffer);
    });

    test("api - max duration", async () => {
      global.setTimeout = cb => {
        cb();
      };
      mockAPI("/projects/project-id/branches/branch-id/files", {
        files: [
          {
            id: "file-id"
          }
        ]
      });

      [...Array(20)].map(() => {
        mockAPI(
          "/projects/project-id/branches/branch-id/files/file-id/export",
          {
            id: "export-id",
            status: "processing"
          },
          200,
          "post"
        );
      });

      try {
        await API_CLIENT.files.raw({
          branchId: "branch-id",
          fileId: "file-id",
          projectId: "project-id",
          sha: "sha"
        });
      } catch (error) {
        expect(error.errors.api).toBeInstanceOf(FileExportError);
      }
    });

    test("cli - exports file", async () => {
      mockCLI(
        [
          "file",
          "export",
          "file-id",
          "filename",
          "--project-id=project-id",
          "--branch-id=branch-id",
          "--sha=sha"
        ],
        {
          file: {
            id: "file-id"
          }
        }
      );

      await CLI_CLIENT.files.raw(
        {
          branchId: "branch-id",
          fileId: "file-id",
          projectId: "project-id",
          sha: "sha"
        },
        {
          filename: "filename"
        }
      );
    });

    test("cli - uses cwd", async () => {
      mockCLI(
        [
          "file",
          "export",
          "file-id",
          "cwd",
          "--project-id=project-id",
          "--branch-id=branch-id",
          "--sha=sha"
        ],
        {
          file: {
            id: "file-id"
          }
        }
      );

      (process: any).cwd = () => "cwd";

      await CLI_CLIENT.files.raw({
        branchId: "branch-id",
        fileId: "file-id",
        projectId: "project-id",
        sha: "sha"
      });
    });
  });
});
