// @flow
import fetch from "jest-fetch-mock";
import get from "lodash/get";
import {
  buildOptions,
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

const responses = {
  branches: {
    info: () => [JSON.stringify({ name: "branch-name" }), { status: 200 }]
  },
  files: {
    list: () => [
      JSON.stringify({
        data: {
          files: [{ id: "file-id" }, { id: "not-file-id" }]
        }
      }),
      { status: 200 }
    ]
  },
  layers: {
    info: () => [
      JSON.stringify({
        layer: { name: "layer-name" },
        page: { name: "page-name" },
        file: { name: "file-name" }
      }),
      { status: 200 }
    ]
  }
};

describe("AbstractAPI", () => {
  describe("with mocked global.fetch", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test.each([
      // organizations
      ["organizations.list", undefined],
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
          responses: [responses.files.list()],
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
    ])("%s(%j)", async (property, args, options = {}) => {
      args = Array.isArray(args) ? args : [args];

      const transport = new AbstractAPI(buildOptions());
      const transportMethod = get(transport, property).bind(transport);

      if (options.responses) {
        fetch.mockResponses(...options.responses);
      }

      fetch.mockResponseOnce(JSON.stringify(options.body || {}), options.init);

      const result = transportMethod(...args);
      await expect(await result).resolves;

      if (options.result) {
        expect(await result).toEqual(options.result);
      }

      expect({ fetch: fetch.mock.calls }).toMatchSnapshot();
    });
  });
});
