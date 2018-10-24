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

// TODO

## Publishing

```bash
$ yarn version
$ git push --follow-tags
$ npm publish
```
