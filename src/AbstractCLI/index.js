// @flow
import path from "path";
import debug from "debug";
import locatePath from "locate-path";
import { spawn } from "promisify-child-process";
import type { AbstractInterface, BranchDescriptor } from "../";

function parsePath(input: ?string): ?Array<string> {
  if (!input) return;
  return input.split(path.delimiter || ":");
}

type Options = {
  abstractToken: string,
  abstractCliPath?: string[],
  cwd?: string
};

export default class AbstractCLI implements AbstractInterface {
  abstractToken: string;
  abstractCliPath: string;

  constructor({
    cwd = process.cwd(),
    abstractToken,
    abstractCliPath = parsePath(process.env.ABSTRACT_CLI_PATH) || [
      path.join(cwd, "abstract-cli"), // Relative to cwd
      path.join(cwd, "node_modules/@elasticprojects/abstract-cli"), // Relative to node_modules in cwd (also makes test easier)
      "/Applications/Abstract.app/Contents/Resources/app.asar.unpacked/node_modules/@elasticprojects/abstract-cli" // macOS App
    ]
  }: Options) {
    this.abstractToken = abstractToken;

    try {
      this.abstractCliPath = path.resolve(
        cwd,
        locatePath.sync(abstractCliPath)
      );
    } catch (error) {
      throw new Error(
        `Cannot find abstract-cli in "${abstractCliPath.join(":")}"`
      );
    }
  }

  files = {
    async list(branchDescriptor: BranchDescriptor) {
      return await this.send([
        "files",
        branchDescriptor.projectId,
        branchDescriptor.sha
      ]);
    }
  };

  async send(args: string[]) {
    debug("abstract:transport:AbstractCLI")(args);
    await spawn(this.abstractCliPath, [
      ...args,
      `--user-token=${this.abstractToken}`,
      `--api-url=${process.env.ABSTRACT_API_URL ||
        "https://api.goabstract.com"}`
    ]);
  }
}
