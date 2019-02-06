## v0.7.2
- Fixed flow errors for consumers of sdk using flow
- Fixed peerDependency warning on @elasticprojects/abstract-cli
- Updated LayerShare options to latest options

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
