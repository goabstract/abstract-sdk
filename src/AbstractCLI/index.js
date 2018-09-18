// @flow
import path from "path";
import { spawn } from "child_process";
import { Buffer } from "buffer";
import debug from "debug";
import locatePath from "locate-path";
import JSONStream from "JSONStream";
import type {
  AbstractInterface,
  ProjectDescriptor,
  BranchDescriptor,
  FileDescriptor,
  LayerDescriptor,
  CollectionDescriptor
} from "../";

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
      this.abstractCliPath = path.relative(
        cwd,
        path.resolve(cwd, locatePath.sync(abstractCliPath))
      );
    } catch (error) {
      throw new Error(
        `Cannot find abstract-cli in "${abstractCliPath.join(":")}"`
      );
    }
  }

  files = {
    async list(branchDescriptor: BranchDescriptor) {
      return await this.spawn([
        "files",
        branchDescriptor.projectId,
        branchDescriptor.sha
      ]);
    },
    async info(fileDescriptor: FileDescriptor) {
      return await this.spawn([
        "file",
        fileDescriptor.projectId,
        fileDescriptor.sha,
        fileDescriptor.fileId
      ]);
    }
  };

  layers = {
    async list(fileDescriptor: FileDescriptor) {
      return await this.spawn([
        "layers",
        fileDescriptor.projectId,
        fileDescriptor.sha,
        fileDescriptor.fileId
      ]);
    },
    async info(layerDescriptor: LayerDescriptor) {
      return await this.spawn([
        "layer",
        "meta",
        layerDescriptor.projectId,
        layerDescriptor.sha,
        layerDescriptor.fileId,
        layerDescriptor.layerId
      ]);
    },
    async data(layerDescriptor: LayerDescriptor) {
      return await this.spawn([
        "layer",
        "data",
        layerDescriptor.projectId,
        layerDescriptor.sha,
        layerDescriptor.fileId,
        layerDescriptor.layerId
      ]);
    }
  };

  collections = {
    async list(
      projectOrBranchDescriptor: ProjectDescriptor | BranchDescriptor
    ) {
      if (projectOrBranchDescriptor.branchId) {
        return await this.spawn([
          "collections",
          projectOrBranchDescriptor.projectId,
          "--branch",
          projectOrBranchDescriptor.branchId
        ]);
      } else {
        return await this.spawn([
          "collections",
          projectOrBranchDescriptor.projectId
        ]);
      }
    },
    async info(collectionDescriptor: CollectionDescriptor) {
      return await this.spawn([
        "collection",
        collectionDescriptor.projectId,
        collectionDescriptor.collectionId
      ]);
    }
  };

  async spawn(args: string[]) {
    debug("abstract:transport:AbstractCLI")(args);

    return new Promise((resolve, reject) => {
      const abstractCli = spawn(this.abstractCliPath, [
        ...args,
        `--user-token=${this.abstractToken}`,
        `--api-url=${process.env.ABSTRACT_API_URL ||
          "https://api.goabstract.com"}`
      ]);

      let stderrBuffer = new Buffer.from("");
      abstractCli.stderr.on("data", chunk => {
        stderrBuffer.concat(chunk);
      });

      abstractCli.stdout
        .pipe(JSONStream.parse())
        .on("data", resolve)
        .on("error", reject);

      abstractCli.on("error", reject);
      abstractCli.on("close", errorCode => {
        if (errorCode !== 0) {
          reject(stderrBuffer); // Reject stderr for non-zero error codes
        }
      });
    });
  }
}
