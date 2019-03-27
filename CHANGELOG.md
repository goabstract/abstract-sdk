## v1.0.0
- Clients are classes that are instantiated using `new Abstract.Client({ ... })`
- Fixed downstream `flow-typed` issues
- Changed `transport` configuration option to `transportMode`, which now takes a string:  "api", "cli", or "auto"
- `BranchDescriptor` no longer requires a `sha` property
- Some APIs that exected or returned `BranchDescriptor` now use `CommitDescriptor`
- `Abstract.errors.*` modules were moved to the top level `Abstract` namespace
- `LayerDescriptor` no longer requires `pageId`

## v0.7.0

- Added `assets.list`, `assets.info`, and `assets.raw` to the API transport
- Added `branches.list` and `branches.info` to the CLI transport
- Added `comments.create` to the API transport
- Fixed Flow typings for top-level modules
- Added `shares.create` to the API tansport
- Added `collections.update` and `collections.create` to the API transport
- Added custom error handling
- Fixed differences in collection data between the API and CLI transports

## v0.6.1

- Added support for importing sdk in browser module loaders like webpack
- Fixed `commits.info` with a descriptors using `sha: "latest"`

## v0.6.0

- Added `organizations.info` method
- Added cursor-based pagination to applicable `list` methods
- `accessToken` configuration option accepts a function

## v0.5.0

- Added support for `sha: "latest"`
- Added `shares.info` method
- Added `activities.list` and `activities.info` methods
- Added `notifications.list` and `notifications.info` methods
- Added `comments.list` and `comments.info` methods
