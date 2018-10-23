---
id: reference
title: Reference
---

[cli-icon]: https://img.shields.io/badge/CLI-lightgrey.svg
[api-icon]: https://img.shields.io/badge/API-blue.svg

## Branches

![API][api-icon]

A branch is where design work and commits happen. A branch acts as a personal workspace for contributors, we encourage branches
to be created for logical chunks of work – for example designing a new feature.

  > Note: Branches will be available through the CLI transport in the near future


### The branch object

| Property               | Type     | Description                                                                                       |
|------------------------|----------|---------------------------------------------------------------------------------------------------|
| `createdAt`            | `string` | Timestamp that the branch was created                                                             |
| `description`          | `string` | A summary of the branch – this field may contain markdown.                                        |
| `divergedFromBranchId` | `string` | UUID identifier of the branch this branch diverged from                                           |
| `head`                 | `string` | SHA that represents the latest commit on the branch                                               |
| `id`                   | `string` | UUID identifier of the branch, or the string "master"                                             |
| `mergeSha`             | `string` | SHA that represents the commit where this branch was merged                                       |
| `mergedIntoBranchId`   | `string` | UUID identifier of the branch this branch was merged into                                         |
| `name`                 | `string` | The name of the branch                                                                            |
| `parent`               | `string` | UUID identifier of the branch that this branch was created from, or the string "master"           |
| `projectId`            | `string` | UUID of the project that this branch is contained within                                          |
| `startedAtSha`         | `string` | SHA that represents the commit where this branch was created                                      |
| `status`               | `string` | The current status of the branch. May be one of `active`, `wip`, `feedback`, `review`, `merged`, `archived`, `deleted`, `diverged` |
| `updatedAt`            | `string` | Timestamp that the branch was last updated                                                        |
| `userId`               | `string` | UUID of the user that created the branch                                                          |
| `userName`             | `string` | The name of the user that created the branch                                                      |

### List all branches

`branches.list(ProjectDescriptor, { filter?: "active" | "archived" | "mine" }): Promise<Branch[]>`

List the active branches for a project

```js
abstract.branches.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
}, {
  filter: "active"
});
```

### Retrieve a branch

`branches.info(BranchDescriptor): Promise<Branch>`

Load the info for a specific branch in a project

```js
abstract.branches.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master"
});
```


## Collections

![CLI][cli-icon] ![API][api-icon]

A collection is a set of layers at the same or different commits on a branch, they can be created in the desktop or web app and are used to group work together to communicate a flow, ask for review, or other use cases.

### The collection object

| Property      | Type                | Description                                                                             |
|---------------|---------------------|-----------------------------------------------------------------------------------------|
| `branchId`    | `string`            | UUID of the branch that this collection belongs to, or the string "master"              |
| `createdAt`   | `string`            | Timestamp that the collection was created                                               |
| `description` | `string`            | A description of the collection                                                         |
| `id`          | `string`            | UUID identifier of the collection                                                       |
| `layers`      | `CollectionLayer[]` | An ordered array of collection layers. Note: These are not the same as `Layer` objects. |
| `name`        | `string`            | The name of the collection                                                              |
| `projectId`   | `string`            | UUID of the project this commit belongs to                                              |
| `publishedAt` | `string`            | Timestamp that the collection was published                                             |
| `user`        | `User`              | The user that created the collection                                                    |
| `userId`      | `string`            | UUID of the user that created the collection                                            |

### List all collections

`collections.list(ProjectDescriptor | BranchDescriptor, { layersPerCollection?: number }): Promise<Collection[]>`

List all collections for a branch

```js
abstract.collections.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master"
});
```

### Retrieve a collection

`collections.info(CollectionDescriptor): Promise<Collection>`

Load an individual collection

```js
abstract.collections.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  collectionId: "413daa80-1456-11e8-b8b0-4d1fec7ae555"
});
```


## Comments

![API][api-icon]

A comment in Abstract can be left on a branch, commit, or layer. Comments on layers can also include an optional annotation that
represents a bounding area ontop of the layer, this can be used to leave comments about specific areas.

### The comment object

| Property       | Type         | Description                                                             |
|----------------|--------------|-------------------------------------------------------------------------|
| `annotation`   | `Annotation` | The optional bounding box for the comment on the layer                  |
| `body`         | `string`     | The body of the comment                                                 |
| `branchId`     | `string`     | UUID of the branch this comment is on, or the string "master"           |
| `commitSha`    | `string`     | SHA of the commit this comment was left on                              |
| `createdAt`    | `string`     | Timestamp of the comment creation time                                  |
| `deletedAt`    | `string`     | Timestamp of the comment deletion time                                  |
| `editedAt`     | `string`     | Timestamp of when the comment was last edited                           |
| `fileId`       | `string`     | UUID of the file that this comment is on                                |
| `id`           | `string`     | UUID identifier of the comment                                          |
| `layerId`      | `string`     | UUID of the layer that this comment is on                               |
| `pageId`       | `string`     | UUID of the page that this comment is on                                |
| `parentId`     | `string`     | UUID of the parent comment if this is a reply                           |
| `projectId`    | `string`     | UUID of the project that this comment is contained within               |
| `replyIds`     | `string[]`   | An array of comment UUID's that are replies to this comment             |
| `reviewStatus` | `string`     | If the comment was a review this may be one of `APPROVED` or `REJECTED` |
| `updatedAt`    | `string`     | Timestamp of when the comment was last updated                          |
| `user`         | `User`       | The user that created the comment                                       |
| `userId`       | `string`     | UUID of the user this commit was created by                             |

### List all comments

  > Not yet implemented

### Retrieve a comment

  > Not yet implemented

### Create a comment

`comments.create(BranchDescriptor | CommitDescriptor | LayerDescriptor, Comment): Promise<Comment>`

Create a comment on a branch

```js
abstract.comments.create({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master"
}, {
  body: "Hello from the Abstract SDK"
});
```

Or, perhaps create an annotation on a layer…

```js
abstract.comments.create({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a",
}, {
  body: "Hello from the Abstract SDK",
  annotation: {
    width: 100,
    height: 100,
    x: 300,
    y: 400
  }
});
```

  > Note: It's important to ensure that the annotation bounding box is within the dimensions of the layer!


## Commits

![CLI][cli-icon] ![API][api-icon]

A commit represents a point in time – contributors can create commits in the desktop app to save their work at different stages. When loading data from the Abstract SDK you will almost always need to provide a commit `SHA`
to identify which version of the object you would like.

### The commit object

| Property                | Type       | Description                                                                             |
|-------------------------|------------|-----------------------------------------------------------------------------------------|
| `description`           | `string`   | The body of the commit comment                                                          |
| `destinationBranchId`   | `string`   | For merge commits this points to the merged into branch                                 |
| `destinationBranchName` | `string`   | For merge commits this is the name of the branch that was merged into                   |
| `fileIds`               | `string[]` | For system commits like file upgrades this represents the file UUID's that were changed |
| `parents`               | `string[]` | SHA(s) of the parent commits                                                            |
| `projectId`             | `string`   | UUID of the project this commit belongs to                                              |
| `sha`                   | `string`   | SHA of the hashed content of the commit. This acts as the unique identifer.             |
| `sourceBranchId`        | `string`   | For merge commits this points to the merged from branch                                 |
| `sourceBranchName`      | `string`   | For merge commits this is the name of the branch that was merged from                   |
| `time`                  | `string`   | Timestamp of the commit                                                                 |
| `title`                 | `string`   | The title of the commit                                                                 |
| `type`                  | `string`   | The type of the commit, may be one of `NORMAL`, `PROJECT_CREATED`, `FILE_ADDED`, `FILE_RENAMED`, `FILE_DELETED`, `FILE_REPLACED`, `LIBRARY_ADDED`, `LIBRARY_REMOVED`, `RESTORE`, `UPDATE`, `MERGE`                |
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


## Data

![CLI][cli-icon] ![API][api-icon]

### The data object

| Property    | Type        | Description                                                         |
|-------------|-------------|---------------------------------------------------------------------|
| `branchId`  | `string`    | UUID of the branch that this layer is contained within              |
| `fileId`    | `string`    | UUID of the file that this layer is contained within                |
| `layerId`   | `string`    | UUID of the layer that this data is loaded from                     |
| `layers`    | `{string: LayerData }` | An object that describes the child layers                |
| `projectId` | `string`    | UUID of the project that this data is contained within              |
| `sha`       | `string`    | SHA of the commit where the layer was last changed                  |

#### LayerData

| Property      | Type              | Description                                     |
|---------------|-------------------|-------------------------------------------------|
| `childIds`    | `string[]`        | Array of UUID's for the layers children, if any |
| `id`          | `string`          | UUID of the chid layer                          |
| `libraryId`   | `string`          | UUID of the library file this layer is from     |
| `libraryName` | `string`          | The name of the library file this layer is from |
| `parentId`    | `string`          | UUID of the parent layer, if any                |
| `properties`  | `LayerProperties` | Layer properties (to be documented)             |
| `symbolId`    | `string`          | UUID of the parent symbol, if any               |
| `type`        | `string`          | One of `artboard`, `layer`, `symbolMaster`, `symbolInstance`, `group`, `text`, `bitmap`, `shapeGroup`, `shapePath`, `rectangle`, `oval`, `polygon`, `triangle`, `star`, `page`, `slice`, `hotspot` |


### Retrieve layer data

`data.info(LayerDescriptor): Promise<Data>`

```js
abstract.data.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a"
});
```


## Files

A file represents a standard file – in Abstract a file is always loaded from a specific commit `SHA`, or point in time.

![CLI][cli-icon] ![API][api-icon]

### The file object

| Property                     | Type      | Description                                                     |
|------------------------------|-----------|-----------------------------------------------------------------|
| `applicationDocumentVersion` | `number`  | The application (eg Sketch's) version of the file               |
| `applicationVersion`         | `string`  | The version of the application the file was created with        |
| `id`                         | `string`  | UUID identifier for the file                                    |
| `isLibrary`                  | `boolean` | Is this file a library file or not                              |
| `lastChangedAtSha`           | `string`  | SHA that represents the commit where this file was last changed |
| `name`                       | `string`  | The name of the file                                            |
| `projectId`                  | `string`  | UUID of the project this file belongs to                        |
| `sha`                        | `string`  | SHA that this file was loaded at                                |
| `type`                       | `string`  | The application that the file was created in                    |

### List all files

`files.list(BranchDescriptor): Promise<File[]>`

List the files for a branch at the latest commit

```js
abstract.files.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master"
});
```

### Retrieve a file 

`files.info(FileDescriptor): Promise<File>`

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


## Layers

![CLI][cli-icon] ![API][api-icon]

A layer is a container for designs. In Sketch a layer usually represents an artboard however it can also be a non-contained layer floating on the page.

### The layer object

| Property           | Type     | Description                                                              |
|--------------------|----------|--------------------------------------------------------------------------|
| `fileId`           | `string` | UUID of the file that this layer is contained within                     |
| `height`           | `number` | The height of the layer in pixels                                        |
| `id`               | `string` | UUID identifier of the layer                                             |
| `lastChangedAtSha` | `string` | SHA of the commit where the layer was last changed                       |
| `libraryId`        | `string` | UUID of the library file that this layer was included from               |
| `name`             | `string` | The name of the layer                                                    |
| `order`            | `number` | The order of the layer in the page                                       |
| `pageId`           | `string` | UUID of the page that this layer is contained within                     |
| `projectId`        | `string` | UUID of the project that this layer is contained within                  |
| `sha`              | `string` | SHA of the commit this layer was loaded at                               |
| `type`             | `string` | The type of the layer, eg "artboard"                                     |
| `updatedAt`        | `string` | Timestamp of the commit that this layer was last changed                 |
| `width`            | `number` | The width of the layer in pixels                                         |
| `x`                | `number` | The horizontal position of the layer on the page, measured from the left |
| `y`                | `number` | The vertical position of the layer on the page, measured from the top    |

### List all layers


`layers.list(FileDescriptor | PageDescriptor, { limit?: number, offset?: number }): Promise<Layer[]>`

List the layers for a file at a commit

```js
abstract.layers.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  sha: "fb7e9b50da6c330fc43ffb369616f0cd1fa92cc2"
});
```

As a file can contain a lot of layers we recommend filtering by page and adding a limit…

```js
abstract.layers.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
  sha: "fb7e9b50da6c330fc43ffb369616f0cd1fa92cc2"
}, {
  limit: 25,
  offset: 0
});
```

### Retrieve a layer

`layers.info(LayerDescriptor): Promise<Layer>`

Load the info for a layer in a file at the latest commit on a branch

```js
abstract.layers.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19"
});
```


## Organizations

![API][api-icon]

Organizations contain users and projects.

### The organization object

| Property                   | Type       | Description                                                                              |
|----------------------------|------------|------------------------------------------------------------------------------------------|
| `createdAt`                | `string`   | Timestamp that the organization was created                                              |
| `hasBillingInfo`           | `boolean`  | Whether this organization has billing information on file                                |
| `id`                       | `string`   | UUID                                                                                     |
| `isUsernameOrganization`   | `boolean`  | A username organization is a free organization included with every user account          |
| `isWithinSubscriptionTerm` | `boolean`  | Whether the organizations subscription is in good standing                               |
| `logoUrl`                  | `string`   | A url for the organization logo                                                          |
| `name`                     | `string`   | The name of the organization                                                             |
| `restrictedToDomains`      | `string[]` | An optional list of domain names that invitations to this organization are restricted to |
| `trialEndsAt`              | `string`   | Timestamp of when the trial ends, if within trial period                                 |
| `updatedAt`                | `string`   | Timestamp that the organization was last updated                                         |
| `userId`                   | `string`   | UUID of the user that created the organization                                           |


### List all organizations

`organizations.list(): Promise<Organization[]>`

Load the organizations accessible by the current access token

```js
abstract.organizations.list();
```

### Retrive an organization

  > Not yet implemented


## Pages

A page is a container for layers, often a file will have several pages to organize design work.

![CLI][cli-icon] ![API][api-icon]

### The page object

| Property    | Type     | Description                                                  |
|-------------|----------|--------------------------------------------------------------|
| `fileId`    | `string` | UUID of the file that this page is contained within          |
| `id`        | `string` | UUID identifier for the page                                 |
| `name`      | `string` | The name of the page                                         |
| `order`     | `number` | The order of the page in the file                            |
| `projectId` | `string` | UUID of the project this page belongs to                     |
| `sha`       | `string` | SHA of the commit this page was loaded at                    |
| `type`      | `string` | This field has the value "library" for virtual library pages |

### List all pages

`pages.list(FileDescriptor): Promise<Page[]>`

List the pages for a file at a commit

```js
abstract.pages.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  sha: "fb7e9b50da6c330fc43ffb369616f0cd1fa92cc2"
});
```

### Retrieve a page

`pages.info(PageDescriptor): Promise<Page>`

Load the info for a page in a file at the latest commit on a branch

```js
abstract.pages.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A"
});
```


## Previews

![API][api-icon]

A preview is an image file that represents the rendered version of a layer. In Abstract all previews are currently
only available in PNG format.

### The preview object

| Property | Type     | Description                                                       |
|----------|----------|-------------------------------------------------------------------|
| `webUrl` | `string` | A url to where this preview can be loaded in the Abstract web app |

### Retrieve an image file

`previews.raw(LayerDescriptor): Promise<ArrayBuffer>`

Load the preview image for a layer at a commit. The resulting `Buffer` can be used with node `fs` API's – for example you can write the image to disk:

```js
const buffer = await abstract.previews.raw({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a"
});

fs.writeFile(`preview.png`, buffer, (err) => {
  if (err) throw err;
  console.log("Preview image written!");
});
```

### Retrieve a preview

`previews.info(LayerDescriptor): Promise<Preview>`

Load the info for a layer preview

```js
abstract.previews.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a"
});
```


## Projects

![API][api-icon]

A project is a container for files, it belongs to an organization. Teams use projects to logically separate their files
for example for a project, a platform (e.g. Web / iOS), or by client.

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

### Retrive a project

  > Not yet implemented


## Descriptors

Reference for the parameters required to load resources with Abstract SDK.

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

### CollectionDescriptor

```js
{
  projectId: string,
  branchId: string | "master",
  collectionId: string
}
```
