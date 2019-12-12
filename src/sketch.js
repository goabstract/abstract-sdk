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

export function isSketchPlugin() {
  // New versions of skpm set process type to "sketch". For older
  // versions we can infer from the presence of ObjectiveC classes
  // $FlowFixMe property type is missing in process
  return process.type === "sketch" || NSString !== undefined;
}

export function isAbstractPluginInstalled() {
  // The Abstract plugin makes available the PROSketchBootstrap
  // class, regardless of whether the current document is managed
  return isSketchPlugin() && PROSketchBootstrap !== undefined;
}

export function isAbstractDocument(context: *) {
  return isSketchPlugin() && !!documentKey(context);
}

export function project(context: *): ProjectDescriptor {
  const key = documentKey(context);
  return {
    projectId: projectId(key)
  };
}

export function branch(context: *): BranchDescriptor {
  const key = documentKey(context);

  return {
    projectId: projectId(key),
    branchId: branchId(key)
  };
}

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
