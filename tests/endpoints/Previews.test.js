// @flow
/* global Blob */
import { API_CLIENT, mockPreviewAPI } from "@core/util/testing";

describe("previews", () => {
  describe("info", () => {
    test("api", async () => {
      const response = await API_CLIENT.previews.info({
        branchId: "branch-id",
        fileId: "file-id",
        layerId: "layer-id",
        projectId: "project-id",
        sha: "sha"
      });

      expect(response).toEqual({
        webUrl:
          "https://app.goabstract.com/projects/project-id/commits/sha/files/file-id/layers/layer-id"
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

    test("api", async () => {
      mockPreviewAPI(
        "/projects/project-id/commits/sha/files/file-id/layers/layer-id",
        {}
      );

      const response = await API_CLIENT.previews.raw(
        {
          branchId: "branch-id",
          fileId: "file-id",
          layerId: "layer-id",
          projectId: "project-id",
          sha: "sha"
        },
        {
          disableWrite: true
        }
      );

      expect(response).toBeInstanceOf(ArrayBuffer);
    });

    test("api - browser", async () => {
      mockPreviewAPI(
        "/projects/project-id/commits/sha/files/file-id/layers/layer-id",
        {}
      );

      global.process = {
        ...global.process,
        versions: undefined
      };

      const response = await API_CLIENT.previews.raw({
        branchId: "branch-id",
        fileId: "file-id",
        layerId: "layer-id",
        projectId: "project-id",
        sha: "sha"
      });

      expect(response).toBeInstanceOf(ArrayBuffer);
    });
  });

  describe("url", () => {
    let globalProcess;
    let globalURL;

    beforeAll(() => {
      globalProcess = global.process;
      globalURL = global.URL;
    });

    afterAll(() => {
      global.process = globalProcess;
      global.URL = globalURL;
    });

    test("api - browser", async () => {
      mockPreviewAPI(
        "/projects/project-id/commits/sha/files/file-id/layers/layer-id",
        {}
      );

      global.process = {
        ...global.process,
        versions: undefined
      };

      global.URL = {
        createObjectURL: blob => blob
      };

      const response = await API_CLIENT.previews.url({
        branchId: "branch-id",
        fileId: "file-id",
        layerId: "layer-id",
        projectId: "project-id",
        sha: "sha"
      });

      expect(response).toBeInstanceOf(Blob);
    });
  });
});
