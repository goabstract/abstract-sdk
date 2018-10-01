---
id: api
title: API
---

[auto-icon]: https://img.shields.io/badge/AUTO-blue.svg
[cli-icon]: https://img.shields.io/badge/CLI-lightgrey.svg
[api-icon]: https://img.shields.io/badge/API-lightgrey.svg

## Authentication

### Abstract Token

Create a [Abstract authentication token](https://app.goabstract.com)

## Transports

### AUTO
### API
### CLI

## Methods

### Projects

### Organizations

### Collections

### Branches

### Comments

### Commits

### Files

#### files.list([BranchDescriptor](#branchdescriptor)): Promise<[File](#file)[]> ![CLI][cli-icon] ![API][api-icon]

List files for a branch at head

```js
abstract.files.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master"
});
```

#### files.info([FileDescriptor](#filedescriptor)): Promise<[File](#file)> ![CLI][cli-icon] ![API][api-icon]

Get file at head

```js
abstract.files.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7"
});
```
---

### Pages

### Layers

### Previews

### Data

## Types

### Descriptors

#### ProjectDescriptor

```js
{
  projectId: string,
}
```

#### BranchDescriptor

```js
{
  projectId: string,
  branchId: string | "master"
}
```

#### CommitDescriptor

```js
{
  projectId: string,
  branchId: string | "master",
  sha?: string
}
```

#### FileDescriptor

```js
{
  projectId: string,
  branchId: string | "master",
  fileId: string,
  sha?: string
}
```

#### PageDescriptor

```js
{
  projectId: string,
  branchId: string | "master",
  fileId: string,
  pageId: string,
  sha?: string
}
```

#### LayerDescriptor

```js
{
  projectId: string,
  branchId: string | "master",
  fileId: string,
  pageId: string,
  layerId: string,
  sha?: string
}
```

### Responses

#### Project
#### File

```js
{
  pages: Page[],
  file: {
    id: string,
    name: string,
    type: string,
    applicationVersion: string,
    applicationDocumentVersion: string,
    isLibrary: boolean,
    sha: string,
    lastChangedAtSha: string,
    updatedAt: string
  }
}
```

### Cursor

## Utility

### mapLayerChilden()

### paginate()

#### ES6 Async Iteration

### abstractToken

### version

TODO
