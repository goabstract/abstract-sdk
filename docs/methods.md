---
id: methods
title: Methods
---

[cli-icon]: https://img.shields.io/badge/CLI-lightgrey.svg
[api-icon]: https://img.shields.io/badge/API-blue.svg

## Projects

![API][api-icon]

A project is a bucket for work.

### The project object

| Property         | Type     | Description                                                                   |
|------------------|----------|-------------------------------------------------------------------------------|
| `about`          | `string` | A longer description of the project (May optionally include markdown tags)    |
| `archivedAt`     | `string` | Timestamp that the project was archived                                       |
| `color`          | `string` | A hex value that represents a custom project color                            |
| `createdAt`      | `string` | Timestamp that the project was created                                        |
| `createdByUser`  | `User`   | The user that created the project                                             |
| `description`    | `string` | A longer summary of the project                                               |
| `firstPushedAt`  | `string` | Timestamp that the project first received data                                |
| `id`             | `string` | UUID                                                                          |
| `name`           | `string` | The name of the project                                                       |
| `organizationId` | `string` | UUID of the organization this project belongs to                              |
| `pushedAt`       | `string` | Timestamp that data was last received                                         |
| `repoCreatedAt`  | `string` | Timestamp that the backend storage was created                                |
| `sizeInBytes`    | `number` | The size of the project on disk in bytes                                      |
| `updatedAt`      | `string` | Timestamp that the project was last updated                                   |
| `visibility`     | `string` | Either "organization" for a team project, or "specific" for a private project |


### List all projects

`projects.list(OrganizationDescriptor?): Promise<Project[]>`

List all projects accessible through the current authentication

```js
abstract.projects.list();
```

or, get a list of projects for a specific organization…

```js
abstract.projects.list({
  organizationId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
});
```


## Organizations

![API][api-icon]


## organizations.list `(): Promise<Organization[]>`


Load the organizations accessible by the current access token

```js
abstract.organizations.list();
```


# Collections

# Branches

# Comments

## Commits

![CLI][cli-icon] ![API][api-icon]

A commit represents a point in time – contributors can create commits in the desktop app to save their work at different stages.

### The commit object

| Property                | Type       | Description                                                                             |
|-------------------------|------------|-----------------------------------------------------------------------------------------|
| `description`           | `string`   | The body of the commit comment                                                          |
| `destinationBranchId`   | `string`   | For merge commits this points to the merged into branch                                 |
| `destinationBranchName` | `string`   | For merge commits this is the name of the branch that was merged into                   |
| `fileIds`               | `string[]` | For system commits like file upgrades this represents the file UUID's that were changed |
| `parents`               | `string[]` | SHA(s) of the parent commits                                                            |
| `projectId`             | `string`   | UUID of the project this commit belongs to                                              |
| `sha`                   | `string`   | SHA that represents this commit                                                         |
| `sourceBranchId`        | `string`   | For merge commits this points to the merged from branch                                 |
| `sourceBranchName`      | `string`   | For merge commits this is the name of the branch that was merged from                   |
| `time`                  | `string`   | Timestamp of the commit                                                                 |
| `title`                 | `string`   | The title of the commit                                                                 |
| `type`                  | `string`   | The type of the commit, usually "NORMAL"                                                |
| `userId`                | `string`   | UUID of the user this commit was created by                                             |
| `userName`              | `string`   | Display name of the user this commit was created by                                     |


#### Example response 

```js
{
  description: "Just eyeballed it."
  destinationBranchId: ""
  destinationBranchName: ""
  fileIds: []
  parents: ["b56da8ffdc66b3c526f7289c175cfbb7cbf20663"]
  projectId: "ab8d54b0-502f-11e6-9379-dd323631859b"
  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a"
  sourceBranchId: ""
  sourceBranchName: ""
  time: "2018-10-19T01:19:08+02:00"
  title: "Tweaked the coloring"
  type: "NORMAL"
  userId: "c95ecfd4-6ed7-4722-9145-d2f02a34f3d7"
  userName: "Tim Van Damme"
}
```

### List all commits

`commits.list(BranchDescriptor | LayerDescriptor): Promise<Commit[]>`

List the commits for a specific branch

```js
abstract.commits.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master"
});
```

or, get a list of commits for a layer – this query will only return commits where the referenced layer was changed…

```js
abstract.commits.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19"
});
```


### Retrieve a commit 

`commits.info (CommitDescriptor): Promise<Commit>`

Load the commit info for a specific commit SHA on a branch

```js
abstract.commits.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  sha: "fb7e9b50da6c330fc43ffb369616f0cd1fa92cc2"
});
```


# Files

## files.list `(BranchDescriptor): Promise<File[]>`

![CLI][cli-icon] ![API][api-icon]

List the files for a branch at the latest commit

```js
abstract.files.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master"
});
```


## files.info `(FileDescriptor): Promise<File>`

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


# Pages

# Layers

# Previews

# Data

# Types

# Descriptors

## ProjectDescriptor

```js
{
  projectId: string,
}
```

## BranchDescriptor

```js
{
  projectId: string,
  branchId: string | "master"
}
```

## CommitDescriptor

```js
{
  projectId: string,
  branchId: string | "master",
  sha?: string
}
```

## FileDescriptor

```js
{
  projectId: string,
  branchId: string | "master",
  fileId: string,
  sha?: string
}
```

## PageDescriptor

```js
{
  projectId: string,
  branchId: string | "master",
  fileId: string,
  pageId: string,
  sha?: string
}
```

## LayerDescriptor

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

# Responses

## Project
## File

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

# Cursor

# Utility

# mapLayerChilden()

# paginate()

## ES6 Async Iteration

# abstractToken

# version

TODO
