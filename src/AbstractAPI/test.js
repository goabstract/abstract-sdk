// @flow
import fetch from "jest-fetch-mock";
import get from "lodash/get";
import {
  buildOptions,
  buildOrganizationDescriptor,
  buildProjectDescriptor,
  buildCommitDescriptor,
  buildBranchDescriptor,
  buildFileDescriptor,
  buildLayerDescriptor,
  buildCollectionDescriptor
} from "../support/factories";
import AbstractAPI from "./";

jest.mock("./randomTraceId");
global.fetch = fetch;

describe("AbstractAPI", () => {
  describe("with mocked global.fetch", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test.each([
      // organizations
      ["organizations.list", undefined],
      // projects
      ["projects.list", buildOrganizationDescriptor()],
      // collections
      ["collections.list", buildProjectDescriptor()],
      ["collections.list", buildBranchDescriptor()],
      ["collections.info", buildCollectionDescriptor()],
      // commits
      ["commits.list", buildBranchDescriptor()],
      ["commits.list", buildFileDescriptor()],
      ["commits.list", buildLayerDescriptor()],
      [
        "commits.info",
        buildBranchDescriptor(),
        {
          body: {
            data: {
              commits: [{ sha: "commit-sha" }, { sha: "next-commit-sha" }]
            }
          },
          result: {
            sha: "commit-sha"
          }
        }
      ],
      [
        "commits.info",
        buildFileDescriptor(),
        {
          body: {
            data: {
              commits: [{ sha: "commit-sha" }, { sha: "next-commit-sha" }]
            }
          },
          result: {
            sha: "commit-sha"
          }
        }
      ],
      [
        "commits.info",
        buildLayerDescriptor(),
        {
          body: {
            data: {
              commits: [{ sha: "commit-sha" }, { sha: "next-commit-sha" }]
            }
          },
          result: {
            sha: "commit-sha"
          }
        }
      ],
      // files
      ["files.list", buildBranchDescriptor()],
      [
        "files.info",
        buildFileDescriptor({ fileId: "file-id" }),
        {
          body: {
            data: {
              files: [{ id: "file-id" }, { id: "not-file-id" }]
            }
          },
          result: { id: "file-id" }
        }
      ],
      // changesets
      ["changesets.info", buildCommitDescriptor()],
      // pages
      ["pages.list", buildFileDescriptor()],
      // layers
      ["layers.list", buildFileDescriptor()],
      ["layers.info", buildLayerDescriptor()],
      // data
      ["data.layer", buildLayerDescriptor()],
      ["data.layer", buildLayerDescriptor({ sha: "sha" })]
    ])("%s(%p)", async (property, descriptor, options = {}) => {
      const transport = new AbstractAPI(buildOptions());
      const transportMethod = get(transport, property).bind(transport);
      fetch.mockResponseOnce(
        JSON.stringify(options.body || "{}"),
        options.init
      );

      const result = transportMethod(descriptor);
      await expect(await result).resolves;

      if (options.result) {
        expect(await result).toEqual(options.result);
      }

      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0]).toMatchSnapshot();
    });
  });
});
