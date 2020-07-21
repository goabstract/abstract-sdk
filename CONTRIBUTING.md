# Contributing to the Abstract SDK

We're very grateful for outside contributions, as they both improve the robustness of the SDK and help inform how the SDK is being used in real-world applications. Whether the contribution is a minor documentation fix or major feature enhancement, we're always happy to accept changes that adhere to the expectations in this document.

## Code of conduct

Please note that this project adheres to a [code of conduct](https://github.com/goabstract/abstract-sdk/blob/master/CODE_OF_CONDUCT.md).

## Submitting an issue

Please follow the provided template when [submitting an issue](https://github.com/goabstract/abstract-sdk/issues/new).

## Submitting a pull request

Please follow the provided template when [submitting a pull request](https://github.com/goabstract/abstract-sdk/compare).

## Local development

The SDK codebase is written using modern JavaScript language features and is statically-typed using Flow. The commands below (and repository as a whole) use Yarn, but both Yarn and NPM can be used interchangeably depending on developer preference.

### Setup

Fork and clone the repository:

```sh
$ git clone https://github.com/<username>/abstract-sdk
```

### Installation

Install dependencies from the project root using Yarn:

```sh
$ cd abstract-sdk && yarn
```

### Compilation

Type-check all code using Flow:

```sh
$ yarn flow
```

### Building

Transpile the `src` directory into a `dist` directory using Babel:

```sh
$ yarn build
```

### Linting

Lint and format all code using Prettier via ESLint:

```sh
$ yarn lint --fix
```

### Testing

Run unit tests using Jest:

```sh
$ yarn test
```

## Documentation

Both the documentation content and its static website code live inside this repository in the [`docs`](https://github.com/goabstract/abstract-sdk/tree/master/docs) and [`website`](https://github.com/goabstract/abstract-sdk/tree/master/website) folders, respectively. The documentation auto-deploys to [https://developer.abstract.com](https://developer.abstract.com) whenever new commits occur on the [`docs`](https://github.com/goabstract/abstract-sdk/tree/docs) branch. This means that **pull requests to update documentation should be made against the `docs` branch** instead of `master`.

### Installation

Install dependencies from the `/website` folder using Yarn:

```sh
$ cd website && yarn
```

### Running

Serve the documentation site at [http://localhost:3000](http://localhost:3000):

```sh
$ yarn start
```

## Cutting releases

New package versions of `abstract-sdk` are automatically published to the public NPM registry whenever new tags are pushed to the repository. This repository uses [`standard-version`](https://github.com/conventional-changelog/standard-version) as convention to automate versioning, tagging, and changelog generation:

1. Bump the version and submit a pull request.
   For a prerelease, add the `--prerelease` flag when running `yarn release`:
   ```sh
   $ yarn release
   $ git push origin <new_tag_version>
   ```
2. Once the PR lands, push the new tag to the repository.
   ```sh
   $ git push origin <new_tag_version>
   ```
3. Lastly, update the documentation.
   ```sh
   $ git checkout -t origin/docs -b docs
   $ git rebase master
   $ git push origin docs -f
   ```

<br />
<br />
<br />
<br />
<img
src="https://user-images.githubusercontent.com/12195101/87982812-5902ed00-caa5-11ea-8acc-1291ca41111d.png"
width="136" height="auto" alt="Abstract black wordmark" />
