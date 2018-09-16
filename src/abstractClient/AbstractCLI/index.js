// @flow
import path from "path";
import debug from "debug";
import locatePath from "locate-path";
import type {
  AbstractTransport,
  AbstractInterface,
  ProjectDescriptor
} from "../../";

function parsePath(input: ?string): ?Array<string> {
  if (!input) return;
  return input.split(path.delimiter || ":");
}

type Options = {
  abstractToken: string,
  abstractCliPath?: string[],
  cwd?: string
};

export default class AbstractCLI
  implements AbstractTransport, AbstractInterface {
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

  layers = {
    async data(projectDescriptor: ProjectDescriptor) {
      return await this.send(1);
    }
  };

  async send(action: Object) {
    debug("abstract:transport:AbstractCLI")(action);
    return action;
  }
}
