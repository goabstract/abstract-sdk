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

`activities.list(BranchDescriptor | OrganizationDescriptor | ProjectDescriptor, ListOptions): CursorPromise<Activity[]>`

List the first two activities for a given project on a specific branch

```js
abstract.activities.list({
  branchId: "8a13eb62-a42f-435f-b3a3-39af939ad31b",
  projectId: "b8bf5540-6e1e-11e6-8526-2d315b6ef48f",
}, { limit: 2 });
```

> Note: This endpoint returns a special type of `Promise` called a `CursorPromise` that supports cursor-based pagination. Additional information can be found [here](/docs/pagination).

### Retrieve an activity

![API][api-icon]

`activities.info(ActivityDescriptor, RequestOptions): Promise<Activity>`

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

### Retrieve an asset

![API][api-icon]

`asset.info(AssetDescriptor, RequestOptions): Promise<Asset>`

Load the info for an asset

```js
abstract.assets.info({
  assetId: "fcd67bab-e5c3-4679-b879-daa5d5746cc2",
  projectId: "b8bf5540-6e1e-11e6-8526-2d315b6ef48f"
});
```

### List assets for a file

![API][api-icon]

`assets.file(FileDescriptor, ListOptions): CursorPromise<Asset[]>`

List the first ten assets for a given file

```js
abstract.assets.file({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  sha: "latest"
}, {
  limit: 10
});
```

> Note: This endpoint returns a special type of `Promise` called a `CursorPromise` that supports cursor-based pagination. More information can be found [here](/docs/pagination).

### List assets for a commit

`assets.commit(BranchCommitDescriptor, RequestOptions): Promise<Asset[]>`

List all assets generated for a commit

```js
abstract.assets.commit({
  branchId: "8a13eb62-a42f-435f-b3a3-39af939ad31b",
  projectId: "b8bf5540-6e1e-11e6-8526-2d315b6ef48f",
  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a", // or sha: "latest"
});
```

### Export an asset file

![API][api-icon]

`asset.raw(AssetDescriptor, RawOptions}): Promise<ArrayBuffer>`

Retrieve a given asset file based on its ID and save it to disk. **Files will be saved to the current working directory by default**, but a custom `filename` option can be used to customize this location, or `disableWrite` can be used to disable automatic saving altogether.

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

### Example: Save all assets for a given file

```js
// Get all assets for a given file
const assets = await abstract.assets.file({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  sha: "latest"
});

// Save the raw file for each asset to the current working directory
await Promise.all(assets.map(asset => abstract.assets.raw({
    id: asset.id,
    projectId: asset.projectId
})));
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

`branches.list(ProjectDescriptor, { ...RequestOptions, filter?: "active" | "archived" | "mine", search?: string }): Promise<Branch[]>`

List the active branches for a project

```js
abstract.branches.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
}, {
  filter: "active"
});
```

Search for a branch by name across all projects 

```js
abstract.branches.list(undefined, {
  search: "branch name"
});
```

> Note: Searching for branches is only available when using the [API transport](/docs/transports).

### Retrieve a branch

![CLI][cli-icon] ![API][api-icon]

`branches.info(BranchDescriptor, RequestOptions): Promise<Branch>`

Load the info for a specific branch in a project

```js
abstract.branches.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master"
});
```

## BranchMergeState

A branch merge state is a description of whether a branch can be cleanly merged to its parent branch.

### The branch merge state object

| Property               | Type     | Description                                                                                       |
|------------------------|----------|---------------------------------------------------------------------------------------------------|
| `state`                | `string` | The merge state of the branch relative to its parent branch. May be one of `CLEAN`, `NEEDS_UPDATE`, or `NEEDS_REMOTE_UPDATE` |
| `parentId`             | `string` | UUID of the parent branch                                                                         |
| `parentCommit`         | `string` | SHA that represents the latest commit on the parent branch                                        |
| `branchId`             | `string` | UUID identifier of the branch, or the string "master"                                             |
| `branchCommit`         | `string` | SHA that represents the latest commit on the branch                                               |
| `ahead`                | `number` | The number of commits that the branch is ahead of its parent                                      |
| `behind`               | `number` | The number of commits that the branch is behind its parent                                        |

### Merge state of a branch

![CLI][cli-icon] ![API][api-icon]

`branches.mergeState(BranchDescriptor, { ...RequestOptions, parentId?: string }): Promise<BranchMergeState>`

Load the merge state for a specific branch in a project.

```js
abstract.branches.mergeState({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "252e9141-5cfc-4f4e-823b-a85f4cfd9a32"
});
```

> Note: The API and CLI [transports](/docs/transports) behave differently for merge state. The CLI transport ignores `options.parentId`, and _only_ returns one of the three possible merge states (no other fields are included). The API transport includes a value for each field of `BranchMergeState`, and only returns statuses `CLEAN` or `NEEDS_UPDATE`.

## Changesets

A changeset is a group of changes that together form a single, indivisible modification to a project. Changesets include data on all visual and nonvisual changes and provide insight into the differences between two versions of a project.

### The Changeset object

| Property       | Type                | Description                                                                             |
|----------------|---------------------|-----------------------------------------------------------------------------------------|
| `branchId`     | `string`            | UUID of the branch that this changeset is part of, or the string "master"               |
| `changes`      | `ChangesetChange[]` | List of changes that make up this changeset                                             |
| `compareToSha` | `string`            
| SHA of the commit introducing changes in this changeset                                 |
| `id`           | `string`            | UUID identifier of the changeset                                                        |
| `projectId`    | `string`            | UUID of the project this changeset belongs to                                           |
| `sha`          | `string`            | SHA of the base commit in this changeset that changes are against                       |

#### The ChangesetChange object

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

### Retrieve a changeset for a commit

![CLI][cli-icon] ![API][api-icon]

`changesets.commit(BranchCommitDescriptor, RequestOptions): Promise<Changeset>`

Load a changeset for a commit

```js
abstract.changesets.commit({
  branchId: "master",
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  sha: "e2a0a301c4a530ec16024cbb339dfc135c841b10"
});
```

### Retrieve a changeset for a branch

![CLI][cli-icon] ![API][api-icon]

`changesets.commit(BranchDscriptor, RequestOptions): Promise<Changeset>`

Load a changeset for a branch

```js
abstract.changesets.branch({
  branchId: "c426d0a6-e039-43d7-b7b3-e685a25e4cfb",
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
});
```


## Collections

A collection is a set of layers at the same or different commits on a branch, they can be created in the desktop or web app and are used to group work together to communicate a flow, ask for review, or other use cases.

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

`collections.list(ProjectDescriptor | BranchDescriptor, CollectionsListOptions): Promise<Collection[]>`

List all collections for a branch

```js
abstract.collections.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master"
});
```

Search and sort specific collections

```js
abstract.collections.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master"
}, {
  branchStatus: "active",
  layersPerCollection: 5,
  search: "search string",
  sortBy: "updatedAt"
});
```
s
> Note: Collection searching and sorting is only available when using the [API transport](/docs/transports).

### Retrieve a collection

![CLI][cli-icon] ![API][api-icon]

`collections.info(CollectionDescriptor, RequestOptions): Promise<Collection>`

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

`collections.create(ProjectDescriptor, NewCollection, RequestOptions): Promise<Collection>`

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

`collections.update(CollectionDescriptor, UpdatedCollection, RequestOptions): Promise<Collection>`

Update an existing collection

```js
abstract.collections.update({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  collectionId: "413daa80-1456-11e8-b8b0-4d1fec7ae555"
}, {
  name: "New name"
});
```



## CollectionLayers

A collection layer represents an underlying layer within a collection. Collection layers can be added to, removed from, and updated within existing collections.

### The CollectionLayer object

| Property          | Type      | Description                                                                                           |
|-------------------|-----------|-------------------------------------------------------------------------------------------------------|
| `collectionId`    | `string`  | UUID of the collection that this collection layer is part of                                          |
| `fileId`          | `string`  | UUID of the file that the underlying layer is part of                                                 |
| `pageId`          | `string`  | UUID of the page that the underlying layer is part of                                                 |
| `layerId`         | `string`  | UUID of the underlying layer that this collection layer represents                                    |
| `projectId`       | `string`  | UUID of the project that this collection layer is contained within                                    |
| `isPinned`        | `boolean` | SHA of the commit introducing changes in this changeset                                               |
| `useLatestCommit` | `boolean` | Determines if this collection layer should always point to the latest version of its underlying layer |
| `id`              | `string`  | UUID identifier of this collection layer                                                              |
| `order`           | `number`  | SHA of the commit that the underlying layer should point to                                           |
| `sha`             | `string`  | SHA of the commit that the underlying layer should point to                                           |

#### The NewCollectionLayer object

| Property          | Type      | Description                                                                                           |
|-------------------|-----------|-------------------------------------------------------------------------------------------------------|
| `fileId`          | `string`  | UUID of the file that the underlying layer is part of                                                 |
| `pageId`          | `string`  | UUID of the page that the underlying layer is part of                                                 |
| `layerId`         | `string`  | UUID of the underlying layer that this collection layer represents                                    |
| `isPinned`        | `boolean` | SHA of the commit introducing changes in this changeset                                               |
| `useLatestCommit` | `boolean` | Determines if this collection layer should always point to the latest version of its underlying layer |
| `order`           | `number`  | SHA of the commit that the underlying layer should point to                                           |
| `sha`             | `string`  | SHA of the commit that the underlying layer should point to                                           |

### Add a single layer to a collection

![API][api-icon]

`collectionLayers.add(CollectionDescriptor, NewCollectionLayer, RequestOptions): Promise<CollectionLayer>`

Add a single layer to a collection

```js
abstract.collectionLayers.add({
	projectId: '003a1ae0-a4b3-11e9-807c-a35b74e69da5',
	collectionId: '2538be75-c38b-4008-8a60-cf2c0364727e'
}, {
	fileId: '745EF992-C945-4B4C-BAFD-C6D45C45C6E2',
	isPinned: true,
	layerId: '9E2EB6C6-3681-4FCF-951E-50F7F0A0B0DE',
	order: 1,
	pageId: '7DC19A61-4D5F-4D75-BCAE-A589DF08257B',
	sha: 'latest'
});
```

### Add multiple layers to a collection

![API][api-icon]

`collectionLayers.addMany(CollectionDescriptor, NewCollectionLayer[], RequestOptions): Promise<CollectionLayer[]>`

Add multiple layers to a collection

```js
abstract.collectionLayers.addMany({
	projectId: '003a1ae0-a4b3-11e9-807c-a35b74e69da5',
	collectionId: '2538be75-c38b-4008-8a60-cf2c0364727e'
}, [
  {
    fileId: '745EF992-C945-4B4C-BAFD-C6D45C45C6E2',
    isPinned: true,
    layerId: '9E2EB6C6-3681-4FCF-951E-50F7F0A0B0DE',
    order: 1,
    pageId: '7DC19A61-4D5F-4D75-BCAE-A589DF08257B',
    sha: 'latest'
  }
]);
```

### Remove a layer from a collection

![API][api-icon]

`collectionLayers.remove(CollectionLayerDescriptor, RequestOptions): Promise<void>`

Remove a layer from a collection

```js
abstract.collectionLayers.remove({
	projectId: '003a1ae0-a4b3-11e9-807c-a35b74e69da5',
	collectionLayerId: '8a2aaa0f-bc8e-4b0d-9f79-dda1c68f12f1'
});
```

### Update a layer within a collection

![API][api-icon]

`collectionLayers.update(CollectionLayerDescriptor, UpdatedCollectionLayer, RequestOptions): Promise<CollectionLayer>`

Update a layer within a collection

```js
abstract.collectionLayers.update({
	projectId: '003a1ae0-a4b3-11e9-807c-a35b74e69da5',
	collectionLayerId: '8a2aaa0f-bc8e-4b0d-9f79-dda1c68f12f1'
}, {
	fileId: '745EF992-C945-4B4C-BAFD-C6D45C45C6E2',
	isPinned: false,
	layerId: '9E2EB6C6-3681-4FCF-951E-50F7F0A0B0DE',
	order: 2,
	pageId: '7DC19A61-4D5F-4D75-BCAE-A589DF08257B',
	sha: 'latest'
});
```

### Reorder a layer within a collection

![API][api-icon]

`collectionLayers.move(CollectionLayerDescriptor, number, RequestOptions): Promise<CollectionLayer[]>`

Reorder a layer within a collection

```js
abstract.collectionLayers.move({
	projectId: '003a1ae0-a4b3-11e9-807c-a35b74e69da5',
	collectionLayerId: '8a2aaa0f-bc8e-4b0d-9f79-dda1c68f12f1'
}, 2);
```



## Comments

A comment in Abstract can be left on a branch, commit, or layer. Comments on layers can also include an optional annotation that
represents a bounding area on-top of the layer, this can be used to leave comments about specific areas.

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

`comments.list(BranchDescriptor | BranchCommitDescriptor | PageDescriptor | LayerVersionDescriptor, RequestOptions): CursorPromise<Comment[]>`

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
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
}, { limit: 2 });
```

> Note: This endpoint returns a special type of `Promise` called a `CursorPromise` that supports cursor-based pagination. More information can be found [here](/docs/pagination).

### Retrieve a comment

![API][api-icon]

`comments.info(CommentDescriptor, RequestOptions): Promise<Comment>`

Load the info for a comment

```js
abstract.comments.info({
  commentId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
});
```

### Create a comment

![API][api-icon]

`comments.create(BranchDescriptor | BranchCommitDescriptor | LayerVersionDescriptor, Comment, RequestOptions): Promise<Comment>`

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

### List all commits

![CLI][cli-icon] ![API][api-icon]

`commits.list(BranchDescriptor | FileDescriptor | LayerDescriptor, { ...RequestOptions, limit?: number, startSha?: string, endSha?: string }): Promise<Commit[]>`

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
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19"
});
```

### Retrieve a commit

![CLI][cli-icon] ![API][api-icon]

`commits.info (FileDescriptor | LayerVersionDescriptor | CommitDescriptor, RequestOptions): Promise<Commit>`

Load the commit info for a specific commit SHA on a branch

```js
abstract.commits.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
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


### LayerData

| Property      | Type              | Description                                     |
|---------------|-------------------|-------------------------------------------------|
| `childIds`    | `string[]`        | Array of UUID's for the layers children, if any |
| `id`          | `string`          | UUID of the chid layer                          |
| `libraryId`   | `string`          | UUID of the library file this layer is from     |
| `libraryName` | `string`          | The name of the library file this layer is from |
| `parentId`    | `string`          | UUID of the parent layer, if any                |
| `properties`  | `LayerDataProperties` | Layer properties                            |
| `symbolId`    | `string`          | UUID of symbol master, if any                   |
| `type`        | `string`          | One of `artboard`, `layer`, `symbolMaster`, `symbolInstance`, `group`, `text`, `bitmap`, `shapeGroup`, `shapePath`, `rectangle`, `oval`, `polygon`, `triangle`, `star`, `page`, `slice`, `hotspot` |



### LayerDataProperties

| Property                 | Type                         | Description                                                               |
|--------------------------|------------------------------|---------------------------------------------------------------------------|
| `name`                   | `string`                     | Name of the layer                                                         |
| `isVisible`              | `boolean`                    | Is layer visible in the artboard                                          |
| `isLocked`               | `boolean`                    | Determines whether layer is locked or not                                 |
| `width`                  | `number`                     | The width of layer in pixels                                              |
| `height`                 | `number`                     | The height of layer in pixels                                             |
| `x`                      | `number`                     | The relative horizontal position of the layer on the page, measured from the left  |
| `y`                      | `number`                     | The relative vertical position of the layer on the page, measured from the top     |
| `rotation`               | `number`                     | The rotation of the layer in degrees                                      |
| `opacity`                | `number`                     | Opacity from 0 to 100                                                     |
| `hasClippingMask`        | `boolean`                    | Ensures whether a layer has a clipping mask                               | 
| `underClippingMask`      | `boolean`                    | Ensures whether a layer is under clipping mask or not                     |
| `textStyleIndex`         | `LayerTextStyle[]`           | Styles of Text. Refer to [LayerTextStyle](#layertextstyle)                | 
| `colorIndex`             | `LayerColor[]`               | Colors. Refer to [LayerColor](#layercolor)                                |
| `blendMode`              | `LayerBlendMode`             | Refer to [LayerBlendMode](#layerblendmode)                                | 
| `styleName?`             | `string`                     | Name of layer styles applies to layer                                     |
| `hasClickThrough?`       | `boolean`                    | Can be clicked when pressing cmd or selecting the "Click-through when selecting" |
| `imageId?`               | `string`                     | An id to image when layer is a bitmap                                     |
| `textContent?`           | `string`                     | Inner text of a layer                                                     |
| `backgroundColor?`       | `LayerColor`                 | Background color of a layer. Refer to [LayerColor](#layercolor)           |
| `borderRadius?`          | `LayerBorderRadius`          | The value of layer's border radius. Refer to [LayerBorderRadius](#layerborderradius) |
| `text?`                  | `LayerTextStyle`             | The style of text in a layer. Refer to [LayerTextStyle](#layertextstyle)  |
| `fills?`                 | `LayerFill[]`                | The fill styles for a layer. Refer to [LayerFill](#layerfill)             |
| `borders?`               | `LayerBorder[]`              | Styles for borders. Refer to [LayerBorder](#layerborder)                  |
| `shadows?`               | `LayerShadows`               | Shadow values. Refer to [LayerShadows](#layershadows)                     |
| `resizingConstraint?`    | `LayerResizingConstraint`    | Refer to [LayerResizingConstraint](#layerresizingconstraint)              | 
| `overrides?`             | `LayerOverrideData`          | Refer to [LayerOverrideData](#layeroverridedata)                          | 
| `assets?`                | `LayerDataAsset[]`           | A list of assets in a layer. Refer to [LayerDataAsset](#layerdataasset)   |


### LayerTextStyle

| Property                  | Type                        | Description                                     |
|---------------------------|-----------------------------|-------------------------------------------------|
| `styleName?`              | `string`                    | Style name for text                             |
| `fixed?`                  | `boolean`                   | Is the text fixed or not                        |
| `fontName?`               | `string`                    | PostScript Font Name                            |
| `fontSize?`               | `number`                    | Font Size                                       |
| `lineHeight?`             | `number`                    | Line Height of text                             |
| `characterSpacing?`       | `number`                    | Spacing between Characters                      |
| `paragraphSpacing?`       | `number`                    | Spacing between Paragraphs                      |
| `horizontalAlignment?`    | `LayerHorizontalAlignment`  | Horizontal Alignment of a text                  |
| `verticalAlignment?`      | `number`                    | Vertical Alignment of a text                    |
| `color?`                  | `LayerColor`                | Refer to [LayerColor](#layercolor)              |
| `listStyle?`              | `LayerListStyle`            | One of `""`, `disc` or `numbered`               |
| `textTransform?`          | `LayerTextTransform`        | `0` for none, `1` is for uppercase and `2` is for lowercase |
| `textDecoration?`         | `LayerTextDecoration`       | Refer to [LayerTextDecoration](#layertextdecoration) |

### LayerTextDecoration

| Property      | Type                             | Description                                                                    |
|---------------|----------------------------------|--------------------------------------------------------------------------------|
| `line`        | `LayerTextDecorationLine`        | Refer to [LayerTextDecorationLine](#layertextdecorationline)                   |
| `style`       | `LayerTextDecorationStyle`       | Refer to [LayerTextDecorationStyle](#layertextdecorationstyle)                 |

### LayerTextDecorationLine

| Value             |
|-------------------|
| `underline`       |
| `strikethrough`   |

### LayerTextDecorationStyle

| Value             |
|-------------------|
| `solid`           |
| `double`          |

### LayerColor

| Property            | Type              | Description                                     |
|---------------------|-------------------|-------------------------------------------------|
| `hex8`              | `string`          | Color in `HEX8` (e.g. #RRGGBBAA)                |
| `rgba`              | `string`          | `rgba` of color (e.g. rgba(0, 0, 0, 0))         |
| `components.red`    | `number`          | Value of red (`0` to `1`)                       |
| `components.green`  | `number`          | Value of green (`0` to `1`)                     |
| `components.blue`   | `number`          | Value of blue (`0` to `1`)                      |
| `components.alpha`  | `number`          | Alpha of color (`0` to `1`)                     |

### LayerBlendMode

Can be one of these blend modes:

| Name                        | Value        | Description                     |
|-----------------------------|--------------|---------------------------------|
| `LayerBlendModeNormal`      | `0`          | Normal                          |
| `LayerBlendModeDarken`      | `1`          | Darken                          |
| `LayerBlendModeMultiply`    | `2`          | Multiply                        |
| `LayerBlendModeColorBurn`   | `3`          | Color burn                      |
| `LayerBlendModeLighten`     | `4`          | Lighten                         |
| `LayerBlendModeScreen`      | `5`          | Screen                          |
| `LayerBlendModeAdd`         | `6`          | Add                             |
| `LayerBlendModeOverlay`     | `7`          | Overlay                         |
| `LayerBlendModeSoftLight`   | `8`          | Soft light                      |
| `LayerBlendModeHardLight`   | `9`          | Hard light                      |
| `LayerBlendModeDifference`  | `10`         | Difference                      |
| `LayerBlendModeExclusion`   | `11`         | Exclusion                       |
| `LayerBlendModeHue`         | `12`         | Hue                             |
| `LayerBlendModeSaturation`  | `13`         | Saturation                      |
| `LayerBlendModeColor`       | `14`         | Color                           |
| `LayerBlendModeLuminosity`  | `15`         | Luminosity                      |

### LayerBorderRadius

| Property      | Type              |
|---------------|-------------------|
| `topLeft`     | `number`          |
| `topRight`    | `number`          |
| `bottomRight` | `number`          |
| `bottomLeft`  | `number`          |

### LayerFill

Can be either of these fill types:

- [LayerFillSolid](#layerfillsolid)
- [LayerFillGradient](#layerfillgradient)
- [LayerFillPattern](#layerfillpattern)
- [LayerFillNoise](#layerfillnoise)

### LayerFillSolid

| Property      | Value             | Description                                     |
|---------------|-------------------|-------------------------------------------------|
| `fillType`    | `number`          | Value: `0`                                      |
| `blendMode`   | `LayerBlendMode`  | Refer to [LayerBlendMode](#layerblendmode)      |
| `opacity`     | `number`          | `0` to `100` opacity level                      |
| `color`       | `LayerColor`      | Refer to [LayerColor](#layercolor)              |

### LayerFillGradient

| Property      | Value                     | Description                                     |
|---------------|---------------------------|-------------------------------------------------|
| `fillType`    | `number`                  | Value: `1`                                      |
| `blendMode`   | `LayerBlendMode`          | Refer to [LayerBlendMode](#layerblendmode)      |
| `opacity`     | `number`                  | `0` to `100` opacity level of filling gradient  |
| `gradient`    | `LayerGradient`           | Refer to [LayerGradient](#layergradient)        |

### LayerFillPattern

| Property              | Value             | Description                                             |
|-----------------------|-------------------|---------------------------------------------------------|
| `fillType`            | `number`          | value: `4`                                              |
| `blendMode`           | `LayerBlendMode`  | Refer to [LayerBlendMode](#layerblendmode)              |
| `opacity`             | `number`          | `0` to `100` opacity level of filling pattern           |
| `patternFillType`     | `number`          | Refer to [LayerFillPatternType](#layerfillpatterntype)  |
| `patternTileScale`    | `number`          | Scale value of fill                                     |
| `patternWidth?`       | `number`          | Width of a pattern                                      |
| `patternHeight?`      | `number`          | Height of a pattern                                     |
| `imageUrl`            | `string`          | Image url of a fill                                     |
| `imageId`             | `string`          | Image id of a fill                                      |

### LayerFillPatternType

| Value | Description            |
|-------|------------------------|
| `0`   | Tile                   |
| `1`   | Fill                   |
| `2`   | Stretch                |
| `3`   | Fit                    |

### LayerFillNoise

| Property          | Value                  | Description                                     |
|-------------------|------------------------|-------------------------------------------------|
| `fillType`        | `LayerFillTypeNoise`   | Value: `5`                                      |
| `blendMode`       | `LayerBlendMode`       | Refer to [LayerBlendMode](#layerblendmode)      |
| `opacity`         | `number`               | `0` to `100` opacity level of filling noise     |
| `noiseIndex`      | `number`               | One of `1` (black), `2` (white), `3` (color)    |
| `noiseIntensity`  | `number`               | `0` to `100` intensity level of filling noise   |

### LayerBorder

Can be either one of these border types:

- [LayerBorderSolid](#layerbordersolid)
- [LayerBorderGradient](#layerbordergradient)

### LayerBorderSolid

| Property      | Value                      | Description                                          |
|---------------|----------------------------|------------------------------------------------------|
| `fillType`    | `LayerFillTypeSolid`       | Value: `0`                                           |
| `position`    | `LayerBorderPosition`      | Refer to [LayerBorderPosition](#layerborderposition) |
| `thickness`   | `number`                   | Size of the border stroke                            |
| `color`       | `LayerColor`               | Refer to [LayerColor](#layercolor)                   |

### LayerBorderGradient

| Property      | Value                      | Description                                          |
|---------------|----------------------------|------------------------------------------------------|
| `fillType`    | `LayerFillTypeGradient`    | Value: `1`                                           |
| `position`    | `LayerBorderPosition`      | Refer to [LayerBorderPosition](#layerborderposition) |
| `thickness`   | `number`                   | Size of the border stroke                            |
| `color`       | `LayerGradient`            | Refer to [LayerGradient](#layergradient)             |

### LayerBorderPosition

| Value   | Description                 |
|---------|-----------------------------|
| `0`     | Center                      |
| `1`     | Inside                      |
| `2`     | Outside                     |

### LayerGradient

| Property             | Value                 | Description                                             |
|----------------------|-----------------------|---------------------------------------------------------|
| `gradientType`       | `number`              | Value: `0` for linear, `1`, for radial, `2` for angular |
| `from`               | `[number, number]`    | Coords from where to start a gradient                   |
| `to`                 | `[number, number]`    | Coords from where to end a gradient                     |
| `stops`              | `LayerGradientStop[]` | List of colors stops for the gradient                   |
| `ellipseLength`      | `number`              | Length of a gradient ellipse                            |

### LayerGradientStop

| Property      | Value                | Description                                               |
|---------------|----------------------|-----------------------------------------------------------|
| `position`    | `number`             | At which position value the gradient want to be changed   |
| `color`       | `LayerColor`         | What color will it get changed to                         |



### LayerShadows

| Property      | Value                   | Description                                     |
|---------------|-------------------------|-------------------------------------------------|
| `outer?`      | `LayerShadow[]`         | Shadow outside of layer                         |
| `inner?`      | `LayerShadow[]`         | Shadow inside of layer                          |

### LayerShadow

| Property          | Value               | Description                                     |
|-------------------|---------------------|-------------------------------------------------|
| `color`           | `LayerColor`        | Coloring of a shadow                            |
| `blurRadius`      | `number`            | Radius of blur                                  |
| `spread`          | `number`            | Spread value of a shadow                        |
| `x`               | `number`            | Horizontal coords of a shadow                   |
| `y`               | `number`            | Vertical coords of a shadow                     |

### LayerResizingConstraint

| Property      | Value                 |
|---------------|-----------------------|
| `top?`             | `boolean`        |
| `right?`           | `boolean`        |
| `bottom?`          | `boolean`        |
| `left?`            | `boolean`        |
| `fixedWidth?`      | `boolean`        |
| `fixedHeight?`     | `boolean`        |

### LayerOverrideData

| Property                | Value                               | Description                                     |
|-------------------------|-------------------------------------|-------------------------------------------------|
| `symbolId?`             | `boolean`                           | The id of a symbol that gets overwritten        |
| `properties?`           | `LayerOverrideProperties`           | Properties that the layer will overwrite        |
| `[layerId: string]`     | `string/Object/LayerOverrideData`   | An id of a layer that will be overwritten       |

### LayerOverrideProperties

```js
  type LayerOverrideProperties = {
    ...$Diff<LayerDataProperties, { overrides: * }>
  };
```

### LayerDataAsset

| Property            | Value           | Description                                     |
|---------------------|-----------------|-------------------------------------------------|
| `fileFormat`        | `string`        | Format of a file                                |
| `formatName`        | `string`        | Name of format of an asset                      |
| `namingScheme`      | `string`        | Naming scheme for an asset                      |
| `scale`             | `string`        | Scale of an asset                               |



### Retrieve layer data

![CLI][cli-icon] ![API][api-icon]

`data.info(LayerVersionDescriptor, RequestOptions): Promise<LayerDataset>`

```js
abstract.data.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
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
| `commitId`                   | `string`  | ID of a commit                                                  |
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

`files.list(BranchDescriptor, RequestOptions): Promise<File[]>`

List the files for a branch at the latest commit

```js
abstract.files.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  sha: "latest"
});
```

List the files for a specific commit

```js
abstract.files.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  commitId: "38977cf997915aca6f1f9707bc982314fb30f6f2"
});
```

### Retrieve a file

![CLI][cli-icon] ![API][api-icon]

`files.info(FileDescriptor, RequestOptions): Promise<File>`

Load the file info for the latest commit on a branch

```js
abstract.files.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7"
  sha: "latest"
});
```

### Export a file

![CLI][cli-icon] ![API][api-icon]

`files.raw(FileDescriptor, RawProgressOptions): Promise<ArrayBuffer | void>`

Retrieve a Sketch file from Abstract based on its file ID and save it to disk. Files will be saved to the current working directory by default, but a custom `filename` option can be used to customize this location.

```js
abstract.files.raw({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7"
  sha: "latest"
});
```

The resulting `ArrayBuffer` can be also be used with node `fs` APIs directly. For example, it's possible to write the file to disk manually after post-processing it:

```js
const arrayBuffer = await abstract.files.raw({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7"
  sha: "latest"
}, {
  disableWrite: true
});

processedBuffer = postProcess(arrayBuffer);

fs.writeFile("file.sketch", Buffer.from(processedBuffer), (err) => {
  if (err) throw err;
  console.log("File written!");
});
```

It's also possible to get insight into the underlying progress of the file export.

```js
abstract.files.raw({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7"
  sha: "latest"
}, {
  onProgress: (receivedBytes: number, totalBytes: number) => {
    console.log(`${receivedBytes * 100 / totalBytes}% complete`);
  }
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

`layers.list(FileDescriptor | PageDescriptor, LayersListOptions): Promise<Layer[]>`

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

A file can also contain layers from external libraries. If you'd like to only see the layers in this file and not the external library elements they depend upon, use the `fromLibraries` option…

```js
abstract.layers.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  pageId: "7D2D2599-9B3F-49BC-9F86-9D9D532F143A",
  sha: "fb7e9b50da6c330fc43ffb369616f0cd1fa92cc2"
}, {
  limit: 25,
  offset: 0,
  fromLibraries: "exclude"
});
```

### Retrieve a layer

![CLI][cli-icon] ![API][api-icon]

`layers.info(LayerVersionDescriptor, RequestOptions): Promise<Layer>`

Load the info for a layer in a file at the latest commit on a branch

```js
abstract.layers.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
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

`memberships.list(OrganizationDescriptor | ProjectDescriptor, RequestOptions): Promise<Membership[]>`

List the members of an organization

```js
abstract.memberships.list({
  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
});
```

### Retrieve a membership

![API][api-icon]

`memberships.info(OrganizationMembershipDescriptor | ProjectMembershipDescriptor, RequestOptions): Promise<Membership>`

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

`notifications.list(OrganizationDescriptor, ListOptions): CursorPromise<Notification[]>`

List the first two notifications for a given organization

```js
abstract.notifications.list({
  organizationId: "8a13eb62-a42f-435f-b3a3-39af939ad31b"
}, { limit: 2 });
```

> Note: This endpoint returns a special type of `Promise` called a `CursorPromise` that supports cursor-based pagination. More information can be found [here](/docs/pagination).

### Retrieve a notification

![API][api-icon]

`notifications.info(NotificationDescriptor, RequestOptions): Promise<Notification>`

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

`organizations.list(RequestOptions): Promise<Organization[]>`

Load the organizations accessible by the current access token

```js
abstract.organizations.list();
```

### Retrieve an organization

![API][api-icon]

`organizations.info(OrganizationDescriptor, RequestOptions): Promise<Organization>`

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

`pages.list(FileDescriptor, RequestOptions): Promise<Page[]>`

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

`pages.info(PageDescriptor, RequestOptions): Promise<Page>`

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

`previews.raw(LayerVersionDescriptor, RawOptions): Promise<ArrayBuffer>`

Retrieve a preview image for a layer at a specific commit and save it to disk. Files will be saved to the current working directory by default, but a custom `filename` option can be used to customize this location.

```js
const arrayBuffer = await abstract.previews.raw({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
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

`previews.url(LayerVersionDescriptor, RequestOptions): Promise<string>`

> Get an image as a _temporary_ blob url which can be displayed directly in an image tag or downloaded. The url exists only as long as the current browser session and should not be saved to a database directly.

```js
abstract.previews.url({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
  layerId: "CA420E64-08D0-4B96-B0F7-75AA316B6A19",
  sha: "c4e5578c590f5334349b6d7f0dfd4d3882361f1a" // or sha: "latest"
});
```

### Retrieve a preview

![API][api-icon]

`previews.info(LayerVersionDescriptor, RequestOptions): Promise<Preview>`

Load the info for a layer preview

```js
abstract.previews.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master",
  fileId: "51DE7CD1-ECDC-473C-B30E-62AE913743B7",
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
| `assetAutoGeneration` | `string` | Status of project asset generation. One of "all", "master", or "off".    |
| `color`          | `string` | A hex value that represents a custom project color                            |
| `createdAt`      | `string` | Timestamp that the project was created                                        |
| `createdByUser`  | `User`   | The user that created the project                                             |
| `firstPushedAt`  | `string` | Timestamp that the project first received data                                |
| `id`             | `string` | UUID                                                                          |
| `isNew`          | `boolean`| True if nobody has committed in this project yet                              |
| `name`           | `string` | The name of the project                                                       |
| `organizationId` | `string` | UUID of the organization this project belongs to                              |
| `pushedAt`       | `string` | Timestamp that data was last received                                         |
| `repoCreatedAt`  | `string` | Timestamp that the backend storage was created                                |
| `sizeInBytes`    | `number` | The size of the project on disk in bytes                                      |
| `updatedAt`      | `string` | Timestamp that the project was last updated                                   |
| `visibility`     | `string` | Either "organization" for a team project, or "specific" for a private project |

#### NewProject

| Property         | Type      | Description                                                                   |
|------------------|-----------|-------------------------------------------------------------------------------|
| `about`          | `string`  | A longer description of the project (May optionally include markdown tags)    |
| `assetAutoGeneration` | `string` | Status of project asset generation. One of "all", "master", or "off".    |
| `color`          | `string`  | A hex value that represents a custom project color                            |
| `createdAt`      | `string`  | Timestamp that the project was created                                        |
| `name`           | `string`  | The name of the project                                                       |
| `organizationId` | `string`  | UUID of the organization this project belongs to                              |
| `sectionId`      | `string`  | UUID of the section this project belongs to                                   |
| `visibility`     | `string`  | Either "organization" for a team project, or "specific" for a private project |

### List all projects

![API][api-icon]

`projects.list(OrganizationDescriptor?, { ...RequestOptions, filter?: "active" | "archived", sectionId?: string }): Promise<Project[]>`

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

or, get a list of active projects for a specific section within an organization…

```js
abstract.projects.list({
  organizationId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  sectionId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
}, { filter: "active" });
```

### Retrieve a project

![API][api-icon]

`projects.info(ProjectDescriptor, RequestOptions): Promise<Project>`

Load the info for a project

```js
abstract.projects.info({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
});
```

### Create a project

![API][api-icon]

`projects.create(OrganizationDescriptor, NewProject, RequestOptions): Promise<Project>`

Create a new project

```js
abstract.projects.create({
  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
}, {
  name: "New Project",
  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
});
```

### Delete a project

![API][api-icon]

`projects.delete(ProjectDescriptor, RequestOptions): Promise<void>`

Delete a project

```js
abstract.projects.delete({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
});
```

### Update a project

![API][api-icon]

`projects.update(ProjectDescriptor, Project, RequestOptions): Promise<Project>`

Update an existing project

```js
abstract.projects.update({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
}, {
  ...existingProject,
  name: "Updated Project Name"
});
```

### Archive a project

![API][api-icon]

`projects.archive(ProjectDescriptor, RequestOptions): Promise<Project>`

Archive a project

```js
abstract.projects.achive({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
});
```

### Un-archive a project

![API][api-icon]

`projects.unarchive(ProjectDescriptor, RequestOptions): Promise<Project>`

Un-archive a project

```js
abstract.projects.unarchive({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
});
```


## Review Requests

A review request represents a notification to review a given branch of work.

### The review request object

| Property          | Type     | Description                                                                   |
|-------------------|----------|-------------------------------------------------------------------------------|
| `branchId`        | `string` | The ID of the branch being reviewed                                           |
| `commentId`       | `string` | ID of the comment associated with this review request                         |
| `createdAt`       | `string` | Timestamp indicating when this review was requested                           |
| `id`              | `string` | UUID of this review request                                                   |
| `projectId`       | `string` | ID of the project that the reviewed branch belongs to                         |
| `requester`       | `User`  | User who initiated or created this review request                               |
| `reviewer`        | `User` | User who was requested to review this work                                      |
| `requesterID`     | `User` | ID of the user who initiated or created this review request                     |
| `reviewerID`      | `User` | ID of the user who was requested to review this work                            |
| `status`          | `string` | Status of this review, one of `APPROVED` or `REJECTED`                        |
| `statusChangedAt` | `string` | Timestamp indicating when this review was last updated                        |

### List all review requests

![API][api-icon]

`reviewRequests.list(OrganizationDescriptor | ProjectDescriptor | BranchDescriptor, RequestOptions): Promise<ReviewRequest[]>`

List all review requests for a given branch

```js
abstract.reviewRequests.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78",
  branchId: "master"
});
```

List all review requests for a given project, regardless of branch

```js
abstract.reviewRequests.list({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
});
```

List all review requests for a given organization, regardless of project

```js
abstract.reviewRequests.list({
  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
});
```



## Sections

A section is a group of projects that belong to a given organization. Sections are used to group similar or related projects together and can be created using the desktop application.

### The section object

| Property         | Type     | Description                                                                   |
|------------------|----------|-------------------------------------------------------------------------------|
| `id`             | `string` | UUID                                                                          |
| `name`           | `string` | The name of the section                                                       |
| `organizationId` | `string` | UUID of the organization this section belongs to                              |

### List all sections

![API][api-icon]

`sections.list(OrganizationDescriptor, RequestOptions): Promise<Section[]>`

List all sections accessible through the current authentication

```js
abstract.sections.list({ organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9" });
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

`shares.info(ShareDescriptor | ShareUrlDescriptor, RequestOptions): Promise<Share>`

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

`shares.info(ShareDescriptor | ShareUrlDescriptor, RequestOptions): Promise<Share>`

List all files for branch's share url

```js
const branchShare = await abstract.shares.info({
  url: 'https://share.goabstract.com/49b1f582-a8b4-46ca-8c86-bbc675fe27c4'
})

const branchFiles = await abstract.files.list(branchShare.descriptor);
```

### Create a share

![API][api-icon]

`shares.create(OrganizationDescriptor, InputShare, RequestOptions): Promise<Share>`

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


## Stars

A star represents an underlying project or section of projects, and it indicates that a user has favorites the underlying object for easier discovery.

### The star object

| Property         | Type     | Description                                                                   |
|------------------|----------|-------------------------------------------------------------------------------|
| `starrableId`    | `string` | The ID of the underlying project or section that this star represents         |
| `starrableType`  | `string` | Indicates the type of the underlying entity, either "Project" or "Section"    |
| `starredAt`      | `string` | Timestamp that the project or section was starred                             |

### List all starred projects or sections

![API][api-icon]

`stars.list(RequestOptions): Promise<Star[]>`

List all starred projects or sections

```js
abstract.stars.list();
```

### Star a project

![API][api-icon]

`stars.create(ProjectDescriptor | SectionDescriptor, RequestOptions): Promise<Star>`

Star a project

```js
abstract.stars.create({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
});
```

### Un-star a project

![API][api-icon]

`stars.delete(ProjectDescriptor | SectionDescriptor, RequestOptions): Promise<void>`

Un-star a project

```js
abstract.stars.delete({
  projectId: "616daa90-1736-11e8-b8b0-8d1fec7aef78"
});
```


## Users

A user contains information specific to an individual account. Users are global to Abstract and are not specific to organizations. A user is created in the application by creating a new account.

### The user object

| Property          | Type     | Description                                                  |
|-------------------|----------|--------------------------------------------------------------|
| `avatarUrl`       | `string` | URL of the avatar for this user                              |
| `createdAt`       | `string` | Timestamp indicating when this account was created           |
| `deletedAt`       | `string` | Timestamp indicating when this account was deleted           |
| `id`              | `string` | UUID identifier for the user                                 |
| `name`            | `string` | The name of the page                                         |
| `primaryEmailId`  | `string` | ID of the primary email for this user                        |
| `updatedAt`       | `string` | Timestamp indicating when this account was updated           |
| `username`        | `string` | Username associated with this user                           |

### List all users

![API][api-icon]

`users.list(OrganizationDescriptor | ProjectDescriptor, RequestOptions): Promise<User[]>`

List the users in an organization

```js
abstract.users.list({
  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
});
```

### Retrieve a user

![API][api-icon]

`users.info(UserDescriptor, RequestOptions): Promise<User>`

Load the info for a specific user

```js
abstract.users.info({
  userId: "48b5d670-2002-45ea-929d-4b00863778e4"
});
```


## Webhooks

Webhooks make it easy to efficiently subscribe to events across the Abstract platform. Webhooks live at the organization level, and  organization administrators can create new webhooks within an organization's settings in the web application.

> Note: Additional information on webhooks can be found [here](/docs/webhooks).

### The webhook object

| Property        | Type      | Description                                                         |
|-----------------|-----------|---------------------------------------------------------------------|
| `active`        | `boolean` | Indicates if this webhook is currently listening for new events     |
| `createdAt`     | `string`  | Timstamp indicating when this webhook was created                   |
| `errorCount`    | `number`  | Number indicating the number of failed deliveries for this webhook  |
| `events`        | `WebhookEvent[]` | Array of webhook event objects configured for this webhook   |
| `id`            | `string`  | UUID identifier for this webhook                                    |
| `lastPushedAt`  | `string`  | Timstamp indicating the time of the most recent delivery for this webhook |
| `organizationId`| `string`  | UUID of the organization this webook belongs to                     |
| `updatedAt`     | `string`  | Timstamp indicating when this webhook was last updated              |
| `url`           | `string`  | URL that this webhook will `POST` deliveries to                     |
| `user`          | `User`    | The user that created the webhook                                   |

#### WebhookEvent

| Property        | Type      | Description                                                         |
|-----------------|-----------|---------------------------------------------------------------------|
| `id`            | `string`  | UUID identifier for this webhook event                              |
| `group`         | `WebhookGroup`  | Category that this webhook event belongs to                   |
| `name`          | `string`  | The name of this webhook event                                      |

#### WebhookGroup

| Property        | Type      | Description                                                         |
|-----------------|-----------|---------------------------------------------------------------------|
| `id`            | `string`  | UUID identifier for this webhook event group                        |
| `name`          | `string`  | The name of this webhook event group                                |

#### NewWebhook

| Property        | Type      | Description                                                         |
|-----------------|-----------|---------------------------------------------------------------------|
| `active`        | `boolean` | Indicates if this webhook is currently listening for new events     |
| `events`        | `WebhookEvent[]` | Array of webhook event objects configured for this webhook   |
| `key`           | `string`  | An optional secret used to validate deliveries for this webhook     |
| `organizationId`| `string`  | UUID of the organization this webook belongs to                     |
| `url`           | `string`  | URL that this webhook will `POST` deliveries to                     |


### List an organization's webhooks

![API][api-icon]

`webhooks.list(OrganizationDescriptor, RequestOptions): Promise<Webhook[]>`

List all webhooks for a given organization

```js
abstract.webhooks.list({
  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
});
```

### Retrieve a webhook

![API][api-icon]

`webhooks.info(WebhookDescriptor, RequestOptions): Promise<Webhook>`

Retrieve a single webhook

```js
abstract.webhooks.info({
  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9",
  webhookId: "03df2308-82a7-4a05-b9e9-c31ad569249d"
});
```

### List available webhook events

![API][api-icon]

`webhooks.events(OrganizationDescriptor, RequestOptions): Promise<WebhookEvent[]>`

List all available webhook events

```js
abstract.webhooks.events({
  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
});
```

### Create a webhook

![API][api-icon]

`webhooks.create(OrganizationDescriptor, NewWebhook, RequestOptions): Promise<Webhook>`

Create a new webhook

```js
abstract.webhooks.create({
  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
}, {
  active: true,
  events: [ 'project.created' ],
  organizationId: "4ed01dff-4bc7-47cd-8b51-9ea3ec9e5de4",
  url: "https://example-url.com/postreceive"
});
```

### Update a webhook

![API][api-icon]

`webhooks.update(OrganizationDescriptor, Webhook, RequestOptions): Promise<Webhook>`

Update an existing webhook

```js
abstract.webhooks.update({
  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
}, {
  active: false,
  events: [ 'project.updated' ],
  organizationId: "4ed01dff-4bc7-47cd-8b51-9ea3ec9e5de4",
  url: "https://another-example-url.com/postreceive"
});
```

### Delete a webhook

![API][api-icon]

`webhooks.delete(WebhookDescriptor, RequestOptions): Promise<void>`

Delete a webhook

```js
abstract.webhooks.delete({
  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9",
  webhookId: "03df2308-82a7-4a05-b9e9-c31ad569249d"
});
```

### Send a test event to a webhook

![API][api-icon]

`webhooks.ping(WebhookDescriptor, RequestOptions): Promise<void>`

Send a test event to an existing webhook

```js
abstract.webhooks.ping({
  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9",
  webhookId: "03df2308-82a7-4a05-b9e9-c31ad569249d"
});
```

### List all deliveries for a webhook

![API][api-icon]

`webhooks.deliveries(WebhookDescriptor, RequestOptions): Promise<WebhookDelivery[]>`

List all deliveries for a webhook

```js
abstract.webhooks.deliveries({
  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9",
  webhookId: "03df2308-82a7-4a05-b9e9-c31ad569249d"
});
```

### Verify a webhook delivery

![API][api-icon]

`webhooks.verify(WebhookDelivery, expectedSignature, signingKey, RequestOptions): Promise<boolean>`

Verify that a webhook delivery payload was sent by Abstract

```js
app.post("/webhook", async (req, res) => {
  const payload = req.body;
  const expectedSignature = req.header("Abstract-Webhooks-Signature");
  const signingKey = process.env.WEBHOOK_SIGNING_KEY;

  const verified = await abstract.webhooks.verify(payload, expectedSignature, signingKey);

  // Webhook verified, do something with payload data...
});
```

> Note: This endpoint is intended to be used on a webhook server to verify that incoming delivery requests were sent by Abstract. More information on webhook security techniques can be found [here](/docs/webhooks-security).

## Request options

Options objects that can be passed to different SDK endpoints.

### RequestOptions

```js
{
  transportMode?: ("api" | "cli")[]
}
```

### ListOptions
```js
{
  transportMode?: ("api" | "cli")[],
  limit?: number,
  offset?: number
}
```

### LayersListOptions
```js
{
  transportMode?: ("api" | "cli")[],
  limit?: number,
  offset?: number
  fromLibraries?: "include" | "exclude" | "only" # default is "include"
}
```

### RawOptions
```js
{
  transportMode?: ("api" | "cli")[],
  disableWrite?: boolean,
  filename?: string
}
```

### RawProgressOptions
```js
{
  transportMode?: ("api" | "cli")[],
  disableWrite?: boolean,
  filename?: string,
  onProgress?: (receivedBytes: number, totalBytes: number) => void;
}
```

### CollectionsListOptions
```js
{
  branchStatus?: string,
  layersPerCollection?: number | "all",
  limit?: number,
  offset?: number,
  search?: string,
  sortBy?: string,
  sortDir?: string,
  transportMode?: ("api" | "cli")[],
  userId?: string
}
```

## Descriptors

Reference for the parameters required to load resources with the Abstract SDK.

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
{ shareId: string }
```

### ShareUrlDescriptor

```js
{ url: string }
```

### BranchDescriptor

```js
{
  projectId: string,
  branchId: string | "master"
}
```

### BranchCommitDescriptor

```js
{
  projectId: string,
  branchId: string | "master",
  sha: string
}
```

### CommitDescriptor

```js
{
  projectId: string,
  branchId: string | "master"
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
  layerId: string
}
```

### LayerVersionDescriptor

```js
{
  projectId: string,
  branchId: string | "master",
  fileId: string,
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

### WebhookDescriptor

```js
{
  organizationId: string,
  webhookId: string
}
```

### WebhookDeliveryDescriptor

```js
{
  deliveryId: string,
  organizationId: string,
  webhookId: string
}
```
