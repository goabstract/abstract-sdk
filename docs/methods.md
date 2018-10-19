---
id: methods
title: Methods
---

[cli-icon]: https://img.shields.io/badge/CLI-lightgrey.svg
[api-icon]: https://img.shields.io/badge/API-blue.svg

## Projects

## Organizations

### organizations.list `(): Promise<Organization[]>`

![API][api-icon]

Load the organizations accessible by the current access token

```js
abstract.organizations.list();
```

## Collections

## Branches

## Comments

## Commits

### commits.list `(BranchDescriptor | LayerDescriptor): Promise<Commit[]>`

![CLI][cli-icon] ![API][api-icon]

List the commits for a branch

```js
abstract.commits.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master"
});
```

or, get the commit history for a specific layer…

```js
abstract.commits.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19"
});
```


### commits.info `(CommitDescriptor): Promise<Commit>`

![CLI][cli-icon] ![API][api-icon]

Load the commit info for a specific commit on a branch

```js
abstract.commits.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  sha: "fb7e9b50da6c330fc43ffb369616f0cd1fa92cc2"
});
```


## Files

### files.list `(BranchDescriptor): Promise<File[]>`

![CLI][cli-icon] ![API][api-icon]

List the files for a branch at the latest commit

```js
abstract.files.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master"
});
```


### files.info `(FileDescriptor): Promise<File>`

![CLI][cli-icon] ![API][api-icon]

Load the file info for the latest commit on a branch

```js
abstract.files.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7"
});
```

You can also load the file info at any commit on the branch…

```js
abstract.files.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  sha: "fb7e9b50da6c330fc43ffb369616f0cd1fa92cc2"
});
```


## Pages

## Layers

## Previews

## Data

## Types

## Descriptors

### ProjectDescriptor

```js
{
  projectId: string,
}
```

### BranchDescriptor

```js
{
  projectId: string,
  branchId: string | "master"
}
```

### CommitDescriptor

```js
{
  projectId: string,
  branchId: string | "master",
  sha?: string
}
```

### FileDescriptor

```js
{
  projectId: string,
  branchId: string | "master",
  fileId: string,
  sha?: string
}
```

### PageDescriptor

```js
{
  projectId: string,
  branchId: string | "master",
  fileId: string,
  pageId: string,
  sha?: string
}
```

### LayerDescriptor

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

## Responses

### Project
### File

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

## Cursor

## Utility

## mapLayerChilden()

## paginate()

### ES6 Async Iteration

## abstractToken

## version

TODO
