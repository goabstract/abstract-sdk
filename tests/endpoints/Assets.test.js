// @flow
import {
  mockObjectAPI,
  mockAPI,
  mockCLI,
  API_CLIENT,
  CLI_CLIENT
} from "../../src/util/testing";

describe("assets", () => {
  describe("info", () => {
    test("api", async () => {
      mockAPI("/projects/project-id/assets/asset-id", {
        id: "asset-id"
      });

      const response = await API_CLIENT.assets.info({
        assetId: "asset-id",
        projectId: "project-id"
      });

      expect(response).toEqual({
        id: "asset-id"
      });
    });
  });

  describe("raw", () => {
    let globalProcess;

    beforeAll(() => {
      globalProcess = global.process;
    });

    afterAll(() => {
      global.process = globalProcess;
    });

    test("api - node", async () => {
      mockAPI("/projects/project-id/assets/asset-id", {
        url: "https://objects.goabstract.com/foo"
      });

      mockObjectAPI("/foo", {
        id: "asset-id"
      });

      const response = await API_CLIENT.assets.raw(
        {
          assetId: "asset-id",
          projectId: "project-id"
        },
        {
          disableWrite: true
        }
      );

      expect(response).toBeInstanceOf(ArrayBuffer);

      // test("cli", async () => {
      //   mockCLI(["assets", "download", "--urls=url", "--filenames=filename"], {
      //     success: true
      //   });

      //   const response = await CLI_CLIENT.assets.raw({
      //     url: "url",
      //     filename: "filename"
      //   });

      //   expect(response).toEqual({
      //     success: true
      //   });
      // });
    });

    test("api - browser", async () => {
      global.process = {
        ...global.process,
        versions: undefined
      };

      mockAPI("/projects/project-id/assets/asset-id", {
        url: "https://objects.goabstract.com/foo"
      });

      mockObjectAPI("/foo", {
        id: "asset-id"
      });

      const response = await API_CLIENT.assets.raw({
        assetId: "asset-id",
        projectId: "project-id"
      });

      expect(response).toBeInstanceOf(ArrayBuffer);
    });
  });

  describe("commit", () => {
    test("api", async () => {
      mockAPI("/projects/project-id/assets?sha=sha", {
        data: {
          assets: [
            {
              id: "asset-id"
            }
          ]
        }
      });

      const response = await API_CLIENT.assets.commit({
        branchId: "branch-id",
        projectId: "project-id",
        sha: "sha"
      });

      expect(response).toEqual([
        {
          id: "asset-id"
        }
      ]);
    });
  });

  describe("file", () => {
    test("api", async () => {
      mockAPI(
        "/projects/project-id/branches/branch-id/files/file-id/assets?sha=sha",
        {
          data: [
            {
              id: "asset-id"
            }
          ]
        }
      );

      const response = await API_CLIENT.assets.file({
        branchId: "branch-id",
        projectId: "project-id",
        sha: "sha",
        fileId: "file-id"
      });

      expect(response).toEqual([
        {
          id: "asset-id"
        }
      ]);
    });
  });

  describe("hasChanges", () => {
    test("cli", async () => {
      mockCLI(
        ["assets", "has-changes", "--project-id=project-id", "--sha=sha"],
        {
          hasChangedAssets: false
        }
      );

      const response = await CLI_CLIENT.assets.hasChanges({
        projectId: "project-id",
        sha: "sha"
      });

      expect(response).toEqual({
        hasChangedAssets: false
      });
    });
  });
});
