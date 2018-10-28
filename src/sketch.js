// @flow
/* global process NSString PROSketchBootstrap */

export function isSketchPlugin() {
  // New versions of skpm set process type to "sketch". For older
  // versions we can infer from the presence of ObjectiveC classes
  // $FlowFixMe
  return process.type === "sketch" || !!NSString;
}

export function isAbstractPluginInstalled() {
  // The Abstract plugin makes available the PROSketchBootstrap
  // class, regardless of whether the current document is managed
  // $FlowFixMe
  return isSketchPlugin() && !!PROSketchBootstrap;
}

export function isAbstractDocument(context: *) {
  return isSketchPlugin() && !!documentKey(context);
}

export function projectId(context: *) {
  return documentKey(context).split("/")[0];
}

export function branchId(context: *) {
  return documentKey(context).split("/")[1];
}

export function fileId(context: *) {
  return documentKey(context).split("/")[3];
}

function documentKey(context: *) {
  // $FlowFixMe
  return PROSketchBootstrap.documentKey(context.document);
}
