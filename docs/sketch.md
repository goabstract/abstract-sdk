---
id: sketch
title: Sketch
---

This package contains a selection of utilities for dealing with documents inside of Sketch.

  > All of these methods except `isSketchPlugin` rely on the official Abstract plugin being available and can only be used when the SDK is running inside the context of a Sketch plugin.

## isSketchPlugin

`Abstract.Sketch.isSketchPlugin(): boolean`

Use this method to check whether the current environment is a Sketch plugin. This is probably only useful if you're writing your own module that depends on the SDK and can run in a plugin OR node and can be used as a guard in this case.

## isAbstractPluginInstalled

`Abstract.Sketch.isAbstractPluginInstalled(): boolean`

Detect whether the official Abstract plugin is currently installed and enabled in Sketch.


## isAbstractDocument

`Abstract.Sketch.isAbstractDocument(context: SketchContext): boolean`

Detect whether the current selected document was opened from Abstract, either tracked or untracked.


## project

`Abstract.Sketch.project(context: SketchContext): ProjectDescriptor`

Get a descriptor of the project from which the current document was opened.


## branch

`Abstract.Sketch.branch(context: SketchContext): BranchDescriptor`

Get a descriptor of the branch from which the current document was opened.


## file

`Abstract.Sketch.file(context: SketchContext): FileDescriptor`

Get a descriptor for the currently open document.
