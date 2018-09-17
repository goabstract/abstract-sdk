// @flow
import child_process from "child_process";
import path from "path";
import get from "lodash/get";
import AbstractCLI from "./";

jest.mock("child_process");

function buildOptions(options: *) {
  return {
    abstractToken: "1",
    ...options
  };
}

const BRANCH_DESCRIPTOR = {
  projectId: "project-id",
  brancId: "branch-id",
  sha: "sha",
  fileId: "file-id"
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
        path.join(process.cwd(), "./fixtures/abstract-cli")
      ],
      [
        // Ignores misssing abstract-cli path
        "/missing/abstract-cli:./fixtures/abstract-cli",
        path.join(process.cwd(), "./fixtures/abstract-cli")
      ],
      [
        // Prefers first matched abstract-cli path
        "./fixtures/other/abstract-cli/:fixtures/abstract-cli",
        path.join(process.cwd(), "./fixtures/other/abstract-cli")
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
      ).toBe(path.join(process.cwd(), "./fixtures/abstract-cli"));
    });
  });

  test.each([["files.list", BRANCH_DESCRIPTOR]])(
    "%s(%p)",
    async (property, descriptor) => {
      const transport = new AbstractCLI(
        buildOptions({
          abstractCliPath: ["./fixtures/abstract-cli"]
        })
      );
      const transportMethod = get(transport, property).bind(transport);
      await expect(transportMethod(descriptor)).resolves;
      expect(child_process.spawn.mock.calls).toMatchSnapshot();
    }
  );
});
