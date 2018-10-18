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

In order to use the SDK you'll need to instantiate an instance and give it an [authentication](/docs/authentication) token, we recommend storing the token in your environment – don't commit it with your code!

```js
import * as Abstract from "abstract-sdk";

const abstract = Abstract.Client({
  abstractToken: process.env.ABSTRACT_API_TOKEN
});
```

## Making a Request

Lets get started by loading a list of accessible projects from the API. All of the methods in the SDK return a promise, you may use traditional promise syntax or async / await if your JS runtime supports it.

```js
const projects = await abstract.projects.list();
projects.map(project => {
  console.log(`${project.name}: ${project.id}`);
});
```

  > A note on environments: The SDK can load data either from the API or the CLI that is bundled with your local copy of the Abstract desktop application.