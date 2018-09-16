// @flow
import path from "path";
import get from "lodash/get";
import AbstractCLI from "./";

const EXAMPLE_OPTIONS = { abstractToken: "1" };

describe(AbstractCLI, () => {
  test("throws when abstract-cli cannot be located", () => {
    expect(
      () =>
        new AbstractCLI({
          ...EXAMPLE_OPTIONS,
          abstractCliPath: ["./fixtures/missing/abstract-cli"]
        }).abstractCliPath
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
        expect(new AbstractCLI(EXAMPLE_OPTIONS).abstractCliPath).toBe(expected);
      }
    );

    test("prefers options.abstractCliPath=%p over process.env.ABSTRACT_CLI_PATH", () => {
      process.env.ABSTRACT_CLI_PATH = "./fixtures/other/abstract-cli";
      const { default: AbstractCLI } = require("./");
      expect(
        new AbstractCLI({
          ...EXAMPLE_OPTIONS,
          abstractCliPath: ["./fixtures/abstract-cli"]
        }).abstractCliPath
      ).toBe(path.join(process.cwd(), "./fixtures/abstract-cli"));
    });
  });

  test.each([
    ["layers.data", {}, 1],
    ["layers.data", {}, 1],
    ["layers.data", {}, 1],
    ["layers.data", {}, 1]
  ])("%s(%p): Promise<%p>", async (property, descriptor, expected) => {
    const transport = new AbstractCLI(EXAMPLE_OPTIONS);
    const transportMethod = get(transport, property).bind(transport);
    await expect(transportMethod(descriptor)).resolves.toBe(expected);
  });
});
