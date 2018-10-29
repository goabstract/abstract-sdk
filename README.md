[![npm version](https://badge.fury.io/js/abstract-sdk.svg)](https://badge.fury.io/js/abstract-sdk) [![CircleCI](https://circleci.com/gh/goabstract/abstract-sdk.svg?style=svg)](https://circleci.com/gh/goabstract/abstract-sdk)

# Abstract SDK

This library provides a universal javascript binding for the Abstract API and CLI.

## Documentation

Check out the [Getting Started](https://sdk.goabstract.com/docs/getting-started/) page for a quick overview.

For full documentation please visit:

https://sdk.goabstract.com

Help improve documentation by clicking the "Edit" button on any page or by creating as pull request.

## Development

Start the test runner with the `--watch` option. The SDK uses jest's snapshot testing to document calls to the api and cli.

```bash
$ yarn test --watch
```

*In the event of a snapshot change, jest will guide you through comparing and updating the snapshot.*

## Contributing

This project is maintained by a team at [Abstract](https://www.goabstract.com). We are very willing to accept contributions, first please ensure there is a relavant [issue in the tracker](https://github.com/goabstract/abstract-sdk/issues) and an approach has been discussed before beginning to write code – this makes it more likely we will be able to accept your contribution and ensure nobody's time (especially yours!) is wasted.

Changes and additions to the SDK should include tests and documentation updates as part of the pull request.

### Tests



## Publishing

```bash
$ yarn version
$ git push --follow-tags
$ npm publish
```
