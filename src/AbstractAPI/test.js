// @flow
import fs from "fs";
import path from "path";
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

const responses = {
  branches: {
    info: () => [JSON.stringify({ name: "branch-name" }), { status: 200 }]
  },
  commits: {
    list: () => [
      JSON.stringify({
        data: {
          commits: [{ sha: "commit-sha" }, { sha: "next-commit-sha" }]
        }
      }),
      { status: 200 }
    ]
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
        page: { name: "page-name", id: "page-id" },
        file: { name: "file-name" }
      }),
      { status: 200 }
    ]
  },
  previews: {
    blob: (
      // inlined to avoid multiple reads
      data = fs.readFileSync(
        path.resolve(__dirname, "../../fixtures/preview.png")
      )
    ) => [data, { status: 200 }]
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
      // projects
      ["projects.list", buildOrganizationDescriptor()],
      ["projects.list", [undefined, { filter: "active" }]],
      // collections
      ["collections.list", buildProjectDescriptor()],
      ["collections.list", buildBranchDescriptor()],
      ["collections.info", buildCollectionDescriptor()],
      // comments
      [
        "comments.create",
        [buildLayerDescriptor(), { body: "Comment on layer" }],
        { responses: [responses.branches.info(), responses.layers.info()] }
      ],
      [
        "comments.create",
        [
          buildLayerDescriptor(),
          {
            body: "Comment on layer with annotation",
            annotation: { x: 1, y: 1, width: 1, height: 1 }
          }
        ],
        { responses: [responses.branches.info(), responses.layers.info()] }
      ],
      [
        "comments.create",
        [buildBranchDescriptor(), { body: "Comment on branch HEAD" }],
        { responses: [responses.branches.info()] }
      ],
      [
        "comments.create",
        [
          buildBranchDescriptor({ sha: "my-sha" }),
          { body: "Comment on branch at my-sha" }
        ],
        { responses: [responses.branches.info()] }
      ],
      // commits
      ["commits.list", buildBranchDescriptor()],
      ["commits.list", buildFileDescriptor()],
      ["commits.list", buildLayerDescriptor()],
      [
        "commits.info",
        buildBranchDescriptor(),
        {
          responses: [responses.commits.list()],
          result: {
            sha: "commit-sha"
          }
        }
      ],
      [
        "commits.info",
        buildFileDescriptor(),
        {
          responses: [responses.commits.list()],
          result: {
            sha: "commit-sha"
          }
        }
      ],
      [
        "commits.info",
        buildLayerDescriptor(),
        {
          responses: [responses.commits.list()],
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
      // previews
      [
        "previews.url",
        buildLayerDescriptor({
          projectId: "project-id",
          branchId: "branch-id",
          sha: "layer-sha",
          fileId: "file-id",
          layerId: "layer-id"
        }),
        {
          result:
            "https://previews.goabstract.com/projects/project-id/branches/branch-id/commits/layer-sha/files/file-id/layers/layer-id"
        }
      ],
      [
        "previews.blob",
        buildLayerDescriptor(),
        { responses: [responses.previews.blob()] }
      ],
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

      fetch.mockResponseOnce("{}");

      const result = transportMethod(...args);
      await expect(await result).resolves;

      if (options.result) {
        expect(await result).toEqual(options.result);
      }

      expect({ fetch: fetch.mock.calls }).toMatchSnapshot();
    });
  });
});
