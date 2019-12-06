---
id: usage
title: Usage
---

An SDK client instance exposes different namespaces for different types of resources, like `client.projects` or `client.comments`. Each of these namespaces exposes various query methods, like `client.projects.list()` or `client.projects.info()`.

See the [API reference](/docs/abstract-api) for all available namespaces and their methods.

## Basic usage

The following example demonstrates how to query all available projects. All SDK methods are asynchronous and return a `Promise`.

```js
const projects = await client.projects.list();

projects.map(project => {
  console.log(`${project.name}: ${project.id}`);
});
```

## Complete example

The following example demonstrates how to authenticate, configure, then use the SDK to query all available projects.

```js
// Import the SDK client
import * as Abstract from "abstract-sdk";

// Create a client
const client = new Abstract.Client({
  // Use the cli if available, otherwise use the api
  transportMode: ["cli", "api"]
});

async function run() {
  // Query all projects
  const projects = await client.projects.list();

  // Iterate through each project
  for (const project of projects) {
    // Log the number of branches
    const branches = await client.branches.list({ projectId: project.id });
    console.log(`${project.name}: ${branches.length} branches`);
  }
}

run();
```

## Going further

The example above demonstrates basic SDK authentication, configuration, and usage. From here, it's  possible to use the [API reference](/docs/abstract-api) to dig deeper. Try loading branches, commits, comments, artboard data, and more.
