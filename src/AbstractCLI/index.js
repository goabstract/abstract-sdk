// @flow
import path from "path";
import { spawn } from "child_process";
import { Buffer } from "buffer";
import debug from "debug";
import find from "lodash/find";
import flatMap from "lodash/flatMap";
import locatePath from "locate-path";
import JSONStream from "JSONStream";
import type {
  AbstractInterface,
  ProjectDescriptor,
  BranchDescriptor,
  PageDescriptor,
  FileDescriptor,
  LayerDescriptor,
  CollectionDescriptor
} from "../";

function parsePath(input: ?string): ?Array<string> {
  if (!input) return;
  return input.split(path.delimiter || ":");
}

function ref(
  objectDescriptor:
    | BranchDescriptor
    | FileDescriptor
    | PageDescriptor
    | LayerDescriptor
) {
  return objectDescriptor.sha || objectDescriptor.branchId;
}

function fileDescriptorForPage(pageDescriptor: PageDescriptor) {
  return {
    projectId: pageDescriptor.projectId,
    branchId: pageDescriptor.branchId,
    sha: pageDescriptor.sha,
    fileId: pageDescriptor.fileId
  };
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

  commits = {
    list: async (
      objectDescriptor: BranchDescriptor | FileDescriptor | LayerDescriptor
    ) => {
      if (objectDescriptor.layerId) {
        return await this.spawn([
          "commits",
          objectDescriptor.projectId,
          objectDescriptor.branchId,
          "--layer-id",
          objectDescriptor.layerId
        ]);
      } else if (objectDescriptor.fileId) {
        return await this.spawn([
          "commits",
          objectDescriptor.projectId,
          objectDescriptor.branchId,
          "--file-id",
          objectDescriptor.fileId
        ]);
      } else {
        return await this.spawn([
          "commits",
          objectDescriptor.projectId,
          objectDescriptor.branchId
        ]);
      }
    },
    info: async (
      objectDescriptor: BranchDescriptor | FileDescriptor | LayerDescriptor
    ) => {
      if (objectDescriptor.layerId) {
        return await this.spawn([
          "commit",
          objectDescriptor.projectId,
          ref(objectDescriptor)
        ]);
      } else if (objectDescriptor.fileId) {
        return await this.spawn([
          "commit",
          objectDescriptor.projectId,
          ref(objectDescriptor)
        ]);
      } else {
        return await this.spawn([
          "commit",
          objectDescriptor.projectId,
          ref(objectDescriptor)
        ]);
      }
    }
  };

  files = {
    list: async (branchDescriptor: BranchDescriptor) => {
      return await this.spawn([
        "files",
        branchDescriptor.projectId,
        ref(branchDescriptor)
      ]);
    },
    info: async (fileDescriptor: FileDescriptor) => {
      return await this.spawn([
        "file",
        fileDescriptor.projectId,
        ref(fileDescriptor),
        fileDescriptor.fileId
      ]);
    }
  };

  pages = {
    list: async (fileOrBranchDescriptor: BranchDescriptor | FileDescriptor) => {
      let files;

      if (fileOrBranchDescriptor.fileId) {
        files = [await this.files.info(fileOrBranchDescriptor)];
      } else {
        // $FlowFixMe: with no fileId fileOrBranchDescriptor is a BranchDescriptor
        files = await this.files.list(fileOrBranchDescriptor);
      }

      return flatMap(files, file => file.pages);
    },
    info: async (pageDescriptor: PageDescriptor) => {
      const { pages } = await this.files.info(
        fileDescriptorForPage(pageDescriptor)
      );

      return find(pages, { id: pageDescriptor.pageId });
    }
  };

  layers = {
    list: async (fileDescriptor: FileDescriptor) => {
      return await this.spawn([
        "layers",
        fileDescriptor.projectId,
        ref(fileDescriptor),
        fileDescriptor.fileId
      ]);
    },
    info: async (layerDescriptor: LayerDescriptor) => {
      return await this.spawn([
        "layer",
        "meta",
        layerDescriptor.projectId,
        ref(layerDescriptor),
        layerDescriptor.fileId,
        layerDescriptor.layerId
      ]);
    },
    data: async (layerDescriptor: LayerDescriptor) => {
      return await this.spawn([
        "layer",
        "data",
        layerDescriptor.projectId,
        ref(layerDescriptor),
        layerDescriptor.fileId,
        layerDescriptor.layerId
      ]);
    }
  };

  collections = {
    list: async (
      projectOrBranchDescriptor: ProjectDescriptor | BranchDescriptor
    ) => {
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
    info: async (collectionDescriptor: CollectionDescriptor) => {
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
