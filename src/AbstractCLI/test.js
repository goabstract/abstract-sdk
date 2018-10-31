// @flow
import child_process from "child_process";
import { Readable } from "readable-stream";
import get from "lodash/get";
import {
  buildOptions,
  buildProjectDescriptor,
  buildCommitDescriptor,
  buildBranchDescriptor,
  buildFileDescriptor,
  buildPageDescriptor,
  buildLayerDescriptor,
  buildCollectionDescriptor
} from "../support/factories";
import { log } from "../debug";
import AbstractCLI from "./";

jest.mock("child_process");

const logTest = log.extend("AbstractCLI:test");

function buildTextStream(text?: string): ReadableStream {
  const stream = new Readable();
  stream._read = () => {}; // required interface

  if (text !== undefined) {
    stream.push(text);
    stream.push(null); // end of stream
  }

  return stream;
}

const responses = {
  commits: {
    list: () => ({
      stdout: JSON.stringify({
        commits: [{ sha: "commit-sha" }, { sha: "next-commit-sha" }]
      })
    })
  },
  files: {
    list: () => ({
      stdout: JSON.stringify({
        files: [{ id: "file-id" }, { id: "not-file-id" }]
      })
    }),
    info: () => ({
      stdout: JSON.stringify({ file: { id: "file-id" } })
    })
  },
  pages: {
    info: () => ({
      stdout: JSON.stringify({
        pages: [{ id: "not-page-id" }, { id: "page-id" }],
        file: {} // required
      })
    })
  },
  layers: {
    info: () => ({
      stdout: JSON.stringify({ layer: { id: "layer-id" } })
    })
  }
};

describe(AbstractCLI, () => {
  test("throws when abstract-cli cannot be located", () => {
    expect(
      () =>
        new AbstractCLI(
          buildOptions({
            cliPath: ["./fixtures/missing/abstract-cli"]
          })
        ).cliPath
    ).toThrow('Cannot find abstract-cli in "./fixtures/missing/abstract-cli"');
  });

  describe("without module cache to reset process.env", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test.each([
      [
        // Relative path
        "./fixtures/abstract-cli",
        "fixtures/abstract-cli"
      ],
      [
        // Ignores misssing abstract-cli path
        "/missing/abstract-cli:./fixtures/abstract-cli",
        "fixtures/abstract-cli"
      ],
      [
        // Prefers first matched abstract-cli path
        "./fixtures/other/abstract-cli/:fixtures/abstract-cli",
        "fixtures/other/abstract-cli"
      ]
    ])(
      "configures options.cliPath from process.env.ABSTRACT_CLI_PATH=%p",
      (cliPath, expected) => {
        process.env.ABSTRACT_CLI_PATH = cliPath;
        const { default: AbstractCLI } = require("./");
        expect(new AbstractCLI(buildOptions()).cliPath).toBe(expected);
      }
    );

    test("prefers options.cliPath=%p over process.env.ABSTRACT_CLI_PATH", () => {
      process.env.ABSTRACT_CLI_PATH = "./fixtures/other/abstract-cli";
      const { default: AbstractCLI } = require("./");
      expect(
        new AbstractCLI(
          buildOptions({
            cliPath: ["./fixtures/abstract-cli"]
          })
        ).cliPath
      ).toBe("fixtures/abstract-cli");
    });
  });

  describe("with mocked child_process.spawn", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test.each([
      // collections
      ["collections.list", buildProjectDescriptor()],
      ["collections.list", buildBranchDescriptor()],
      ["collections.info", buildCollectionDescriptor()],
      // commits
      ["commits.list", buildBranchDescriptor()],
      ["commits.list", buildFileDescriptor()],
      ["commits.list", buildLayerDescriptor()],
      ["commits.info", buildCommitDescriptor()],
      // changesets
      ["changesets.info", buildCommitDescriptor()],
      // files
      [
        "files.info",
        buildFileDescriptor(),
        {
          responses: [responses.files.info()],
          result: { id: "file-id" }
        }
      ],
      [
        "files.list",
        buildBranchDescriptor(),
        {
          responses: [responses.files.list()],
          result: [{ id: "file-id" }, { id: "not-file-id" }]
        }
      ],
      [
        "files.info",
        buildFileDescriptor({ sha: "latest" }),
        { responses: [responses.commits.list()] }
      ],
      [
        "files.list",
        buildCommitDescriptor(),
        {
          responses: [responses.files.list()],
          result: [{ id: "file-id" }, { id: "not-file-id" }]
        }
      ],
      [
        "files.list",
        buildBranchDescriptor({ sha: "latest" }),
        { responses: [responses.commits.list()] }
      ],
      // pages
      ["pages.list", buildFileDescriptor()],
      [
        "pages.info",
        buildPageDescriptor(),
        {
          responses: [responses.pages.info()],
          result: { id: "page-id" }
        }
      ],
      // layers
      ["layers.list", buildFileDescriptor()],
      [
        "layers.list",
        buildFileDescriptor({ sha: "latest" }),
        { responses: [responses.commits.list()] }
      ],
      [
        "layers.info",
        buildLayerDescriptor(),
        {
          responses: [responses.layers.info()],
          result: { id: "layer-id" }
        }
      ],
      [
        "layers.info",
        buildLayerDescriptor({ sha: "latest" }),
        {
          responses: [responses.commits.list(), responses.layers.info()],
          result: { id: "layer-id" }
        }
      ],
      // data
      ["data.info", buildLayerDescriptor()],
      [
        "data.info",
        buildLayerDescriptor({ sha: "latest" }),
        { responses: [responses.commits.list()] }
      ]
    ])("%s(%p)", async (property, args, options = {}) => {
      args = Array.isArray(args) ? args : [args];
      logTest(property, args);

      const transport = new AbstractCLI(
        buildOptions({ cliPath: ["./fixtures/abstract-cli"] })
      );

      const transportMethod = get(transport, property).bind(transport);

      if (options.responses) {
        options.responses.forEach(response => {
          child_process.spawn.mockReturnValueOnce({
            stdout: buildTextStream(response.stdout),
            stderr: buildTextStream(response.stderr),
            on: jest.fn().mockReturnThis()
          });
        });
      }

      child_process.spawn.mockReturnValueOnce({
        stdout: buildTextStream("{}"),
        stderr: buildTextStream(""),
        on: jest.fn().mockReturnThis()
      });

      const result = transportMethod(...args);
      await expect(await result).resolves;

      if (options.result) {
        expect(await result).toEqual(options.result);
      }

      expect({ spawn: child_process.spawn.mock.calls }).toMatchSnapshot();
    });
  });
});
