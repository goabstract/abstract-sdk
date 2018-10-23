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
import AbstractCLI from "./";

jest.mock("child_process");

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
  }
};

describe(AbstractCLI, () => {
  test("throws when abstract-cli cannot be located", () => {
    expect(
      () =>
        new AbstractCLI(
          buildOptions({
            abstractCliPath: ["./fixtures/missing/abstract-cli"]
          })
        ).abstractCliPath
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
      "configures options.abstractCliPath from process.env.ABSTRACT_CLI_PATH=%p",
      (abstractCliPath, expected) => {
        process.env.ABSTRACT_CLI_PATH = abstractCliPath;
        const { default: AbstractCLI } = require("./");
        expect(new AbstractCLI(buildOptions()).abstractCliPath).toBe(expected);
      }
    );

    test("prefers options.abstractCliPath=%p over process.env.ABSTRACT_CLI_PATH", () => {
      process.env.ABSTRACT_CLI_PATH = "./fixtures/other/abstract-cli";
      const { default: AbstractCLI } = require("./");
      expect(
        new AbstractCLI(
          buildOptions({
            abstractCliPath: ["./fixtures/abstract-cli"]
          })
        ).abstractCliPath
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
      ["commits.list", buildBranchDescriptor({ sha: "sha" })],
      ["commits.list", buildFileDescriptor({ sha: "sha" })],
      ["commits.list", buildLayerDescriptor({ sha: "sha" })],
      ["commits.info", buildBranchDescriptor()],
      ["commits.info", buildFileDescriptor()],
      ["commits.info", buildLayerDescriptor()],
      ["commits.info", buildBranchDescriptor({ sha: "sha" })],
      ["commits.info", buildFileDescriptor({ sha: "sha" })],
      ["commits.info", buildLayerDescriptor({ sha: "sha" })],
      // changesets
      ["changesets.info", buildCommitDescriptor()],
      // files
      [
        "files.info",
        buildFileDescriptor(),
        {
          responses: [responses.files.info()]
        }
      ],
      [
        "files.list",
        buildBranchDescriptor({ sha: "sha" }),
        {
          responses: [responses.files.list()]
        }
      ],
      [
        "files.list",
        buildCommitDescriptor({ sha: "sha" }),
        {
          responses: [responses.files.list()]
        }
      ],
      [
        "files.info",
        buildFileDescriptor({ sha: "sha" }),
        {
          responses: [responses.files.info()]
        }
      ],
      // pages
      ["pages.list", buildFileDescriptor()],
      ["pages.list", buildFileDescriptor({ sha: "sha" })],
      [
        "pages.info",
        buildPageDescriptor(),
        {
          responses: [responses.pages.info()],
          result: { id: "page-id" }
        }
      ],
      [
        "pages.info",
        buildPageDescriptor({ sha: "sha" }),
        {
          responses: [responses.pages.info()],
          result: { id: "page-id" }
        }
      ],
      // layers
      ["layers.list", buildFileDescriptor()],
      ["layers.info", buildLayerDescriptor()],
      ["layers.list", buildFileDescriptor({ sha: "sha" })],
      ["layers.info", buildLayerDescriptor({ sha: "sha" })],
      // data
      ["data.info", buildLayerDescriptor()],
      ["data.info", buildLayerDescriptor({ sha: "sha" })]
    ])("%s(%p)", async (property, args, options = {}) => {
      args = Array.isArray(args) ? args : [args];

      const transport = new AbstractCLI(
        buildOptions({ abstractCliPath: ["./fixtures/abstract-cli"] })
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
      await expect(result).resolves;

      if (options.result) {
        expect(await result).toEqual(options.result);
      }

      expect(child_process.spawn.mock.calls.length).toEqual(1);
      expect(child_process.spawn.mock.calls[0]).toMatchSnapshot();
    });
  });
});
