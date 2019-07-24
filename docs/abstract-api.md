---
id: abstract-api
title: Client
---

[cli-icon]: https://img.shields.io/badge/CLI-lightgrey.svg
[api-icon]: https://img.shields.io/badge/API-blue.svg


## Activities

An activity represents a designated type of event within a project. These events can be specific to the project itself, or they can be specific to a collection, a branch, a commit, or a review within the project.

### The activity object

| Property      | Type                | Description                                                                             |
|---------------|---------------------|-----------------------------------------------------------------------------------------|
| `branchId`    | `string`            | UUID of the branch that this activity was triggered on                                  |
| `createdAt`   | `string`            | Timestamp at which the activity was triggered                                           |
| `id`          | `string`            | UUID identifier of the activity                                                         |
| `payload`     | `Object`            | Object containing information specific to this type of activity                         |
| `type`        | `string`            | The type of this activity, may be one of `BRANCH_ARCHIVED`, `BRANCH_CREATED`, `BRANCH_DELETED`, `BRANCH_DESCRIPTION_UPDATED`, `BRANCH_RENAMED`, `BRANCH_STATUS_UPDATED`, `BRANCH_UNARCHIVED`, `COLLECTION_PUBLISHED`, `COMMENT_CREATED`, `COMMIT`, `MERGE_COMMIT`, `PROJECT_ARCHIVED`, `PROJECT_CREATED`, `PROJECT_DELETED`, `PROJECT_DESCRIPTION_CHANGED`, `PROJECT_RENAMED`, `PROJECT_TRANSFERRED`, `PROJECT_UNARCHIVED`, `REVIEWER_REMOVED`, `REVIEW_COMPLETED`, `REVIEW_DISMISSED`, `REVIEW_REQUESTED`, `UPDATE_COMMIT` |
| `userId`      | `string`            | UUID of the user that triggered this activity                                           |

### List all activities

![API][api-icon]

`activities.list(BranchDescriptor | OrganizationDescriptor | ProjectDescriptor, { limit?: number, offset?: number }): Promise<Activity[]>`

List the first two activities for a given project on a specific branch

```js
abstract.activities.list({
  branchId: "8a13eb62-a42f-435f-b3a3-39af939ad31b",
  projectId: "b8bf5540-6e1e-11e6-8526-2d315b6ef48f",
}, { limit: 2 });
```

### Retrieve an activity

![API][api-icon]

`activities.info(ActivityDescriptor): Promise<Activity>`

Load the info for an activity

```js
abstract.activities.info({
  activityId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
});
```


[cli-icon]: https://img.shields.io/badge/CLI-lightgrey.svg
[api-icon]: https://img.shields.io/badge/API-blue.svg


## Assets

An asset represents a resource exported from a design file. Assets are automatically updated and available for new commits.

> Note: Assets are only supported when using a Business or Enterprise plan. More information on Abstract plan types can be found [here](https://www.abstract.com/pricing/).

### The asset object

| Property      | Type                | Description                                                                             |
|---------------|---------------------|-----------------------------------------------------------------------------------------|
| `createdAt`   | `string`            | Timestamp at which the asset was created                                                |
| `defaultAbstractFormat` | `boolean` | Indicates if this asset is the default asset for a layer                                |
| `fileFormat`  | `string`            | File type of this asset                                                                 |
| `fileId`      | `string`            | File ID of this asset                                                                   |
| `formatName`  | `string`            | Format of this file, e.g. "2x"                                                          |
| `id`          | `string`            | UUID identifier of the asset                                                            |
| `layerId`     | `string`            | UUID of the layer this asset belongs to                                                 |
| `layerName`   | `string`            | Name of the layer this asset belongs to                                                 |
| `namingScheme`| `string`            | Determines how the `formatName` is applied when constructing the filename for this asset. "1" means the `formatName` will be used as a prefix, "0" means it will be used as a suffix. |
| `nestedLayerId` | `string`          | ID of the nested layer this asset belongs to                                            |
| `projectId`   | `string`            | ID of the project this asset belongs to                                                 |
| `scale`       | `string`            | Scale of this asset in Sketch, e.g. "1.00"                                              |
| `sha`         | `string`            | SHA of the commit containing the version of the file this asset belongs to              |
| `url`         | `string`            | Direct URL to the asset file                                                            |

### List all assets

![API][api-icon]

`assets.list(BranchDescriptor): Promise<Asset[]>`

List all assets for a commit on a given branch of a project

```js
abstract.assets.list({
  branchId: "8a13eb62-a42f-435f-b3a3-39af939ad31b",
  projectId: "b8bf5540-6e1e-11e6-8526-2d315b6ef48f",
  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a", // or sha: "latest"
});
```

### Retrieve an asset

![API][api-icon]

`asset.info(AssetDescriptor): Promise<Asset>`

Load the info for an asset

```js
abstract.assets.info({
  assetId: "fcd67bab-e5c3-4679-b879-daa5d5746cc2",
  projectId: "b8bf5540-6e1e-11e6-8526-2d315b6ef48f"
});
```

### Retrieve an asset file

![API][api-icon]

`asset.raw(AssetDescriptor, { filename?: string, disableWrite?: boolean }): Promise<ArrayBuffer>`

Retrieve a given asset file based on its ID and save it to disk. Files will be saved to the current working directory by default, but a custom `filename` option can be used to customize this location.

```js
abstract.assets.raw({
  assetId: "fcd67bab-e5c3-4679-b879-daa5d5746cc2",
  projectId: "b8bf5540-6e1e-11e6-8526-2d315b6ef48f"
});
```

The resulting `ArrayBuffer` can be also be used with node `fs` APIs directly. For example, it's possible to write the image to disk manually after post-processing it:

```js
const arrayBuffer = await abstract.assets.raw({
  assetId: "fcd67bab-e5c3-4679-b879-daa5d5746cc2",
  projectId: "b8bf5540-6e1e-11e6-8526-2d315b6ef48f"
}, {
  disableWrite: true
});

processedBuffer = postProcess(arrayBuffer);

fs.writeFile("asset.png", Buffer.from(processedBuffer), (err) => {
  if (err) throw err;
  console.log("Asset image written!");
});
```


## Branches

A branch is where design work and commits happen. A branch acts as a personal workspace for contributors, we encourage branches
to be created for logical chunks of work – for example designing a new feature.

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

![CLI][cli-icon] ![API][api-icon]

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

![CLI][cli-icon] ![API][api-icon]

`branches.info(BranchDescriptor): Promise<Branch>`

Load the info for a specific branch in a project

```js
abstract.branches.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master"
});
```


## Changesets

A changeset is a group of changes that together form a single, indivisible modification to a project. Changesets include data on all visual and nonvisual changes and provide insight into the differences between two versions of a project.

### The changeset object

| Property       | Type                | Description                                                                             |
|----------------|---------------------|-----------------------------------------------------------------------------------------|
| `branchId`     | `string`            | UUID of the branch that this changeset is part of, or the string "master"               |
| `changes`      | `ChangesetChange[]` | List of changes that make up this changeset                                             |
| `compareToSha` | `string`            | SHA of the commit introducing changes in this changeset                                 |
| `id`           | `string`            | UUID identifier of the changeset                                                        |
| `projectId`    | `string`            | UUID of the project this changeset belongs to                                           |
| `sha`          | `string`            | SHA of the base commit in this changeset that changes are against                       |

#### ChangesetChange

| Property       | Type                             | Description                                                |
|----------------|----------------------------------|------------------------------------------------------------|
| `type`         | `string`                         | Type of this change, can be one of `file`, `page`, `layer`, `symbol`, `artboard`, `colors`, `gradient`, `layer-style`, `text-style` |
| `status`       | `string`                         | Status of this change, can be one of `added`, `deleted`, `edited`, `edited-indirectly`, `none` |
| `hasPreview`   | `boolean`                        | Indicates if this change has a visual preview              |
| `meta`         | `{ [key: string]: [any, any] }`  | Object containing additional information about this change |
| `fileId`       | `string`                         | UUID of the file this change was made against              |
| `pageId`       | `string`                         | UUID of the page this change was made against              |
| `layerId`      | `string`                         | UUID of the layer this change was made against             |
| `colorsId`     | `string`                         | UUID of the color associated with this change              |
| `gradientId`   | `string`                         | UUID of the gradient associated with this change           |
| `layerStyleId` | `string`                         | UUID of the layer style associated with this change        |
| `textStyleId`  | `string`                         | UUID of the text style associated with this change         |

### Retrieve a changeset

![CLI][cli-icon] ![API][api-icon]

`changesets.info(CommitDescriptor): Promise<Changeset>`

Load an individual changeset

```js
abstract.changesets.info({
  branchId: "master",
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  sha: "e2a0a301c4a530ec16024cbb339dfc135c841b10"
});
```


## Collections

A collection is a set of layers at the same or different commits on a branch, they can be created in the desktop or web app and are used to group work together to communicate a flow, ask for review, or other use cases.

### The collection page object

| Property | Type | Description |
| collections | Collection[] | Array of collections |
| files | File[] | Array of files |
| pages | Page[] | Array of pages |
| layers | Layer[] | Array of layers |

#### The collection object

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

![CLI][cli-icon] ![API][api-icon]

`collections.list(ProjectDescriptor | BranchDescriptor, { layersPerCollection?: number }): Promise<CollectionPage>`

List all collections for a branch

```js
abstract.collections.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master"
});
```

### Retrieve a collection

![CLI][cli-icon] ![API][api-icon]

`collections.info(CollectionDescriptor): Promise<CollectionPage>`

Load an individual collection

```js
abstract.collections.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  collectionId: "413daa80-1456-11e8-b8b0-4d1fec7ae555"
});
```

### Create a collection

![CLI][cli-icon] ![API][api-icon]

`collections.create(ProjectDescriptor, NewCollection): Promise<Collection>`

Create a new collection

```js
abstract.collections.create({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
}, {
  name: "Test collection",
  description: "Test description",
  branchId: "c426d0a6-e039-43d7-b7b3-e685a25e4cfb"
});
```

### Update a collection

![CLI][cli-icon] ![API][api-icon]

`collections.update(CollectionDescriptor, UpdatedCollection): Promise<Collection>`

Update an existing collection

```js
abstract.collections.update({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  collectionId: "413daa80-1456-11e8-b8b0-4d1fec7ae555"
}, {
  name: "New name"
});
```


## Comments

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

![API][api-icon]

`comments.list(BranchDescriptor | CommitDescriptor | PageDescriptor | LayerDescriptor): Promise<Comment[]>`

List the comments for a specific project
```js
abstract.comments.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
});
```

or, list the first two comments for a specific layer...

```js
abstract.comments.list({
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
}, { limit: 2 });
```

### Retrieve a comment

![API][api-icon]

`comments.info(CommentDescriptor): Promise<Comment>`

Load the info for a comment

```js
abstract.comments.info({
  commentId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
});
```

### Create a comment

![API][api-icon]

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
  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a", // or sha: "latest"
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

![CLI][cli-icon] ![API][api-icon]

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
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
  sha: "latest"
});
```

### Retrieve a commit

![CLI][cli-icon] ![API][api-icon]

`commits.info (FileDescriptor | LayerDescriptor | CommitDescriptor): Promise<Commit>`

Load the commit info for a specific commit SHA on a branch

```js
abstract.commits.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  sha: "fb7e9b50da6c330fc43ffb369616f0cd1fa92cc2"
});
```


## Data

### The LayerDataset object

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

![CLI][cli-icon] ![API][api-icon]

`data.info(LayerDescriptor): Promise<LayerDataset>`

```js
abstract.data.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a" // or sha: "latest"
});
```


## Files

A file represents a standard file – in Abstract a file is always loaded from a specific commit `SHA`, or point in time.

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
| `updatedAt`                  | `string`  | The timestamp of the last change to the file                    |

### List all files

![CLI][cli-icon] ![API][api-icon]

`files.list(BranchDescriptor): Promise<File[]>`

List the files for a branch at the latest commit

```js
abstract.files.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  sha: "latest"
});
```

### Retrieve a file

![CLI][cli-icon] ![API][api-icon]

`files.info(FileDescriptor): Promise<File>`

Load the file info for the latest commit on a branch

```js
abstract.files.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7"
  sha: "latest"
});
```

### Retrieve an Sketch file

![CLI][cli-icon]

`files.raw(FileDescriptor, { filename?: string, disableWrite?: boolean }): Promise<ArrayBuffer>`

Retrieve a Sketch file from Abstract based on its file ID and save it to disk. Files will be saved to the current working directory by default, but a custom `filename` option can be used to customize this location.

```js
abstract.files.raw({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7"
  sha: "latest"
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

![CLI][cli-icon] ![API][api-icon]

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

![CLI][cli-icon] ![API][api-icon]

`layers.info(LayerDescriptor): Promise<Layer>`

Load the info for a layer in a file at the latest commit on a branch

```js
abstract.layers.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
  sha: "latest"
});
```


## Memberships

A membership contains information about a user's role within an organization or a project. A membership is created when a user joins an organization or is given access to a project.

### The membership object

| Property          | Type     | Description                                                  |
|-------------------|----------|--------------------------------------------------------------|
| `createdAt`       | `string` | Timestamp indicating when this membership was created        |
| `organizationId`  | `string` | UUID of the organization this membership belongs to          |
| `projectId`       | `string` | UUID of the project this membership belongs to               |
| `role`            | `string` | Type of this membership                                      |
| `userId`          | `string` | UUID of the user that this membership represents             |
| `user`            | `User`   | The user that this membership represents                     |

### List all memberships

![API][api-icon]

`memberships.list(OrganizationDescriptor | ProjectDescriptor): Promise<Membership[]>`

List the members of an organization

```js
abstract.memberships.list({
  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
});
```

### Retrieve a membership

![API][api-icon]

`memberships.info(OrganizationMembershipDescriptor | ProjectMembershipDescriptor): Promise<Membership>`

Load the info for a specific member

```js
abstract.memberships.info({
  userId: "48b5d670-2002-45ea-929d-4b00863778e4",
  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
});
```


## Notifications

A notification is a user-facing message triggered by an underlying activity. Notifications are both viewable and dismissable in the desktop application.

### The notification object

| Property           | Type     | Description                                                                         |
|--------------------|---------------------|--------------------------------------------------------------------------|
| `branchId`         | `string` | UUID of the branch that triggered this notification, if applicable                  |
| `commentId`        | `string` | UUID of the comment that triggered this notification, if applicable                 |
| `createdAt`        | `string` | Timestamp at which the notification was sent                                        |
| `id`               | `string` | UUID identifier of the notification                                                 |
| `initiatingUser`   | `User`   | User that triggered this notification, if applicable                                |
| `initiatingUserId` | `string` | UUID of the user that triggered this notification, if applicable                    |
| `messageType`      | `string` | The type of this activity that triggered this notification, may be one of `BRANCH_ARCHIVED`, `BRANCH_CREATED`, `BRANCH_DELETED`, `BRANCH_DESCRIPTION_UPDATED`, `BRANCH_RENAMED`, `BRANCH_STATUS_UPDATED`, `BRANCH_UNARCHIVED`, `COLLECTION_PUBLISHED`, `COMMENT_CREATED`, `COMMIT`, `MERGE_COMMIT`, `PROJECT_ARCHIVED`, `PROJECT_CREATED`, `PROJECT_DELETED`, `PROJECT_DESCRIPTION_CHANGED`, `PROJECT_RENAMED`, `PROJECT_TRANSFERRED`, `PROJECT_UNARCHIVED`, `REVIEWER_REMOVED`, `REVIEW_COMPLETED`, `REVIEW_DISMISSED`, `REVIEW_REQUESTED`, `UPDATE_COMMIT` |
| `organization`     | `string` | Organization that triggered this notification, if applicable                        |
| `organizationId`   | `string` | UUID of the organization that triggered this notification, if applicable            |
| `project`          | `string` | Project that triggered this notification, if applicable                             |
| `projectId`        | `string` | UUID of the project that triggered this notification, if applicable                 |
| `payload`          | `Object` | Object containing information specific to activity that triggered this notification |
| `readAt`           | `string` | Timestamp at which the notification was read or dismissed                           |

### List notifications

![API][api-icon]

`notifications.list(OrganizationDescriptor, { limit?: number, offset?: number }): Promise<Notification[]>`

List the first two notifications for a given organization

```js
abstract.notifications.list({
  organizationId: "8a13eb62-a42f-435f-b3a3-39af939ad31b"
}, { limit: 2 });
```

### Retrieve a notification

![API][api-icon]

`notifications.info(NotificationDescriptor): Promise<Notification>`

Load the info for a notification

```js
abstract.notifications.info({
  notificationId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
});
```


## Organizations

Organizations contain users and projects.

### The organization object

| Property                   | Type       | Description                                                                              |
|----------------------------|------------|------------------------------------------------------------------------------------------|
| `features`                 | `{[feature: string]: boolean}` | Map of feature flags enabled for this organization                   |
| `hasBillingInfo`           | `boolean`  | Whether this organization has billing information on file                                |
| `id`                       | `string`   | UUID                                                                                     |
| `isUsernameOrganization`   | `boolean`  | A username organization is a free organization included with every user account          |
| `isWithinSubscriptionTerm` | `boolean`  | Whether the organizations subscription is in good standing                               |
| `logoUrl`                  | `string`   | A url for the organization logo                                                          |
| `name`                     | `string`   | The name of the organization                                                             |
| `privateProjectPublicSharingEnabled` | `boolean` | Flag indicating if this organization has sharing of private projects enabled    |
| `publicSharingEnabled`     | `boolean`  | Flag indicating if this organization has sharing of public projects enabled              |
| `restrictedToDomains`      | `string[]` | An optional list of domain names that invitations to this organization are restricted to |
| `trialEndsAt`              | `string`   | Timestamp of when the trial ends, if within trial period                                 |
| `userId`                   | `string`   | UUID of the user that created the organization                                           |

### List all organizations

![API][api-icon]

`organizations.list(): Promise<Organization[]>`

Load the organizations accessible by the current access token

```js
abstract.organizations.list();
```

### Retrieve an organization

![API][api-icon]

`organizations.info(OrganizationDescriptor): Promise<Organization>`

Load the info for an organization

```js
abstract.organizations.info({
  organizationId: "8a13eb62-a42f-435f-b3a3-39af939ad31b"
});
```


## Pages

A page is a container for layers, often a file will have several pages to organize design work.

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

![CLI][cli-icon] ![API][api-icon]

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

![CLI][cli-icon] ![API][api-icon]

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

A preview is an image file that represents the rendered version of a layer. In Abstract all previews are currently
only available in PNG format.

### The preview object

| Property | Type     | Description                                                       |
|----------|----------|-------------------------------------------------------------------|
| `webUrl` | `string` | A url to where this preview can be loaded in the Abstract web app |

### Retrieve an image file

![API][api-icon]

`previews.raw(LayerDescriptor, { filename?: string, disableWrite?: boolean }): Promise<ArrayBuffer>`

Retrieve a preview image for a layer at a specific commit and save it to disk. Files will be saved to the current working directory by default, but a custom `filename` option can be used to customize this location.

```js
const arrayBuffer = await abstract.previews.raw({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a" // or sha: "latest"
});
```

The resulting `ArrayBuffer` can be also be used with node `fs` APIs directly. For example, it's possible to write the file to disk manually after post-processing it:

```js
const arrayBuffer = await abstract.previews.raw({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a" // or sha: "latest"
}, {
  disableWrite: true
});

processedBuffer = postProcess(arrayBuffer);

fs.writeFile(`preview.png`, Buffer.from(processedBuffer), (err) => {
  if (err) throw err;
  console.log("Preview image written!");
});
```

### Retrieve a preview image url

![API][api-icon]

> Note: The `previews.url` method requires an environment with [URL.createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL). If you are using node, you will need to save the image to a file with [`previews.raw`](#retrieve-an-image-file)

`previews.url(LayerDescriptor): Promise<string>`

> Get an image as a _temporary_ blob url which can be displayed directly in an image tag or downloaded. The url exists only as long as the current browser session and should not be saved to a database directly.

```js
abstract.previews.url({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a" // or sha: "latest"
});
```

### Retrieve a preview

![API][api-icon]

`previews.info(LayerDescriptor): Promise<Preview>`

Load the info for a layer preview

```js
abstract.previews.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a" // or sha: "latest"
});
```


## Projects

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

![API][api-icon]

`projects.list(OrganizationDescriptor?, { filter?: "active" | "archived" }): Promise<Project[]>`

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

or, get a list of active projects for a specific organization…

```js
abstract.projects.list({
  organizationId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
}, { filter: "active" });
```

### Retrieve a project

![API][api-icon]

`projects.info(ProjectDescriptor): Promise<Project>`

Load the info for a project

```js
abstract.projects.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
});
```



## Shares

A share is a shareable url to an object in Abstract. You can use the desktop or web app to create a share url.

> Note: The format of a share url is `https://share.goabstract.com/<UUID>`.

### The share object

| Property         | Type     | Description                                                                                    |
|------------------|----------|------------------------------------------------------------------------------------------------|
| `descriptor`     | [Descriptor](#Descriptor) | A descriptor for the shared object                                            |
| `appUrl`         | `string`                  | A url that can be used to open the desktop app                                |
| `userId`         | `string`                  | UUID of the user that created the share                                       |
| `id`             | `string`                  | UUID                                                                          |

> Note: The `descriptor` property can be used as the first argument for many of the SDK methods

### Load info for a share

![API][api-icon]

`shares.info(ShareDescriptor): Promise<Share>`

```js
abstract.shares.info({
  url: 'https://share.goabstract.com/49b1f582-a8b4-46ca-8c86-bbc675fe27c4'
});
```

or, by id…

```js
abstract.shares.info({
  shareId: '49b1f582-a8b4-46ca-8c86-bbc675fe27c4'
});
```

### Using share.descriptor

![API][api-icon]

List all files for branch's share url

```js
const branchShare = await abstract.share.info({
  url: 'https://share.goabstract.com/49b1f582-a8b4-46ca-8c86-bbc675fe27c4'
})

const branchFiles = await abstract.files.list(branchShare.descriptor);
```

### Create a share

![API][api-icon]

`shares.create(OrganizationDescriptor, InputShare): Promise<Share>`

Create a layer share in your organization

```js
abstract.shares.create({
  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
}, {
  kind: "layer",
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a" // or sha: "latest"
});
```

## Users

A user contains information specific to an individual account. Users are global to Abstract and are not specific to organizations. A user is created in the application by creating a new account.

### The user object

| Property          | Type     | Description                                                  |
|-------------------|----------|--------------------------------------------------------------|
| `avatarUrl`       | `string` | URL of the avatar for this user                              |
| `createdAt`       |  `string`| Timestamp indicating when this account was created           |
| `deletedAt`       | `string` | Timestamp indicating when this account was deleted           |
| `id`              | `string` | UUID identifier for the user                                 |
| `name`            | `string` | The name of the page                                         |
| `primaryEmailId`  | `string` | ID of the primary email for this user                        |
| `updatedAt`       | `string` | Timestamp indicating when this account was updated           |
| `username`        | `string` | Username associated with this user                           |

### List all users

![API][api-icon]

`users.list(OrganizationDescriptor | ProjectDescriptor): Promise<User[]>`

List the users in an organization

```js
abstract.users.list({
  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
});
```

### Retrieve a user

![API][api-icon]

`users.info(UserDescriptor): Promise<User>`

Load the info for a specific user

```js
abstract.users.info({
  userId: "48b5d670-2002-45ea-929d-4b00863778e4"
});
```


## Descriptors

Reference for the parameters required to load resources with Abstract SDK.

### OrganizationDescriptor

```js
{ organizationId: string }
```

### ProjectDescriptor

```js
{ projectId: string }
```

### ShareDescriptor

```js
{ url: string } | { shareId: string }
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
  sha: string
}
```

### FileDescriptor

```js
{
  projectId: string,
  branchId: string | "master",
  fileId: string,
  sha: string | "latest"
}
```

### PageDescriptor

```js
{
  projectId: string,
  branchId: string | "master",
  fileId: string,
  pageId: string,
  sha: string
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
  sha: string | "latest"
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

### ActivityDescriptor

```js
{ activityId: string }
```

### NotificationDescriptor

```js
{ notificationId: string }
```

### CommentDescriptor
 ```js
{ commentId: string }
```

### UserDescriptor

 ```js
{ userId: string }
```

### AssetDescriptor

```js
{
  assetId: string,
  projectId: string
}
```

### OrganizationProjectDescriptor

```js
{
  projectId: string,
  userId: string
}
```

### ProjectMembershipDescriptor

```js
{
  organizationId: string,
  userId: string
}
```
