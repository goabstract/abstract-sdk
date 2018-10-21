---
id: getting-started
title: Getting Started
---

The SDK was designed to allow interacting with both the Abstract API and the desktop CLI from a unified interface in any environment that supports JavaScript. The SDK should work well inside desktop design tools such as Sketch, on servers, or CI environments.

## Installation

```
yarn add abstract-sdk
```

or

```
npm install abstract-sdk
```

## Configuring

In order to use the SDK you'll need to instantiate an instance and give it an [authentication](/docs/authentication) token, we recommend storing the token in your environment as `ABSTRACT_TOKEN` and it will be automatically loaded – don't commit it with your code!

```js
import * as Abstract from "abstract-sdk";

const abstract = Abstract.Client();
```

You can also specify a token to use, for example:

```js
import * as Abstract from "abstract-sdk";

const abstract = Abstract.Client({
  abstractToken: process.env.ABSTRACT_API_TOKEN
});
```

### Transports

If you want to ensure that the SDK only ever loads data from the API or the CLI then you can achieve this by specifying a transport. This is useful when running in an environment without the Mac application installed or alternatively when you want to ensure you're only dealing with local data:

```js
import * as Abstract from "abstract-sdk";

const abstract = Abstract.Client({
  transport: Abstract.TRANSPORTS.CLI
});
```


## Making a Request

Lets get started by loading a list of accessible projects from the API. All of the methods in the SDK return a promise – you may use traditional promise syntax or async / await if your JS runtime supports ES6.

```js
const projects = await abstract.projects.list();
projects.map(project => {
  console.log(`${project.name}: ${project.id}`);
});
```

Hopefully you just got a list of projects that are accessible to your token, nice! From here you can use the [API reference](/docs/reference) to dig deeper – try loading branches, commits, comments, artboard data, and more.