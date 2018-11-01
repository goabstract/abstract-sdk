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
import { log } from "../debug";
import AbstractAPI from "./";

jest.mock("./randomTraceId");
jest.mock("../../package.json", () => ({
  ...jest.requireActual("../../package.json"),
  version: "0.0" // Mock version to make snapshots stable
}));

global.fetch = fetch;

const logTest = log.extend("AbstractAPI:test");

const responses = {
  collections: {
    list: () => [
      JSON.stringify({
        data: {
          collections: [{ id: "first-collection" }, { id: "second-collection" }]
        }
      }),
      { status: 200 }
    ],
    info: () => [
      JSON.stringify({ collections: [{ id: "first-collection" }] }),
      { status: 200 }
    ]
  },
  branches: {
    list: () => [
      JSON.stringify({ data: [{ name: "branch-name" }] }),
      { status: 200 }
    ],
    info: () => [JSON.stringify({ name: "branch-name" }), { status: 200 }]
  },
  commits: {
    list: () => [
      JSON.stringify({
        commits: [{ sha: "commit-sha" }, { sha: "next-commit-sha" }]
      }),
      { status: 200 }
    ],
    info: () => [
      JSON.stringify({ commits: [{ sha: "commit-sha" }] }),
      { status: 200 }
    ]
  },
  files: {
    list: () => [
      JSON.stringify({ files: [{ id: "file-id" }, { id: "not-file-id" }] }),
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
    arrayBuffer: (
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
      ["projects.info", buildProjectDescriptor()],
      // collections
      [
        "collections.list",
        buildProjectDescriptor(),
        { responses: [responses.collections.list()] }
      ],
      [
        "collections.list",
        buildBranchDescriptor(),
        { responses: [responses.collections.list()] }
      ],
      [
        "collections.info",
        buildCollectionDescriptor(),
        { responses: [responses.collections.list()] }
      ],
      // comments
      [
        "comments.create",
        [buildLayerDescriptor(), { body: "Comment on layer" }],
        {
          responses: [responses.branches.info(), responses.layers.info()]
        }
      ],
      [
        "comments.create",
        [
          buildLayerDescriptor({ sha: "latest" }),
          {
            body: "Comment on layer with annotation",
            annotation: { x: 1, y: 1, width: 1, height: 1 }
          }
        ],
        {
          responses: [
            responses.commits.list(),
            responses.branches.info(),
            responses.layers.info()
          ]
        }
      ],
      [
        "comments.create",
        [
          buildBranchDescriptor({ sha: "latest" }),
          { body: "Comment on branch HEAD" }
        ],
        { responses: [responses.commits.list(), responses.branches.info()] }
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
        buildBranchDescriptor({ sha: "commit-sha" }),
        {
          responses: [responses.commits.info()],
          result: { sha: "commit-sha" }
        }
      ],
      [
        "commits.info",
        buildFileDescriptor({ sha: "commit-sha" }),
        {
          responses: [responses.commits.info()],
          result: { sha: "commit-sha" }
        }
      ],
      [
        "commits.info",
        buildLayerDescriptor({ sha: "commit-sha" }),
        {
          responses: [responses.commits.info()],
          result: { sha: "commit-sha" }
        }
      ],
      // branches
      [
        "branches.list",
        buildProjectDescriptor(),
        { responses: [responses.branches.list()] }
      ],
      [
        "branches.list",
        [buildProjectDescriptor(), { filter: "mine" }],
        { responses: [responses.branches.list()] }
      ],
      ["branches.info", buildBranchDescriptor()],
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
      [
        "layers.info",
        buildLayerDescriptor(),
        { responses: [responses.layers.info()] }
      ],
      [
        "layers.info",
        buildLayerDescriptor({ sha: "latest" }),
        { responses: [responses.commits.list(), responses.layers.info()] }
      ],
      // previews
      ["previews.info", buildLayerDescriptor()],
      [
        "previews.info",
        buildLayerDescriptor({ sha: "latest" }),
        { responses: [responses.commits.list()] }
      ],
      [
        "previews.raw",
        buildLayerDescriptor(),
        { responses: [responses.previews.arrayBuffer()] },
        "previews.raw",
        buildLayerDescriptor({ sha: "latest" }),
        {
          responses: [
            responses.commits.list(),
            responses.previews.arrayBuffer()
          ]
        }
      ],
      // data
      ["data.info", buildLayerDescriptor()],
      [
        "data.info",
        buildLayerDescriptor({ sha: "latest" }),
        {
          responses: [responses.commits.list()]
        }
      ]
    ])("%s(%p)", async (property, args, options = {}) => {
      args = Array.isArray(args) ? args : [args];
      logTest(property, args);

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
