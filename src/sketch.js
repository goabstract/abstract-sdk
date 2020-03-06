/* @flow */
/* global process */
import type {
  BranchDescriptor,
  FileDescriptor,
  ProjectDescriptor
} from "./types";

declare type PROSketchBootstrapT = {
  documentKey: (*) => string
};

declare var NSString: Object;
declare var PROSketchBootstrap: PROSketchBootstrapT;

/**
 * @memberof sketch
 * @description
 * Use this method to check whether the current environment is a Sketch plugin.
 * This is probably only useful if you're writing your own module that depends
 * on the SDK and can run in a plugin OR node and can be used as a guard in this case.
 * @returns boolean
 * @example Abstract.sketch.isSketchPlugin()
 */
export function isSketchPlugin() {
  // New versions of skpm set process type to "sketch". For older
  // versions we can infer from the presence of ObjectiveC classes
  // $FlowFixMe property type is missing in process
  return process.type === "sketch" || NSString !== undefined;
}

/**
 * @memberof sketch
 * @description
 * Detect whether the official Abstract plugin is currently installed and enabled in Sketch.
 * @returns boolean
 * @example Abstract.sketch.isAbstractPluginInstalled()
 */
export function isAbstractPluginInstalled() {
  // The Abstract plugin makes available the PROSketchBootstrap
  // class, regardless of whether the current document is managed
  return isSketchPlugin() && PROSketchBootstrap !== undefined;
}

/**
 * @memberof sketch
 * @description
 * Detect whether the current selected document was opened from Abstract, either tracked or untracked.
 * @returns boolean
 * @example Abstract.sketch.isAbstractDocument(context: SketchContext)
 */
export function isAbstractDocument(context: *) {
  return isSketchPlugin() && !!documentKey(context);
}

/**
 * @memberof sketch
 * @description
 * Get a descriptor of the project from which the current document was opened.
 * @returns boolean
 * @example Abstract.sketch.project(context: SketchContext)
 */
export function project(context: *): ProjectDescriptor {
  const key = documentKey(context);
  return {
    projectId: projectId(key)
  };
}

/**
 * @memberof sketch
 * @description
 * Get a descriptor of the branch from which the current document was opened.
 * @returns BranchDescriptor
 * @example Abstract.sketch.branch(context: SketchContext)
 */
export function branch(context: *): BranchDescriptor {
  const key = documentKey(context);

  return {
    projectId: projectId(key),
    branchId: branchId(key)
  };
}

/**
 * @memberof sketch
 * @description
 * Get a descriptor for the currently open document.
 * @returns FileDescriptor
 * @example Abstract.sketch.file(context: SketchContext)
 */
export function file(context: *): FileDescriptor {
  const key = documentKey(context);

  return {
    projectId: projectId(key),
    branchId: branchId(key),
    fileId: fileId(key),
    sha: "latest"
  };
}

function projectId(key: string) {
  return key.split("/")[0];
}

function branchId(key: string) {
  return key.split("/")[1];
}

function fileId(key: string) {
  return key.split("/")[3];
}

function documentKey(context: *) {
  return PROSketchBootstrap.documentKey(context.document);
}
