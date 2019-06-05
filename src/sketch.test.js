// @flow
import * as sketch from "./sketch";

let globalProcess;
let globalNSString;
let globalPROSketchBootstrap;

describe("isSketchPlugin", () => {
  beforeAll(() => {
    globalProcess = global.process;
    globalNSString = global.NSString;
  });

  afterAll(() => {
    global.process = globalProcess;
    global.NSString = globalNSString;
  });

  test("detects Sketch", () => {
    global.process = { type: "sketch" };
    expect(sketch.isSketchPlugin()).toBe(true);
    global.process = { type: "foo" };
    global.NSString = {};
    expect(sketch.isSketchPlugin()).toBe(true);
  });
});

describe("isAbstractPluginInstalled", () => {
  beforeAll(() => {
    globalProcess = global.process;
    globalPROSketchBootstrap = global.PROSketchBootstrap;
  });

  afterAll(() => {
    global.process = globalProcess;
    global.PROSketchBootstrap = globalPROSketchBootstrap;
  });

  test("detects Abstract plugin", () => {
    global.process = { type: "sketch" };
    global.PROSketchBootstrap = {};
    expect(sketch.isAbstractPluginInstalled()).toBe(true);
  });
});

describe("isAbstractDocument", () => {
  beforeAll(() => {
    globalProcess = global.process;
    globalPROSketchBootstrap = global.PROSketchBootstrap;
  });

  afterAll(() => {
    global.process = globalProcess;
    global.PROSketchBootstrap = globalPROSketchBootstrap;
  });

  test("detects Abstract document", () => {
    global.process = { type: "sketch" };
    global.PROSketchBootstrap = { documentKey: () => "foo" };
    expect(sketch.isAbstractDocument({ document: {} })).toBe(true);
  });
});

describe("entities", () => {
  beforeAll(() => {
    globalPROSketchBootstrap = global.PROSketchBootstrap;
  });

  afterAll(() => {
    global.PROSketchBootstrap = globalPROSketchBootstrap;
  });

  test("project", () => {
    global.PROSketchBootstrap = {
      documentKey: () => "project-id/branch-id/foo/file-id"
    };
    expect(sketch.project(({}: any))).toEqual({
      projectId: "project-id"
    });
  });

  test("branch", () => {
    global.PROSketchBootstrap = {
      documentKey: () => "project-id/branch-id/foo/file-id"
    };
    expect(sketch.branch(({}: any))).toEqual({
      projectId: "project-id",
      branchId: "branch-id"
    });
  });

  test("file", () => {
    global.PROSketchBootstrap = {
      documentKey: () => "project-id/branch-id/foo/file-id"
    };
    expect(sketch.file(({}: any))).toEqual({
      projectId: "project-id",
      branchId: "branch-id",
      fileId: "file-id",
      sha: "latest"
    });
  });
});
